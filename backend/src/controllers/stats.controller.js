//backend/src/controllers/stats.controller.js
import Submission from "../models/Submission.model.js";

export const getMyStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const submissions = await Submission.find({ user: userId });

    const totalSubmissions = submissions.length;

    const acceptedSubmissions = submissions.filter(
      s => s.status === "Accepted"
    ).length;

    const solvedProblems = new Set(
      submissions
        .filter(s => s.status === "Accepted")
        .map(s => s.problem.toString())
    ).size;
const avgScore =
  submissions.length > 0
    ? Math.round(
        submissions.reduce((sum, s) => sum + (s.score || 0), 0) /
        submissions.length
      )
    : 0;

   res.status(200).json({
  totalSubmissions,
  acceptedSubmissions,
  solvedProblems,
  avgScore
});

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
