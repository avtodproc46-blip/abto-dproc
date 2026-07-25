import { useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from '../modules/home/pages/HomePage/HomePage';
import { TestsPage } from '../modules/tests/pages/TestsPage/TestsPage';
import { TicketQuizPage } from '../modules/quiz/pages/TicketQuizPage/TicketQuizPage';
import { RandomExamPage } from '../modules/quiz/pages/RandomExamPage/RandomExamPage';
import { ResultPage } from '../modules/quiz/pages/ResultPage/ResultPage';
import { UserGate } from '../modules/users/components/UserGate/UserGate';
import { loadStoredUser } from '../modules/users/api/user-storage';
import type { UserModel } from '../modules/users/types/user-model.type';
import './styles/global.css';

export function App() {
  const [user, setUser] = useState<UserModel | null>(() => loadStoredUser());

  if (!user) {
    return (
      <div className="app-shell">
        <UserGate onReady={setUser} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <strong>Avto Dproc</strong>
          <span>{user.name}</span>
        </Link>
        <nav className="row">
          <Link to="/tests">Թեստեր</Link>
          <Link to="/quiz/random">Random</Link>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={<HomePage user={user} onLogout={() => setUser(null)} />}
        />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/quiz/ticket/:testId" element={<TicketQuizPage />} />
        <Route path="/quiz/random" element={<RandomExamPage />} />
        <Route path="/quiz/result" element={<ResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
