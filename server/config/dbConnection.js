import mongoose from "mongoose";

mongoose.set('strictQuery', false);

const connectionDB = async () => {
    try {
        console.log('Connecting to MongoDB...');

        const mongoUrl = process.env.MONGO_URL || `mongodb://localhost:27017/lms`;
        const { connection } = await mongoose.connect(mongoUrl);

        if (connection) {
            console.log(`Connected to MongoDB: ${connection.host}`);
        }
    } catch (err) {
        console.error('MongoDB connection error:', err.message || err);
        process.exit(1);
    }
};

export default connectionDB;