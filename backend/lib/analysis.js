// AI Interview Coach - Answer Analysis Engine

// Common filler words used during speaking
const FILLER_WORDS = [
  "um",
  "uh",
  "like",
  "basically",
  "actually",
  "literally",
  "you know",
  "i mean"
];

// Count filler words in the transcript
export function countFillerWords(text) {
  if (!text || typeof text !== "string") {
    return {
      count: 0,
      words: {}
    };
  }

  const lowerText = text.toLowerCase();
  const result = {};
  let total = 0;

  for (const filler of FILLER_WORDS) {
    const escaped = filler.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(`\\b${escaped}\\b`, "g");
    const matches = lowerText.match(regex);

    const count = matches ? matches.length : 0;

    if (count > 0) {
      result[filler] = count;
      total += count;
    }
  }

  return {
    count: total,
    words: result
  };
}


// Calculate words per minute
export function wordsPerMinute(text, durationSeconds) {
  if (!text || !durationSeconds || durationSeconds <= 0) {
    return 0;
  }

  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const wordCount = words.length;

  return Math.round((wordCount / durationSeconds) * 60);
}


// Detect STAR structure
export function detectStarStructure(text) {
  if (!text || typeof text !== "string") {
    return {
      situation: false,
      task: false,
      action: false,
      result: false,
      score: 0
    };
  }

  const lowerText = text.toLowerCase();

  const situationKeywords = [
    "when",
    "during",
    "while",
    "situation",
    "project",
    "problem",
    "challenge"
  ];

  const taskKeywords = [
    "task",
    "responsible",
    "responsibility",
    "required",
    "goal",
    "needed to"
  ];

  const actionKeywords = [
    "i developed",
    "i created",
    "i implemented",
    "i designed",
    "i solved",
    "i worked",
    "i analyzed",
    "i built",
    "i improved",
    "i decided"
  ];

  const resultKeywords = [
    "result",
    "finally",
    "successfully",
    "improved",
    "increased",
    "decreased",
    "reduced",
    "saved",
    "achieved",
    "%",
    "completed"
  ];

  const containsKeyword = (keywords) => {
    return keywords.some((keyword) =>
      lowerText.includes(keyword)
    );
  };

  const situation = containsKeyword(situationKeywords);
  const task = containsKeyword(taskKeywords);
  const action = containsKeyword(actionKeywords);
  const result = containsKeyword(resultKeywords);

  const score =
    Number(situation) +
    Number(task) +
    Number(action) +
    Number(result);

  return {
    situation,
    task,
    action,
    result,
    score
  };
}


// Calculate answer quality score
export function calculateScore({
  fillerCount,
  wpm,
  starScore,
  questionType
}) {
  let score = 100;

  // Penalize excessive filler words
  if (fillerCount <= 2) {
    score += 0;
  } else if (fillerCount <= 5) {
    score -= 5;
  } else if (fillerCount <= 10) {
    score -= 10;
  } else {
    score -= 20;
  }

  // Evaluate speaking speed
  if (wpm === 0) {
    score -= 10;
  } else if (wpm < 90) {
    score -= 10;
  } else if (wpm <= 160) {
    score += 0;
  } else if (wpm <= 190) {
    score -= 5;
  } else {
    score -= 10;
  }

  // STAR evaluation for behavioral questions
  if (questionType === "behavioral") {
    if (starScore === 4) {
      score += 0;
    } else if (starScore === 3) {
      score -= 5;
    } else if (starScore === 2) {
      score -= 10;
    } else if (starScore === 1) {
      score -= 15;
    } else {
      score -= 20;
    }
  }

  // Keep score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return score;
}


// Main transcript analysis function
export function analyzeTranscript({
  text,
  durationSeconds,
  questionType = "behavioral"
}) {
  const fillerAnalysis = countFillerWords(text);

  const wpm = wordsPerMinute(
    text,
    durationSeconds
  );

  const starAnalysis = detectStarStructure(text);

  const score = calculateScore({
    fillerCount: fillerAnalysis.count,
    wpm,
    starScore: starAnalysis.score,
    questionType
  });

  return {
    score,
    wpm,
    fillerWords: fillerAnalysis.count,
    fillerDetails: fillerAnalysis.words,
    star: starAnalysis,
    questionType
  };
}