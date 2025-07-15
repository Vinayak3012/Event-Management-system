require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

//routes
const eventRoutes = require("./routes/event");
const userRoutes = require("./routes/user");
const registerRoutes = require("./routes/registration");

app.use(express.json());

app.use("/api/event", eventRoutes);
app.use("/api/user", userRoutes);
app.use("/api/registration", registerRoutes);

app.listen(port, () => {
  console.log("app is listening");
});
