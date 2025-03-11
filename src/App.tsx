import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./auth/auth-context";
import { AuthModalProvider } from "./auth/auth-modal-context";

import Home from "./pages/Home";
import CourseContent from "./pages/CourseContent";
import NotFound from "./pages/404";
import AuthModals from "./auth/auth-modals";
import ProtectedRoute from "./components/protectedRoute";
import CourseForm from "../src/admin/courseForm";

function App() {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/course-content" element={<CourseContent />} />
            <Route path="*" element={<Navigate to="/404" />} />
            <Route path="/404" element={<NotFound />} />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CourseForm />
                </ProtectedRoute>
              }
            />
          </Routes>
          <AuthModals />
        </Router>
      </AuthModalProvider>
    </AuthProvider>
  );
}

export default App;
