import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Identifier (e.g., 'userId')
  sequence_value: { type: Number, required: true }, // Last used value
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
