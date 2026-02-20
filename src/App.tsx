import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import DashboardPage from "./pages/DashboardPage";
import MatchDetailsPage from "./pages/MatchDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Navigate to="/matches" replace />} />
          <Route path="matches" element={<DashboardPage />} />
          <Route path="match/:id" element={<MatchDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
