import Counter from "../models/counter.model.js";

const generateUniqueId = async (prefix) => {
    const counter = await Counter.findByIdAndUpdate(
      { _id: prefix }, // Unique ID for each prefix (CD, AG, TR)
      { $inc: { sequence_value: 1 } }, // Increment counter
      { new: true, upsert: true } // Create if not exists
    );
  
    return `${prefix}${String(counter.sequence_value).padStart(4, "0")}`; // Format as "CD0001"
  };
  
  export default generateUniqueId;