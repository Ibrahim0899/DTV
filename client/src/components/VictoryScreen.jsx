import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { playVictory } from '../hooks/useSound.js';

// Confetti particle component
function Confetti() {
    const colors = ['#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#3b82f6', '#f43f5e'];
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute confetti-particle"
                    style={{
                        left: `${p.left}%`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        width: `${p.size}px`,
                        height: `${p.size * 1.5}px`,
                        backgroundColor: p.color,
                        transform: `rotate(${p.rotation}deg)`,
                        borderRadius: p.id % 3 === 0 ? '50%' : '2px',
                    }}
                />
            ))}
        </div>
    );
}

export default function VictoryScreen({ winner, reason, players, onPlayAgain }) {
    const sortedByStability = [...players].sort((a, b) => b.stabilityGauge - a.stabilityGauge);
    const soundPlayed = useRef(false);

    useEffect(() => {
        if (!soundPlayed.current) {
            soundPlayed.current = true;
            setTimeout(() => playVictory(), 500);
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8 relative overflow-hidden">
            <Confetti />

            {/* Celebration background */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-1/4 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-accent-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/3 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-lg w-full">
                <div className="glass-card-strong p-6 sm:p-10 text-center animate-slide-up">
                    {/* Trophy */}
                    <div className="text-5xl sm:text-6xl mb-4 animate-float victory-trophy">🏆</div>

                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent mb-2">
                        Victoire !
                    </h2>

                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                        {winner.name}
                    </h3>

                    <p className="text-white/60 text-sm sm:text-base mb-8">
                        {reason === 'objective'
                            ? `A rempli sa jauge d'objectif (${winner.objectiveGauge}/${winner.objectiveTarget}) !`
                            : reason === 'last_standing'
                                ? `Dernier joueur en lice — victoire par défaut !`
                                : `Meilleure stabilité (${winner.stabilityGauge} pts) après 40 tours !`}
                    </p>

                    {/* Leaderboard */}
                    <div className="mb-8">
                        <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3">Classement</h4>
                        <div className="space-y-2">
                            {sortedByStability.map((player, i) => (
                                <div
                                    key={player.id}
                                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${player.id === winner.id
                                        ? 'bg-amber-500/10 border border-amber-400/20'
                                        : 'bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-500/30 text-amber-300' :
                                            i === 1 ? 'bg-gray-400/20 text-gray-300' :
                                                i === 2 ? 'bg-orange-600/20 text-orange-400' :
                                                    'bg-white/5 text-white/40'
                                            }`}>
                                            {i + 1}
                                        </span>
                                        <div className="text-left">
                                            <span className="text-xs sm:text-sm font-medium text-white">{player.name}</span>
                                            <span className="text-[10px] sm:text-xs text-white/30 ml-2">{player.diploma}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-emerald-400">{player.stabilityGauge}</div>
                                        {player.acceptedObjective && (
                                            <div className="text-[10px] text-accent-400">Obj: {player.objectiveGauge}/{player.objectiveTarget}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link to="/" className="btn-secondary flex-1 text-center">
                            Accueil
                        </Link>
                        <button onClick={onPlayAgain} className="btn-primary flex-1">
                            Rejouer 🎲
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
