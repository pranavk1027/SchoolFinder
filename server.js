const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const app = express();

 
app.use(cors());
app.use(express.json());

 
const schoolRoutes = require("./routes/schools");
app.use("/api", schoolRoutes);

 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
