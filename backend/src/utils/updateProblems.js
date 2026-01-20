/*backend/src/utils/updateProblems.js*/
import mongoose from "mongoose";
import dotenv from "dotenv";
import Problem from "../models/Problem.model.js";

dotenv.config();

const updateProblems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const problems = await Problem.find();
    console.log(`📊 Found ${problems.length} problems\n`);

    for (const problem of problems) {
      let needsUpdate = false;

   problem.testCases = problem.testCases.map((tc, index) => {
  if (index < 2) tc.size = "small";
  else if (index < 4) tc.size = "medium";
  else tc.size = "large";
  return tc;
});

needsUpdate = true;


      if (needsUpdate) {
        await problem.save();
        console.log(`✅ Updated: ${problem.title}`);
      } else {
        console.log(`⏭️  Skipped: ${problem.title}`);
      }
    }

    console.log("\n✅ All done!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

updateProblems();