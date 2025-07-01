import mongoose from "mongoose";
import dotenv from "dotenv";
import Candidate from "../models/candidate.model.js";

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/your-db-name", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Connected");
  seedCandidates();
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Generate mock data
const generateMockCandidates = (count) => {
  const candidates = [];
  for (let i = 1; i <= count; i++) {
    candidates.push({
      candidateId: `CANDIDATE-${i}`,
      fullName: `Candidate ${i}`,
      email: `candidate${i}@example.com`,
      phone: `12345678${String(i).padStart(3, "0")}`,
      category: "placement"
    });
  }
  return candidates;
};

const seedCandidates = async () => {
  try {
    await Candidate.deleteMany(); // optional: clear old data
    const mockData = generateMockCandidates(1000); // or any number you want
    await Candidate.insertMany(mockData);
    console.log("✅ Seeder: Candidates inserted!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeder Error:", error);
    process.exit(1);
  }
};
