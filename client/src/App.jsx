import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LocalGame from './pages/LocalGame.jsx';
import OnlineLobby from './pages/OnlineLobby.jsx';
import OnlineGame from './pages/OnlineGame.jsx';

export default function App() {
    return (
        <div className="min-h-screen bg-game">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/local" element={<LocalGame />} />
                <Route path="/online" element={<OnlineLobby />} />
                <Route path="/online/game" element={<OnlineGame />} />
            </Routes>
        </div>
    );
}
