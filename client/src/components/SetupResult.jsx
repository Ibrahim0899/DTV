export default function SetupResult({ player, isCorrect, reward, onContinue }) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="glass-card-strong p-8 sm:p-10 max-w-md w-full animate-slide-up text-center">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 ${isCorrect ? 'bg-emerald-500/20 border-2 border-emerald-400/40' : 'bg-red-500/20 border-2 border-red-400/40'
                    }`}>
                    {isCorrect ? '✓' : '✗'}
                </div>

                <h3 className="font-display text-2xl font-bold mb-2">
                    {isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse...'}
                </h3>

                <p className="text-white/60 mb-6">
                    {player.name} {isCorrect ? 'gagne' : 'perd'}{' '}
                    <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                        {reward > 0 ? '+' : ''}{reward} points
                    </span>{' '}
                    de stabilité
                </p>

                <div className="glass-card p-4 mb-6">
                    <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">Stabilité actuelle</div>
                    <div className="text-3xl font-display font-bold text-white">
                        {player.stabilityGauge}
                    </div>
                </div>

                <button onClick={onContinue} className="btn-primary w-full">
                    Continuer →
                </button>
            </div>
        </div>
    );
}
