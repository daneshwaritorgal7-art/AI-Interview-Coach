import { useEffect, useState } from "react";

function History() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/sessions`)
      .then((response) => response.json())
      .then((data) => {
        setSessions(data.sessions || []);
      })
      .catch((error) => {
        console.error("History error:", error);
      });
  }, []);

  return (
    <div>
      <h1>Interview History</h1>

      {sessions.length === 0 ? (
        <p>No interviews yet.</p>
      ) : (
        sessions
          .slice()
          .reverse()
          .map((session) => (
            <div key={session.id}>
              <h3>{session.questionText}</h3>

              <p>
                Score: {session.analysis.score}/100
              </p>

              <p>
                WPM: {session.analysis.wpm}
              </p>

              <p>
                Filler Words: {session.analysis.fillerWords}
              </p>

              <hr />
            </div>
          ))
      )}
    </div>
  );
}

export default History;