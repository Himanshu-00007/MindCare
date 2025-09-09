import mongoose from "mongoose";
const connectDb=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_DB_URL}`);
        //console.log(connectionInstance.connection.host);
        console.log("mongodb connected successfully")
    }
    catch(error){
        console.log("mongodb connection failed",error);
        process.exit(1);
    }
}
export default connectDb;