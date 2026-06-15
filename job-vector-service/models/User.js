import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: Number,
  name: String,
  email: String,
  role: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model(
  "User",
  schema,
  "users"
);