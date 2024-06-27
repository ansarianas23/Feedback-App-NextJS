import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already Connected to database")
        return
    }

    try {
        // Attempt to connect database
        const db = await mongoose.connect(process.env.MONGO_URI || '', {})
        connection.isConnected = db.connections[0].readyState;
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Database Connection failed", error);
        // Graceful exit in case of a connection error
        process.exit(1);
    }
}

export default dbConnect