import mongoose from 'mongoose';
const schema = new mongoose.Schema({
 applicationId:Number,
 userId:Number,
 jobId:Number,
 action:String,
 timestamp:{type:Date,default:Date.now}
});
export default mongoose.model('ApplicationLog',schema,'application_logs');
