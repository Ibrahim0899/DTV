export default function TurnSummary({ state, onNext, isActivePlayer }) {
    const player = state.players[state.currentPlayerIndex];
    const question = state.currentQuestion;
    const playerAnswer = state.playerAnswer;

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

                    {/* Question + Answer Details */}
                    <div className="glass-card p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-xl">{state.questionAnswerCorrect ? '✅' : '❌'}</span>
                            <div className="text-sm font-medium text-white">
                                Question {state.questionAnswerCorrect ? 'réussie' : 'ratée'}
                            </div>
                        </div>
                        {question && (
                            <div className="mt-2 space-y-2">
                                <p className="text-xs text-white/60 leading-relaxed">{question.q}</p>
                                <div className="space-y-1">
                                    {question.choices.map((choice, i) => {
                                        const isCorrect = choice === question.a;
                                        const isPlayerChoice = choice === playerAnswer;
                                        let bg = 'bg-white/5 text-white/40';
                                        if (isCorrect) bg = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
                                        else if (isPlayerChoice && !state.questionAnswerCorrect) bg = 'bg-red-500/15 text-red-300 border-red-500/30';

                                        return (
                                            <div
                                                key={i}
                                                className={`p-2 rounded-lg text-xs border border-transparent ${bg} flex items-center gap-2`}
                                            >
                                                <span className="inline-block w-5 h-5 rounded-full bg-white/10 text-center text-[10px] leading-5 flex-shrink-0">
                                                    {String.fromCharCode(65 + i)}
                                                </span>
                                                <span className="flex-1">{choice}</span>
                                                {isCorrect && <span className="text-[10px]">✓</span>}
                                                {isPlayerChoice && <span className="text-[10px]">← {player.name}</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
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
                            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">🛡️ Stabilité</div>
                            <div className="text-xl sm:text-2xl font-display font-bold text-emerald-400">
                                {player.stabilityGauge}
                            </div>
                        </div>
                        <div className="glass-card p-3 text-center">
                            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">🎯 Objectif</div>
                            <div className="text-xl sm:text-2xl font-display font-bold text-accent-400">
                                {player.objectiveGauge}
                                <span className="text-sm text-white/30">/{player.objectiveTarget || 30}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {isActivePlayer ? (
                    <button onClick={onNext} className="btn-primary w-full text-lg py-4">
                        Joueur suivant →
                    </button>
                ) : (
                    <p className="text-white/30 text-sm text-center">
                        En attente de {player.name}...
                    </p>
                )}
            </div>
        </div>
    );
}
