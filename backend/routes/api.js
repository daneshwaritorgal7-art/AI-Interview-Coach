import express from "express";
import { analyzeTranscript } from "../lib/analysis.js";
import { generateFeedback } from "../lib/feedback.js";
import { saveSession, getSessions } from "../db.js";

const router = express.Router();


// ==========================================
// POST /api/answer
// ==========================================

router.post("/answer", async (req, res) => {
  try {

    const {
      questionId,
      questionText,
      questionType,
      transcript,
      durationSeconds
    } = req.body;


    // Validate input
    if (!transcript || !durationSeconds) {

      return res.status(400).json({
        success: false,
        error: "Transcript and durationSeconds are required"
      });

    }


    // ==========================================
    // STEP 1: Analyze transcript
    // ==========================================

    const analysis = analyzeTranscript({

      text: transcript,

      durationSeconds,

      questionType: questionType || "behavioral"

    });


    // ==========================================
    // STEP 2: Generate feedback
    // ==========================================

    const aiFeedback = generateFeedback({

      questionType: questionType || "behavioral",

      transcript: transcript,

      analysis: analysis

    });


    console.log("AI FEEDBACK GENERATED:");
    console.log(aiFeedback);


    // ==========================================
    // STEP 3: Save session
    // ==========================================

    const session = await saveSession({

      questionId: questionId,

      questionText: questionText,

      questionType: questionType || "behavioral",

      transcript: transcript,

      durationSeconds: durationSeconds,

      analysis: analysis,

      aiFeedback: aiFeedback

    });


    // ==========================================
    // STEP 4: Return response
    // ==========================================

    res.json({

      success: true,

      analysis: analysis,

      aiFeedback: aiFeedback,

      session: session

    });


  } catch (error) {

    console.error("Answer processing error:");

    console.error(error);


    res.status(500).json({

      success: false,

      error: "Failed to process interview answer",

      details: error.message

    });

  }

});


// ==========================================
// GET /api/sessions
// ==========================================

router.get("/sessions", async (req, res) => {

  try {

    const sessions = await getSessions();

    res.json({

      success: true,

      sessions: sessions

    });

  } catch (error) {

    console.error("Session retrieval error:");

    console.error(error);

    res.status(500).json({

      success: false,

      error: "Failed to retrieve sessions"

    });

  }

});


// ==========================================
// GET /api/health
// ==========================================

router.get("/health", (req, res) => {

  res.json({

    success: true,

    message: "AI Interview Coach API is running"

  });

});


// ==========================================
// EXPORT ROUTER
// ==========================================

export default router;