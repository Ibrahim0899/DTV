import PlayerDashboard from './PlayerDashboard.jsx';
import DiceRoller from './DiceRoller.jsx';
import { playDiceResult } from '../hooks/useSound.js';

export default function GameBoard({ state, onRollDice }) {
    const currentPlayer = state.players[state.currentPlayerIndex];

    const handleDiceResult = () => {
        playDiceResult();
        onRollDice();
    };

    return (
        <div className="min-h-screen flex flex-col px-3 sm:px-4 py-4 sm:py-6">
            {/* Player Dashboard */}
            <PlayerDashboard
                players={state.players}
                currentPlayerIndex={state.currentPlayerIndex}
                currentTurn={state.currentTurn}
            />

            {/* Center — Current Player Action */}
            <div className="flex-1 flex items-center justify-center">
                <div className="glass-card-strong p-6 sm:p-10 max-w-md w-full text-center animate-slide-up">
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary-300 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4">
                            Tour {state.currentTurn}
                        </span>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">
                            {currentPlayer.name}
                        </h2>
                        <p className="text-white/50 text-sm">{currentPlayer.diploma}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="glass-card p-3">
                            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Stabilité</div>
                            <div className="text-xl sm:text-2xl font-display font-bold text-emerald-400">
                                {currentPlayer.stabilityGauge}
                            </div>
                            <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="gauge-bar bg-gradient-to-r from-emerald-500 to-emerald-400"
                                    style={{ width: `${Math.min(100, currentPlayer.stabilityGauge * 2)}%` }}
                                />
                            </div>
                        </div>
                        <div className="glass-card p-3">
                            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Objectif</div>
                            <div className="text-xl sm:text-2xl font-display font-bold text-accent-400">
                                {currentPlayer.objectiveGauge}
                                <span className="text-sm text-white/30">/{currentPlayer.objectiveTarget || 30}</span>
                            </div>
                            <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="gauge-bar bg-gradient-to-r from-accent-500 to-accent-400"
                                    style={{ width: `${(currentPlayer.objectiveGauge / (currentPlayer.objectiveTarget || 30)) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <DiceRoller sides={6} onResult={handleDiceResult} label="Lancer le dé" />
                </div>
            </div>
        </div>
    );
}
