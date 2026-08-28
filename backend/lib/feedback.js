export function generateFeedback({
  questionType,
  transcript,
  analysis
}) {
  const strengths = [];
  const improvements = [];

  // -----------------------------
  // 1. Score-based feedback
  // -----------------------------

  if (analysis.score >= 85) {
    strengths.push(
      "Your answer is well structured and communicates the main idea clearly."
    );
  } else if (analysis.score >= 70) {
    strengths.push(
      "Your answer is reasonably clear, but there is room for improvement."
    );
  } else {
    improvements.push(
      "Try to structure your answer more clearly and focus on the main points."
    );
  }

  // -----------------------------
  // 2. Filler word analysis
  // -----------------------------

  if (analysis.fillerWords === 0) {
    strengths.push(
      "You avoided common filler words, which makes your response sound confident."
    );
  } else if (analysis.fillerWords <= 2) {
    strengths.push(
      "You used only a small number of filler words."
    );
  } else {
    improvements.push(
      `Try to reduce filler words. You used ${analysis.fillerWords} filler words in this answer.`
    );
  }

  // -----------------------------
  // 3. Speaking speed
  // -----------------------------

  if (analysis.wpm < 100) {
    improvements.push(
      `Your speaking pace was relatively slow at ${analysis.wpm} WPM. Try to speak slightly faster.`
    );
  } else if (analysis.wpm <= 160) {
    strengths.push(
      `Your speaking pace of ${analysis.wpm} WPM is within a comfortable interview range.`
    );
  } else {
    improvements.push(
      `Your speaking pace was fast at ${analysis.wpm} WPM. Try slowing down slightly for clarity.`
    );
  }

  // -----------------------------
  // 4. STAR analysis
  // -----------------------------

  if (questionType === "behavioral") {
    if (analysis.star.score === 4) {
      strengths.push(
        "Your answer contains all four STAR elements: Situation, Task, Action, and Result."
      );
    } else {
      const missing = [];

      if (!analysis.star.situation) missing.push("Situation");
      if (!analysis.star.task) missing.push("Task");
      if (!analysis.star.action) missing.push("Action");
      if (!analysis.star.result) missing.push("Result");

      improvements.push(
        `Your answer could be stronger by adding: ${missing.join(", ")}.`
      );
    }
  }

  // -----------------------------
  // 5. Generate overall feedback
  // -----------------------------

  let feedback;

  if (analysis.score >= 85) {
    feedback =
      "Excellent response. Your answer is structured and demonstrates good interview communication. Focus on maintaining this clarity while adding specific details where possible.";
  } else if (analysis.score >= 70) {
    feedback =
      "Good response with a solid foundation. Improve the structure, provide more specific examples, and work on the communication areas identified below.";
  } else {
    feedback =
      "Your answer needs some improvement. Focus on structuring your response, reducing unnecessary words, and providing specific examples or measurable results.";
  }

  // -----------------------------
  // 6. Follow-up question
  // -----------------------------

  let followUpQuestion;

  if (questionType === "behavioral") {
    followUpQuestion =
      "What was the biggest challenge you faced, and how did you overcome it?";
  } else {
    followUpQuestion =
      "Can you explain your approach and why you chose that solution?";
  }

  return {
    feedback,
    strengths,
    improvements,
    followUpQuestion
  };
}