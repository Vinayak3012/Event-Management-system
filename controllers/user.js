const pool = require("../db/index");
module.exports.create = async (req, res) => {
  let { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Missing Name or Email" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO users(name,email) VALUES ($1, $2)
      RETURNING *`,
      [name, email]
    );
    res.status(201).json({
      user_id: result.rows[0].id,
      message: "Users Created Successfully!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
