import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import app from './app.js';
import connectionDB from "./config/dbConnection.js";

const PORT = process.env.PORT || 5000;

const startApp = async () => {
    await connectionDB();
    app.listen(PORT, () => {
        console.log(`App is running at http://localhost:${PORT}`);
    });
};

startApp();

