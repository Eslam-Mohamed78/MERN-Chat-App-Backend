import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_URL);

    console.log(`DB Connected Successfully: ${connect.connection.host}`.cyan.underline);
    // console.log(connect);

  } catch (error) {
    console.log(`Fail to connect DB...${error}`.red.bold);
  }
};
 
export default connectDB