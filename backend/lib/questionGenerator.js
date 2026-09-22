const questions = {
  "software-developer": [
    "Tell me about yourself.",
    "Explain one of your software projects.",
    "What programming languages are you comfortable with?",
    "What is the difference between an array and a linked list?",
    "How do you debug a program?"
  ],

  "frontend-developer": [
    "Tell me about yourself.",
    "What is the difference between HTML, CSS and JavaScript?",
    "What is React?",
    "What are React components?",
    "How do you make a website responsive?"
  ],

  "backend-developer": [
    "Tell me about yourself.",
    "What is REST API?",
    "What is the difference between SQL and NoSQL?",
    "Explain authentication and authorization.",
    "How do you handle errors in a backend application?"
  ],

  "data-analyst": [
    "Tell me about yourself.",
    "What is data analysis?",
    "What is the difference between mean, median and mode?",
    "What is SQL?",
    "How do you handle missing data?"
  ],

  "machine-learning": [
    "Tell me about yourself.",
    "What is machine learning?",
    "What is the difference between supervised and unsupervised learning?",
    "What is overfitting?",
    "Explain the difference between classification and regression."
  ],

  "full-stack": [
    "Tell me about yourself.",
    "What is the difference between frontend and backend?",
    "What is REST API?",
    "What is React?",
    "How does a frontend communicate with a backend?"
  ]
};

function generateQuestion(jobRole) {
  const roleQuestions =
    questions[jobRole] || questions["software-developer"];

  const randomIndex = Math.floor(
    Math.random() * roleQuestions.length
  );

  return roleQuestions[randomIndex];
}

export { generateQuestion };