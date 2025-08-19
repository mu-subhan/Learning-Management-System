import { app } from "./app";
import dotenv from "dotenv";
import connectDB from "./utils/db";


dotenv.config();

// create server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    connectDB();
});
