import mongoose from 'mongoose';
const schema = new mongoose.Schema({
 jobId:Number,
 title:String,
 description:String,
 skills:[String],
 location:String
});
export default mongoose.model('JobDescription',schema,'job_descriptions');
