const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoute = require("./routes/auth");
const mapRoute = require("./routes/map");
const textRoute = require("./routes/text");
const contactRoute = require("./routes/contact");
const PORT = 8800;

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.use("/api/auth", authRoute);
app.use("/api/map", mapRoute);
app.use("/api/text", textRoute);
app.use("/api/contact", contactRoute);

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
