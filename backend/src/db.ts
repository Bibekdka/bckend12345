import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        // Debug: Log if DB_URI is set
        if (!process.env.DB_URI) {
            console.error('ERROR: DB_URI environment variable is not set!');
            console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('DB') || k.includes('MONGO')));
        } else {
            // Mask the password for security
            const maskedUri = process.env.DB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
            console.log('DB_URI is set:', maskedUri);
        }
        
        const conn = await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/restaurant-app');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
