import express from "express";
import cors from "cors";
import fs from "fs";
import apiRoutes from "./routes/api.js";

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Load interview questions
const questions = JSON.parse(
  fs.readFileSync("./data/questions.json", "utf-8")
);

// Connect API routes
app.use("/api", apiRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "AI Interview Coach Backend is running!"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend API is working"
  });
});

// Get random interview question
app.get("/api/question", (req, res) => {
  const type = req.query.type;

  let filteredQuestions = questions;

  // Filter questions by type
  if (type) {
    filteredQuestions = questions.filter(
      (question) => question.type === type
    );
  }

  // If no questions found
  if (filteredQuestions.length === 0) {
    return res.status(404).json({
      error: "No questions found for this type"
    });
  }

  // Select a random question
  const randomIndex = Math.floor(
    Math.random() * filteredQuestions.length
  );

  const randomQuestion = filteredQuestions[randomIndex];

  res.json(randomQuestion);
});

// Start server
// Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});