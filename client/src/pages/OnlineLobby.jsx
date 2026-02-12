import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function OnlineLobby() {
    const navigate = useNavigate();
    const [mode, setMode] = useState(null); // 'create' | 'join'
    const [playerName, setPlayerName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = () => {
        if (!playerName.trim()) return setError('Entre ton nom');
        setLoading(true);
        setError('');

        const socket = io(import.meta.env.VITE_SERVER_URL);
        socket.on('connect', () => {
            socket.emit('create-room', { playerName: playerName.trim() }, (res) => {
                socket.disconnect(); // Disconnect — OnlineGame will create its own
                if (res.success) {
                    navigate('/online/game', {
                        state: {
                            roomCode: res.roomCode,
                            playerId: res.playerId,
                            playerName: playerName.trim(),
                            isHost: true,
                        },
                    });
                } else {
                    setError(res.error || 'Erreur');
                    setLoading(false);
                }
            });
        });
        socket.on('connect_error', () => {
            setError('Impossible de se connecter au serveur');
            setLoading(false);
        });
    };

    const handleJoin = () => {
        if (!playerName.trim()) return setError('Entre ton nom');
        if (!roomCode.trim()) return setError('Entre le code du salon');
        setLoading(true);
        setError('');

        const socket = io(import.meta.env.VITE_SERVER_URL);
        socket.on('connect', () => {
            socket.emit('join-room', { roomCode: roomCode.trim().toUpperCase(), playerName: playerName.trim() }, (res) => {
                socket.disconnect(); // Disconnect — OnlineGame will create its own
                if (res.success) {
                    navigate('/online/game', {
                        state: {
                            roomCode: res.roomCode,
                            playerId: res.playerId,
                            playerName: playerName.trim(),
                            isHost: false,
                        },
                    });
                } else {
                    setError(res.error || 'Erreur');
                    setLoading(false);
                }
            });
        });
        socket.on('connect_error', () => {
            setError('Impossible de se connecter au serveur');
            setLoading(false);
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
            <div className="absolute top-20 right-20 w-64 h-64 bg-accent-600/15 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 glass-card-strong p-8 sm:p-10 max-w-md w-full animate-slide-up">
                <Link to="/" className="inline-flex items-center gap-1 text-white/40 hover:text-white/60 text-sm mb-6 transition-colors">
                    ← Retour
                </Link>

                <h2 className="font-display text-3xl font-bold bg-gradient-to-r from-accent-300 to-primary-300 bg-clip-text text-transparent mb-8">
                    Mode En Ligne
                </h2>

                {!mode && (
                    <div className="space-y-4">
                        <button
                            onClick={() => setMode('create')}
                            className="w-full glass-card p-6 text-left hover:bg-white/10 hover:border-accent-500/30 transition-all duration-200 cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl group-hover:animate-float">🏠</span>
                                <div>
                                    <div className="font-display font-bold text-white text-lg">Créer un salon</div>
                                    <div className="text-sm text-white/50">Invite tes amis avec un code</div>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => setMode('join')}
                            className="w-full glass-card p-6 text-left hover:bg-white/10 hover:border-primary-500/30 transition-all duration-200 cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl group-hover:animate-float">🔗</span>
                                <div>
                                    <div className="font-display font-bold text-white text-lg">Rejoindre un salon</div>
                                    <div className="text-sm text-white/50">Entre le code du salon</div>
                                </div>
                            </div>
                        </button>
                    </div>
                )}

                {mode && (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Ton pseudo</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Entre ton nom..."
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                maxLength={20}
                            />
                        </div>

                        {mode === 'join' && (
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Code du salon</label>
                                <input
                                    type="text"
                                    className="input-field text-center tracking-[0.3em] uppercase text-xl font-display font-bold"
                                    placeholder="ABC123"
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                    maxLength={6}
                                />
                            </div>
                        )}

                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={mode === 'create' ? handleCreate : handleJoin}
                            disabled={loading}
                            className={`w-full text-lg py-4 ${mode === 'create' ? 'btn-accent' : 'btn-primary'}`}
                        >
                            {loading ? '⏳ Connexion...' : mode === 'create' ? 'Créer le salon 🏠' : 'Rejoindre 🔗'}
                        </button>

                        <button
                            onClick={() => { setMode(null); setError(''); }}
                            className="w-full text-sm text-white/40 hover:text-white/60 transition-colors py-2"
                        >
                            ← Changer de mode
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
