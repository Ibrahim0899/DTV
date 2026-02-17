export default function PlayerDashboard({ players, currentPlayerIndex, currentTurn }) {
    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="flex gap-2 sm:gap-3 min-w-max px-1">
                {players.map((player, i) => (
                    <div
                        key={i}
                        className={`flex-shrink-0 rounded-xl p-3 transition-all duration-300 ${i === currentPlayerIndex
                            ? 'bg-primary-500/20 border border-primary-400/30 shadow-lg shadow-primary-500/10 scale-105'
                            : 'bg-white/5 border border-white/5'
                            }`}
                        style={{ minWidth: '140px' }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            {i === currentPlayerIndex && (
                                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                            )}
                            <span className={`text-sm font-bold truncate ${i === currentPlayerIndex ? 'text-white' : 'text-white/60'
                                }`}>
                                {player.name}
                            </span>
                        </div>

                        <div className="space-y-2.5">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                                        🛡️ Stabilité
                                    </span>
                                    <span className="text-sm font-display font-bold text-emerald-300">
                                        {player.stabilityGauge}
                                    </span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                                        style={{ width: `${Math.min(100, player.stabilityGauge * 2)}%` }}
                                    />
                                </div>
                            </div>

                            {player.acceptedObjective && (
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="flex items-center gap-1 text-xs text-accent-400 font-medium">
                                            🎯 Objectif
                                        </span>
                                        <span className="text-sm font-display font-bold text-accent-300">
                                            {player.objectiveGauge}/{player.objectiveTarget}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-400 transition-all duration-500"
                                            style={{ width: `${(player.objectiveGauge / player.objectiveTarget) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
