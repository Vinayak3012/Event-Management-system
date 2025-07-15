const pool = require("../db/index");
module.exports.create = async (req, res) => {
  let { user_id, event_id } = req.body;
  if (!user_id || !event_id) {
    return res.status(400).json({ message: "Missing user_id or event_id" });
  }
  try {
    const event = await pool.query(`SELECT * FROM events WHERE id = $1`, [
      event_id,
    ]);
    if (event.rows[0].date_time > new Date()) {
      const no_of_registrations = await pool.query(
        `SELECT COUNT(*) FROM registrations WHERE event_id = $1`,
        [event_id]
      );
      if (no_of_registrations.rows[0].count > event.rows[0].capacity) {
        res.statusCode(409).json({ message: "Event is full!" });
      } else {
        await pool.query(
          `INSERT INTO registrations(user_id,event_id) VALUES ($1, $2)
         RETURNING *`,
          [user_id, event_id]
        );
        res.status(201).json({
          message: "Registration Completed Successfully!",
        });
      }
    } else {
      res.status(410).json({
        message: "Event already completed. Registration closed.",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.all = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        events.id AS event_id,
        events.title AS event_title,
        events.date_time AS datetime,
        events.location AS location,
        events.capacity AS capacity,
        users.id AS user_id,
        users.name AS user_name,
        users.email AS user_email
        FROM events
        LEFT JOIN registrations ON events.id = registrations.event_id
        LEFT JOIN users ON registrations.user_id = users.id
        ORDER BY events.id;
     `
    );
    res.status(200).json({
      data: result.rows,
      message: "Data Extract Successfully!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.cancel = async (req, res) => {
  let { user_id, event_id } = req.params;
  if (!user_id || !event_id) {
    return res.status(400).json({ message: "Missing user_id or event_id" });
  }
  try {
    const result = await pool.query(
      `
      DELETE FROM registrations WHERE user_id = $1 AND event_id = $2
     `,
      [user_id, event_id]
    );
    if (result.rowCount == 0) {
      res.status(400).json({
        message: "User Wasn't Registered !",
      });
    } else {
      res.status(200).json({
        message: "Registration Cancel Successfully!",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.status = async (req, res) => {
  let { event_id } = req.params;
  if (!event_id) {
    return res.status(400).json({ message: "Missing event_id" });
  }
  try {
    const no_of_registrations = await pool.query(
      `
        SELECT COUNT(*) FROM registrations WHERE event_id = $1;
        `,
      [event_id]
    );
    let register_count = parseInt(no_of_registrations.rows[0].count);

    const capacity_event = await pool.query(
      `
        SELECT * FROM events WHERE id=$1;
        `,
      [event_id]
    );
    if (capacity_event.rowCount === 0) {
      res.status(400).json({ message: "Event wasn't Exist" });
    }

    let capacity = parseInt(capacity_event.rows[0].capacity);
    let capacity_remaining = capacity - register_count;
    let percentage_capacity_used = (register_count / capacity) * 100;

    const status = {
      number_of_registrations: register_count,
      remaining_capacity: capacity_remaining,
      percentage_capacity_usedL: percentage_capacity_used,
    };

    res
      .status(200)
      .json({ status: status, message: "Event Status Data Load Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
