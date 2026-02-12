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
                        style={{ minWidth: '120px' }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            {i === currentPlayerIndex && (
                                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                            )}
                            <span className={`text-xs font-semibold truncate ${i === currentPlayerIndex ? 'text-white' : 'text-white/60'
                                }`}>
                                {player.name}
                            </span>
                        </div>

                        <div className="space-y-1.5">
                            <div>
                                <div className="flex items-center justify-between text-[10px] mb-0.5">
                                    <span className="text-emerald-400/70">Stab.</span>
                                    <span className="text-white/50">{player.stabilityGauge}</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                        style={{ width: `${Math.min(100, player.stabilityGauge * 2)}%` }}
                                    />
                                </div>
                            </div>

                            {player.acceptedObjective && (
                                <div>
                                    <div className="flex items-center justify-between text-[10px] mb-0.5">
                                        <span className="text-accent-400/70">Obj.</span>
                                        <span className="text-white/50">{player.objectiveGauge}/{player.objectiveTarget}</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-accent-500 transition-all duration-500"
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
