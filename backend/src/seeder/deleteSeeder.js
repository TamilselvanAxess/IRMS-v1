import Candidate from "../models/candidate.model.js";

const deleteCandidates = async () => {
  try {
    await Candidate.deleteMany({});
    console.log("🗑️ All candidates deleted!");
    process.exit();
  } catch (error) {
    console.error("❌ Deletion error:", error);
    process.exit(1);
  }
};

deleteCandidates();
