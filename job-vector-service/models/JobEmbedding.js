import mongoose from 'mongoose';
const schema = new mongoose.Schema({
 jobId:Number,
 embedding:[Number]
});
export default mongoose.model('JobEmbedding',schema,'job_embeddings');
