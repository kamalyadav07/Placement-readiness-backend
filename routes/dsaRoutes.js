const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const DSAProgress = require("../models/DSAProgress");

// ✅ POST - Add or Update DSA Progress
router.post("/update", async (req, res) => {
  try {
    const { userId, topic, solvedCount, targetCount } = req.body;

    if (!userId || !topic) {
      return res.status(400).json({
        error: "userId and topic are required fields.",
      });
    }

    const progress = await DSAProgress.findOneAndUpdate(
      { userId, topic },
      {
        solvedCount: solvedCount ?? 0,
        targetCount: targetCount ?? 0,
        updatedAt: Date.now(),
      },
      { new: true, upsert: true }
    );

    res.status(200).json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Fetch all DSA Progress for a user
router.get("/:userId", async (req, res) => {
  try {
    console.log("userId param →", req.params.userId);

    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
  return res.status(400).json({ error: "Invalid userId" });
}

const userId = new mongoose.Types.ObjectId(req.params.userId);


    const data = await DSAProgress.find({ userId });
    res.json(data);
  } catch (error) {
    console.error("🔥 ERROR:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// ✅ DELETE - Remove a DSA Progress record
router.delete("/:userId/:topic", async (req, res) => {
  try {
    const { userId, topic } = req.params;

    const result = await DSAProgress.findOneAndDelete({
      userId,
      topic,
    });

    if (!result) {
      return res.status(404).json({ message: "Progress record not found." });
    }

    res.json({ message: "Progress record deleted successfully." });
  } catch (error) {
    console.error("🔥 DELETE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET - Aggregated stats for a user
router.get("/stats/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

     if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const stats = await DSAProgress.aggregate([
  { $match: { userId: new mongoose.Types.ObjectId(userId) } },
  {
    $group: {
      _id: "$userId",
      totalSolved: { $sum: "$solvedCount" },
      totalTarget: { $sum: "$targetCount" },
      topics: {
        $push: {
          topic: "$topic",
          solved: "$solvedCount",
          target: "$targetCount",
        },
      },
    },
  },
]);

    if (stats.length === 0) {
      return res.status(404).json({ message: "No progress found for user." });
    }

    res.json(stats[0]);
  } catch (error) {
    console.error("🔥 AGGREGATION ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
