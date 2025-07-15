const pool = require("../db/index");

module.exports.create = async (req, res) => {
  let { title, date_time, location, capacity } = req.body;
  if (!title || !date_time || !location || !capacity) {
    return res.status(400).json({ message: "Missing Data" });
  }

  if (capacity < 0 || capacity > 1000) {
    res
      .status(400)
      .json({ message: "Please ensure your capacity is between 1 to 1000!" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO events(title, date_time, location, capacity) VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [title, date_time, location, capacity]
    );
    res.status(201).json({
      event_id: result.rows[0].id,
      message: "Event Created Successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.filter = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT * FROM events WHERE date_time > NOW() ORDER BY date_time ASC, location ASC 
        `);
    res
      .status(201)
      .json({ events: result.rows, message: "Event Data Load Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
