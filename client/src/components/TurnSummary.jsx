export default function TurnSummary({ state, onNext }) {
    const player = state.players[state.currentPlayerIndex];

    return (
        <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
            <div className="glass-card-strong p-6 sm:p-10 max-w-md w-full animate-slide-up">
                <div className="text-center mb-6">
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-white/50 bg-white/5 border border-white/10 rounded-full mb-4">
                        Résumé du tour
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                        {player.name}
                    </h3>
                </div>

                <div className="space-y-3 mb-8">
                    {/* Dice & Card */}
                    <div className="glass-card p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🎲</span>
                            <div>
                                <div className="text-sm font-medium text-white">Dé: {state.currentDiceResult}</div>
                                <div className="text-xs text-white/40">{state.currentCard?.text}</div>
                            </div>
                        </div>
                        <span className={`font-display font-bold ${state.currentCard?.effect >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {state.currentCard?.effect > 0 ? '+' : ''}{state.currentCard?.effect}
                        </span>
                    </div>

                    {/* Question Result */}
                    <div className="glass-card p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{state.questionAnswerCorrect ? '✅' : '❌'}</span>
                            <div>
                                <div className="text-sm font-medium text-white">
                                    Question {state.questionAnswerCorrect ? 'réussie' : 'ratée'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Objective Die (if applicable) */}
                    {state.questionAnswerCorrect && state.objectiveDiceResult !== null && (
                        <div className="glass-card p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">🎯</span>
                                <div>
                                    <div className="text-sm font-medium text-white">
                                        {player.acceptedObjective
                                            ? `Dé d'objectif: +${state.objectiveDiceResult}`
                                            : 'Objectif refusé'}
                                    </div>
                                </div>
                            </div>
                            {player.acceptedObjective && (
                                <span className="font-display font-bold text-accent-400">
                                    +{state.objectiveDiceResult}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Final Gauges */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="glass-card p-3 text-center">
                            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Stabilité</div>
                            <div className="text-xl sm:text-2xl font-display font-bold text-emerald-400">
                                {player.stabilityGauge}
                            </div>
                        </div>
                        <div className="glass-card p-3 text-center">
                            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Objectif</div>
                            <div className="text-xl sm:text-2xl font-display font-bold text-accent-400">
                                {player.objectiveGauge}
                                <span className="text-sm text-white/30">/{player.objectiveTarget || 30}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={onNext} className="btn-primary w-full text-lg py-4">
                    Joueur suivant →
                </button>
            </div>
        </div>
    );
}
