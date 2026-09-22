
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StartInterview() {
  const navigate = useNavigate();

  const [jobRole, setJobRole] = useState("Python Developer");
  const [difficulty, setDifficulty] = useState("medium");

  const roles = [
    "Python Developer",
    "Data Scientist",
    "Data Analyst",
    "Frontend Developer",
    "Backend Developer",
    "Machine Learning Engineer",
    "Cybersecurity Engineer",
  ];

  const difficulties = [
    {
      value: "easy",
      label: "Easy",
      description: "Basic concepts and fundamentals",
    },
    {
      value: "medium",
      label: "Medium",
      description: "Technical and practical questions",
    },
    {
      value: "hard",
      label: "Hard",
      description: "Advanced technical questions",
    },
  ];

  const startInterview = () => {
    navigate(
      `/practice?role=${encodeURIComponent(
        jobRole
      )}&difficulty=${difficulty}`
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        background:
          "linear-gradient(135deg, #eef2ff, #f8fafc)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "white",
          borderRadius: "24px",
          padding: "40px",
          boxShadow:
            "0 15px 40px rgba(0,0,0,0.12)",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          <div
            style={{
              fontSize: "60px",
              marginBottom: "10px",
            }}
          >
            🤖
          </div>

          <h1
            style={{
              marginBottom: "10px",
            }}
          >
            AI Interview Coach
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            Prepare for your dream job with
            an AI-powered interview.
          </p>
        </div>


        {/* JOB ROLE */}

        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            👨‍💻 Select Job Role
          </label>

          <select
            value={jobRole}
            onChange={(e) =>
              setJobRole(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              fontSize: "16px",
              background: "white",
            }}
          >
            {roles.map((role) => (
              <option
                key={role}
                value={role}
              >
                {role}
              </option>
            ))}
          </select>
        </div>


        {/* DIFFICULTY */}

        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            🎯 Select Difficulty
          </label>

          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            {difficulties.map((item) => (

              <label
                key={item.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "15px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >

                <input
                  type="radio"
                  name="difficulty"
                  value={item.value}
                  checked={
                    difficulty === item.value
                  }
                  onChange={(e) =>
                    setDifficulty(
                      e.target.value
                    )
                  }
                />

                <div>
                  <strong>
                    {item.label}
                  </strong>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      marginTop: "3px",
                    }}
                  >
                    {item.description}
                  </div>
                </div>

              </label>

            ))}
          </div>
        </div>


        {/* START BUTTON */}

        <button
          onClick={startInterview}
          style={{
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "12px",
            background: "#2563eb",
            color: "white",
            fontSize: "17px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ▶ Start Interview
        </button>


        {/* INFO */}

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          Your AI interviewer will generate
          questions based on your selected role.
        </p>

      </div>
    </div>
  );
}

export default StartInterview;
