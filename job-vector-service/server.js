import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import vectorRoutes from './routes/vectorRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import applicationLogRoutes from "./routes/applicationLogRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('MongoDB Connected'))
.catch(console.error);

app.use('/api/vector', vectorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/logs", applicationLogRoutes);

app.listen(process.env.PORT, ()=>{
 console.log(`Server Running on ${process.env.PORT}`);
});
