import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { LiveTranslation } from "./components/LiveTranslation";
import { LearningMode } from "./components/LearningMode";
import { PracticeMode } from "./components/PracticeMode";
import { Accessibility } from "./components/Accessibility";
import { Reviews } from "./components/Reviews";
import { Footer } from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OAuthCallback from "./pages/OAuthCallback";
import UserStatsPage from "./pages/UserStatsPage";
import LessonPage from "./pages/LessonPage";
import DesignCourseApp from "./DesignCourses";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";

function Home() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navigation toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <main>
          <Hero />
          <div id="live-translation">
            <LiveTranslation />
          </div>
          <div id="learning-mode">
            <LearningMode />
          </div>
          <div id="practice-mode">
            <PracticeMode />
          </div>
          <Accessibility />
          <Reviews />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/oauth" element={<OAuthCallback />} />
      <Route path="/stats" element={<UserStatsPage />} />
      <Route
        path="/lesson/:courseId"
        element={
          <ProtectedRoute>
            <LessonPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course/:courseId"
        element={
          <ProtectedRoute>
            <DesignCourseApp />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
