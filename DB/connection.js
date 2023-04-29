import mongoose from 'mongoose';

export const connectionDB = async () =>
{
    return await mongoose
        .connect(process.env.DB_CLOUD) 
        .then((res) => { console.log('DB CONNECTED Done........!'); })
        .catch((err)=>{console.log('DB Connection DROPPED  ..!!!!');})
} 