
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Avatar from "../components/Avatar";

function Practice() {
  const [searchParams] = useSearchParams();

  const role =
    searchParams.get("role") || "Python Developer";

  const difficulty =
    searchParams.get("difficulty") || "medium";

  const [question, setQuestion] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [questionError, setQuestionError] = useState("");

  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // ==========================================
  // GET QUESTION FROM BACKEND
  // ==========================================

  const fetchQuestion = async () => {
    setLoadingQuestion(true);
    setQuestionError("");
    setQuestion(null);

    try {
      const url =
        `${import.meta.env.VITE_API_URL}/api/question` +
        `?role=${encodeURIComponent(role)}` +
        `&difficulty=${encodeURIComponent(difficulty)}`;

      const response = await fetch(url);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to generate question"
        );
      }

      if (!data.question) {
        throw new Error(
          "No question received from backend"
        );
      }

      console.log(
        "Generated question:",
        data.question
      );

      setQuestion(data.question);
    } catch (error) {
      console.error(
        "Question loading error:",
        error
      );

      setQuestionError(
        "Could not load interview question. " +
          "Make sure the backend is running on port 4000."
      );
    } finally {
      setLoadingQuestion(false);
    }
  };

  // ==========================================
  // LOAD QUESTION WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchQuestion();

    return () => {
      clearInterval(timerRef.current);

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [role, difficulty]);

  // ==========================================
  // START RECORDING
  // ==========================================

  const startRecording = () => {
    if (!question) {
      alert(
        "Please wait for the question to load."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported. Please use Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let newText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (event.results[i].isFinal) {
          newText +=
            event.results[i][0].transcript + " ";
        }
      }

      if (newText) {
        setTranscript((previous) => {
          return previous + newText;
        });
      }
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsRecording(false);

      clearInterval(timerRef.current);
    };

    recognition.onend = () => {
      setIsRecording(false);

      clearInterval(timerRef.current);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Could not start speech recognition:",
        error
      );

      return;
    }

    recognitionRef.current = recognition;

    startTimeRef.current = Date.now();

    setElapsedTime(0);

    setIsRecording(true);

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - startTimeRef.current) /
          1000
      );

      setElapsedTime(elapsed);
    }, 1000);
  };

  // ==========================================
  // STOP RECORDING
  // ==========================================

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();

      recognitionRef.current = null;
    }

    clearInterval(timerRef.current);

    setIsRecording(false);
  };

  // ==========================================
  // FORMAT TIMER
  // ==========================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(
      minutes
    ).padStart(2, "0");

    const formattedSeconds = String(
      remainingSeconds
    ).padStart(2, "0");

    return (
      formattedMinutes +
      ":" +
      formattedSeconds
    );
  };

  // ==========================================
  // SUBMIT ANSWER
  // ==========================================

  const submitAnswer = async () => {
    if (!question) {
      alert(
        "Interview question is not available."
      );
      return;
    }

    if (!transcript.trim()) {
      alert(
        "Please record or type your answer first."
      );
      return;
    }

    const duration =
      elapsedTime > 0 ? elapsedTime : 60;

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/answer`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            questionId: question.id,
            questionText: question.text,
            questionType:
              question.type || "technical",
            transcript: transcript,
            durationSeconds: duration,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to analyze answer"
        );
      }

      console.log(
        "Interview analysis:",
        data
      );

      setResult(data);
    } catch (error) {
      console.error(
        "Analysis error:",
        error
      );

      alert(
        "Could not connect to the backend. " +
          "Make sure the backend is running on port 4000."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLEAR ANSWER
  // ==========================================

  const clearAnswer = () => {
    setTranscript("");
    setResult(null);
    setElapsedTime(0);
  };

  // ==========================================
  // LOAD NEXT QUESTION
  // ==========================================

  const nextQuestion = async () => {
    stopRecording();

    setTranscript("");
    setResult(null);
    setElapsedTime(0);

    await fetchQuestion();
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "30px auto",
        padding: "20px",
        color: "#111827",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            color: "#111827",
          }}
        >
          🤖 AI Interview Coach
        </h1>

        <p
          style={{
            color: "#374151",
          }}
        >
          Your personalized interview for{" "}
          <strong>{role}</strong>
        </p>

        <p
          style={{
            color: "#64748b",
            textTransform: "capitalize",
          }}
        >
          Difficulty:{" "}
          <strong>{difficulty}</strong>
        </p>
      </div>

      {/* AVATAR */}

      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <Avatar />
      </div>

      {/* QUESTION CARD */}

      <div
        style={{
          padding: "30px",
          border: "1px solid #d1d5db",
          borderRadius: "15px",
          marginBottom: "25px",
          background: "#ffffff",

          // IMPORTANT:
          // Makes all text inside the card dark
          color: "#111827",

          boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#4b5563",
            marginBottom: "10px",
            fontWeight: "600",
          }}
        >
          {role} •{" "}
          {difficulty.toUpperCase()}
        </p>

        {/* LOADING */}

        {loadingQuestion && (
          <div
            style={{
              textAlign: "center",
              padding: "25px",
            }}
          >
            <h2
              style={{
                color: "#111827",
              }}
            >
              Generating your question...
            </h2>

            <p
              style={{
                color: "#4b5563",
              }}
            >
              🤖 Your AI interviewer is
              preparing a question.
            </p>
          </div>
        )}

        {/* ERROR */}

        {questionError && (
          <div
            style={{
              padding: "15px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "10px",
            }}
          >
            <strong>Error:</strong>{" "}
            {questionError}

            <br />

            <button
              onClick={fetchQuestion}
              style={{
                marginTop: "12px",
                padding: "8px 15px",
                cursor: "pointer",
                border: "none",
                borderRadius: "6px",
                background: "#ffffff",
                color: "#111827",
              }}
            >
              🔄 Try Again
            </button>
          </div>
        )}

        {/* QUESTION */}

        {question && !loadingQuestion && (
          <>
            <p
              style={{
                fontSize: "14px",
                color: "#111827",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              Question
            </p>

            <h2
              style={{
                fontSize: "26px",
                lineHeight: "1.5",
                marginBottom: "15px",

                // IMPORTANT:
                // Dark question text
                color: "#111827",

                fontWeight: "700",
              }}
            >
              {question.text}
            </h2>

            <p
              style={{
                color: "#4b5563",
              }}
            >
              Take your time and give a
              clear, structured answer.
            </p>
          </>
        )}
      </div>

      {/* TIMER */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            color: "#111827",
          }}
        >
          ⏱ {formatTime(elapsedTime)}
        </h2>

        {isRecording && (
          <p
            style={{
              color: "#dc2626",
              fontWeight: "600",
            }}
          >
            🔴 Recording in progress...
          </p>
        )}
      </div>

      {/* RECORD BUTTON */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <button
          onClick={
            isRecording
              ? stopRecording
              : startRecording
          }
          disabled={
            loadingQuestion ||
            !question
          }
          style={{
            padding: "14px 25px",
            fontSize: "16px",
            cursor:
              loadingQuestion ||
              !question
                ? "not-allowed"
                : "pointer",
            border: "none",
            borderRadius: "10px",
            background: isRecording
              ? "#dc2626"
              : "#2563eb",
            color: "#ffffff",
          }}
        >
          {isRecording
            ? "⏹ Stop Recording"
            : "🎙 Start Recording"}
        </button>
      </div>

      {/* TRANSCRIPT */}

      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h3
          style={{
            color: "#111827",
          }}
        >
          📝 Your Answer
        </h3>

        <textarea
          value={transcript}
          onChange={(e) =>
            setTranscript(e.target.value)
          }
          placeholder="Your speech transcript will appear here. You can also type your answer."
          rows={8}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
            border:
              "1px solid #cbd5e1",
            fontSize: "16px",
            resize: "vertical",
            boxSizing: "border-box",

            // Text typed inside textarea
            color: "#111827",

            backgroundColor: "#ffffff",
          }}
        />
      </div>

      {/* ACTION BUTTONS */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={submitAnswer}
          disabled={loading}
          style={{
            padding: "12px 20px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
            border: "none",
            borderRadius: "8px",
            background: "#16a34a",
            color: "#ffffff",
          }}
        >
          {loading
            ? "Analyzing..."
            : "📊 Analyze Answer"}
        </button>

        <button
          onClick={clearAnswer}
          style={{
            padding: "12px 20px",
            cursor: "pointer",
            border:
              "1px solid #cbd5e1",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#111827",
          }}
        >
          🗑 Clear
        </button>
      </div>

      {/* RESULTS */}

      {result && result.analysis && (
        <div
          style={{
            padding: "25px",
            border:
              "1px solid #d1d5db",
            borderRadius: "15px",
            marginBottom: "30px",
            background: "#ffffff",
            color: "#111827",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              color: "#111827",
            }}
          >
            📊 Interview Performance
          </h2>

          <div
            style={{
              display: "flex",
              gap: "40px",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            <div>
              <h3
                style={{
                  color: "#111827",
                }}
              >
                🎯 Score
              </h3>

              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                {result.analysis.score}/100
              </p>
            </div>

            <div>
              <h3
                style={{
                  color: "#111827",
                }}
              >
                🗣 WPM
              </h3>

              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                {result.analysis.wpm}
              </p>
            </div>

            <div>
              <h3
                style={{
                  color: "#111827",
                }}
              >
                🚫 Filler Words
              </h3>

              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                {result.analysis.fillerWords}
              </p>
            </div>
          </div>

          <hr />

          {/* STAR */}

          {result.analysis.star && (
            <>
              <h3
                style={{
                  color: "#111827",
                }}
              >
                ⭐ STAR Analysis
              </h3>

              <p
                style={{
                  color: "#111827",
                }}
              >
                Situation:{" "}
                {result.analysis.star
                  .situation
                  ? "✅"
                  : "❌"}
              </p>

              <p
                style={{
                  color: "#111827",
                }}
              >
                Task:{" "}
                {result.analysis.star.task
                  ? "✅"
                  : "❌"}
              </p>

              <p
                style={{
                  color: "#111827",
                }}
              >
                Action:{" "}
                {result.analysis.star.action
                  ? "✅"
                  : "❌"}
              </p>

              <p
                style={{
                  color: "#111827",
                }}
              >
                Result:{" "}
                {result.analysis.star.result
                  ? "✅"
                  : "❌"}
              </p>

              <strong
                style={{
                  color: "#111827",
                }}
              >
                STAR Score:{" "}
                {result.analysis.star.score}/4
              </strong>
            </>
          )}

          {/* FEEDBACK */}

          {result.aiFeedback && (
            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                background: "#f8fafc",
                borderRadius: "10px",
                color: "#111827",
              }}
            >
              <h3
                style={{
                  color: "#111827",
                }}
              >
                💡 AI Feedback
              </h3>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  color: "#111827",
                }}
              >
                {typeof result.aiFeedback ===
                "string"
                  ? result.aiFeedback
                  : JSON.stringify(
                      result.aiFeedback,
                      null,
                      2
                    )}
              </pre>
            </div>
          )}

          {/* NEXT QUESTION */}

          <div
            style={{
              textAlign: "center",
              marginTop: "25px",
            }}
          >
            <button
              onClick={nextQuestion}
              style={{
                padding: "14px 25px",
                border: "none",
                borderRadius: "10px",
                background: "#7c3aed",
                color: "#ffffff",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ➡️ Next Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Practice;

