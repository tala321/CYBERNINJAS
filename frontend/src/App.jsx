import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";

import Dashboard from "./pages/Dashboard";
import LevelDetails from "./pages/LevelDetails";
import UnitLessons from "./pages/UnitLessons";
import Lesson from "./pages/Lesson";
import Challenge from "./pages/Challenge";
import LevelComplete from "./pages/LevelComplete";

import BossChallenge from "./pages/BossChallenge";
import BossResult from "./pages/BossResult";

import Profile from "./pages/Profile";
import AvatarCustomization from "./pages/AvatarCustomization";
import Badges from "./pages/Badges";
import Missions from "./pages/Missions";
import Leaderboard from "./pages/Leaderboard";
import Shop from "./pages/Shop";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            HOME
        ========================= */}

        <Route path="/" element={<Home />} />


        {/* =========================
            AUTHENTICATION
        ========================= */}

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/onboarding" element={<Onboarding />} />


        {/* =========================
            CHILD EXPERIENCE
        ========================= */}

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/level/:levelId"
          element={<LevelDetails />}
        />

        <Route
          path="/unit/:unitId"
          element={<UnitLessons />}
        />

        <Route
          path="/lesson/:lessonId"
          element={<Lesson />}
        />

        <Route
          path="/challenge/:challengeId"
          element={<Challenge />}
        />

        <Route
          path="/level-complete/:levelId"
          element={<LevelComplete />}
        />


        {/* =========================
            BOSS
        ========================= */}

        <Route
          path="/boss/:levelId"
          element={<BossChallenge />}
        />

        <Route
          path="/boss-result/:bossId"
          element={<BossResult />}
        />


        {/* =========================
            PROFILE & REWARDS
        ========================= */}

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/profile/avatar"
          element={<AvatarCustomization />}
        />

        <Route
          path="/badges"
          element={<Badges />}
        />

        <Route
          path="/missions"
          element={<Missions />}
        />

        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />

        <Route
          path="/shop"
          element={<Shop />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;