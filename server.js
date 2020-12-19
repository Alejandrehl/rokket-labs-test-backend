const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(cors());
app.use(express.json({ extended: false }));
app.use("/api/monsters", require("./routes/monsters"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
