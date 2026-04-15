import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import morgan from "morgan";
import router from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials : true
}));

app.use(cookieParser());

app.use(morgan('dev'));

app.get('/ping', function(req,res) {
    res.send('pong'); // ✔️ correct
})
// routes of 3 modules

app.use('api/v1/user',router);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});
export default app;