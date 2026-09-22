
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Practice from "./pages/practice";
import History from "./pages/history";
import StartInterview from "./pages/StartInterview";

function App() {
  return (
    <BrowserRouter>

      {/* Top Navigation */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          padding: "15px 25px",
          borderBottom: "1px solid #e2e8f0",
          background: "white",
        }}
      >

        <h2
          style={{
            margin: 0,
            marginRight: "20px",
          }}
        >
          AI Interview Coach
        </h2>

        <Link to="/">
          Dashboard
        </Link>

        <Link to="/start">
          Start Interview
        </Link>

        <Link to="/practice">
          Practice
        </Link>

        <Link to="/history">
          History
        </Link>

      </nav>

      {/* Pages */}
      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/start"
          element={<StartInterview />}
        />

        <Route
          path="/practice"
          element={<Practice />}
        />

        <Route
          path="/history"
          element={<History />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

