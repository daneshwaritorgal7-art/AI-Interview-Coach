
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/sessions`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }

        return response.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <h2>Loading your dashboard...</h2>
        <p>Preparing your interview insights</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">!</div>

        <h2>Unable to load dashboard</h2>

        <p>
          Make sure your AI Interview Coach backend is running
          on port 4000.
        </p>

        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  const sessions = data?.sessions || [];

  const averageScore =
    sessions.length > 0
      ? Math.round(
          sessions.reduce(
            (sum, session) =>
              sum + (session.analysis?.score || 0),
            0
          ) / sessions.length
        )
      : 0;

  const averageWpm =
    sessions.length > 0
      ? Math.round(
          sessions.reduce(
            (sum, session) =>
              sum + (session.analysis?.wpm || 0),
            0
          ) / sessions.length
        )
      : 0;

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Keep Practicing";
  };

  const getScoreClass = (score) => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score >= 40) return "average";
    return "low";
  };

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            AI
          </div>

          <div>
            <h2>InterviewAI</h2>
            <span>Coach</span>
          </div>

        </div>


        <nav className="navigation">

          <Link
            to="/"
            className="nav-item active"
          >
            <span>DB</span>
            Dashboard
          </Link>


          <Link
            to="/start"
            className="nav-item"
          >
            <span>IN</span>
            Start Interview
          </Link>


          <Link
            to="/practice"
            className="nav-item"
          >
            <span>PR</span>
            Practice
          </Link>


          <Link
            to="/history"
            className="nav-item"
          >
            <span>HI</span>
            History
          </Link>

        </nav>


        <div className="sidebar-bottom">

          <div className="upgrade-card">

            <div className="upgrade-icon">
              +
            </div>

            <h4>Keep Improving</h4>

            <p>
              Practice regularly and improve
              your interview performance.
            </p>

            <Link to="/start">
              <button>
                Start Practice
              </button>
            </Link>

          </div>


          <div className="profile">

            <div className="avatar">
              D
            </div>

            <div>
              <strong>Candidate</strong>
              <span>Interview Student</span>
            </div>

          </div>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="main-content">

        {/* HEADER */}

        <header className="top-header">

          <div>

            <p className="welcome">
              WELCOME BACK
            </p>

            <h1>
              Interview Dashboard
            </h1>

            <p className="subtitle">
              Track your progress and improve your
              interview performance.
            </p>

          </div>


          <Link to="/start">
            <button className="practice-button">
              Start Interview
            </button>
          </Link>

        </header>


        {/* STAT CARDS */}

        <section className="stats-grid">


          <div className="stat-card purple">

            <div className="stat-top">

              <div className="stat-icon">
                INT
              </div>

              <span className="stat-badge">
                Activity
              </span>

            </div>

            <p>Total Interviews</p>

            <h2>
              {sessions.length}
            </h2>

            <div className="stat-footer">
              Completed sessions
            </div>

          </div>


          <div className="stat-card blue">

            <div className="stat-top">

              <div className="stat-icon">
                %
              </div>

              <span className="stat-badge">
                Score
              </span>

            </div>

            <p>Average Score</p>

            <h2>
              {averageScore}
              <small>/100</small>
            </h2>

            <div className="stat-footer">
              {getScoreLabel(averageScore)}
            </div>

          </div>


          <div className="stat-card green">

            <div className="stat-top">

              <div className="stat-icon">
                WPM
              </div>

              <span className="stat-badge">
                Speaking
              </span>

            </div>

            <p>Average WPM</p>

            <h2>
              {averageWpm}
            </h2>

            <div className="stat-footer">
              Words per minute
            </div>

          </div>


          <div className="stat-card orange">

            <div className="stat-top">

              <div className="stat-icon">
                AI
              </div>

              <span className="stat-badge">
                Progress
              </span>

            </div>

            <p>Performance</p>

            <h2
              className={getScoreClass(
                averageScore
              )}
            >
              {getScoreLabel(averageScore)}
            </h2>

            <div className="stat-footer">
              AI performance analysis
            </div>

          </div>

        </section>


        {/* ANALYTICS */}

        <section className="analytics-grid">


          {/* PERFORMANCE */}

          <div className="panel score-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Overall Performance
                </h2>

                <p>
                  Your average interview score
                </p>

              </div>

              <span className="three-dots">
                ...
              </span>

            </div>


            <div className="score-content">

              <div
                className="score-circle"
                style={{
                  "--score":
                    `${averageScore * 3.6}deg`,
                }}
              >

                <div className="score-inner">

                  <strong>
                    {averageScore}
                  </strong>

                  <span>
                    /100
                  </span>

                </div>

              </div>


              <div className="score-info">

                <h3>
                  {getScoreLabel(averageScore)}
                </h3>

                <p>
                  Your current average performance
                  across all completed interviews.
                </p>

                <div className="score-bar">

                  <div
                    style={{
                      width:
                        `${Math.min(
                          averageScore,
                          100
                        )}%`,
                    }}
                  ></div>

                </div>

                <small>
                  {averageScore}%
                  overall performance
                </small>

              </div>

            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="panel actions-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Quick Practice
                </h2>

                <p>
                  Improve your interview skills
                </p>

              </div>

            </div>


            <div className="action-list">


              <Link
                to="/start"
                className="action-item"
              >

                <div className="action-icon purple-bg">
                  GO
                </div>

                <div>

                  <strong>
                    Start Mock Interview
                  </strong>

                  <span>
                    Practice with AI
                  </span>

                </div>

                <b>
                  →
                </b>

              </Link>


              <Link
                to="/practice"
                className="action-item"
              >

                <div className="action-icon blue-bg">
                  CO
                </div>

                <div>

                  <strong>
                    Practice Communication
                  </strong>

                  <span>
                    Improve your speaking
                  </span>

                </div>

                <b>
                  →
                </b>

              </Link>


              <Link
                to="/history"
                className="action-item"
              >

                <div className="action-icon green-bg">
                  HI
                </div>

                <div>

                  <strong>
                    View Performance
                  </strong>

                  <span>
                    Analyze your results
                  </span>

                </div>

                <b>
                  →
                </b>

              </Link>

            </div>

          </div>

        </section>


        {/* RECENT INTERVIEWS */}

        <section className="panel history-panel">

          <div className="panel-header">

            <div>

              <h2>
                Recent Interviews
              </h2>

              <p>
                Your latest interview sessions
              </p>

            </div>


            <Link
              to="/history"
              className="view-all"
            >
              View All →
            </Link>

          </div>


          {sessions.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                AI
              </div>

              <h3>
                No interviews yet
              </h3>

              <p>
                Complete your first AI mock interview
                to see your performance here.
              </p>

              <Link to="/start">

                <button className="practice-button">
                  Start Your First Interview
                </button>

              </Link>

            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>Interview</th>
                    <th>Score</th>
                    <th>Speaking Speed</th>
                    <th>Performance</th>
                  </tr>

                </thead>


                <tbody>

                  {sessions
                    .slice(0, 5)
                    .map((session, index) => {

                      const score =
                        session.analysis?.score || 0;

                      const wpm =
                        session.analysis?.wpm || 0;

                      return (

                        <tr
                          key={
                            session.id || index
                          }
                        >

                          <td>

                            <div className="interview-name">

                              <div className="mini-icon">
                                AI
                              </div>

                              <div>

                                <strong>
                                  Mock Interview #
                                  {sessions.length - index}
                                </strong>

                                <span>
                                  AI Interview Session
                                </span>

                              </div>

                            </div>

                          </td>


                          <td>

                            <strong className="score-number">
                              {score}/100
                            </strong>

                          </td>


                          <td>
                            {wpm} WPM
                          </td>


                          <td>

                            <span
                              className={
                                `performance-badge ${
                                  getScoreClass(score)
                                }`
                              }
                            >
                              {getScoreLabel(score)}
                            </span>

                          </td>

                        </tr>

                      );

                    })}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;

