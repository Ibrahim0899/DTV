export default function ObjectiveCard({ player, onRespond }) {
    const isMandatory = player.diplomaId === 'noDiploma';

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="glass-card-strong p-8 sm:p-10 max-w-lg w-full animate-slide-up">
                <div className="text-center mb-6">
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-accent-300 bg-accent-500/10 border border-accent-500/20 rounded-full mb-4">
                        {isMandatory ? 'Objectif Obligatoire' : 'Objectif Proposé'}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white mb-1">{player.name}</h3>
                    <p className="text-white/40 text-sm">{player.diploma}</p>
                </div>

                <div className="glass-card p-6 mb-8 border-accent-500/20">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl mt-1">🎯</span>
                        <p className="text-white/80 leading-relaxed">
                            {player.objectiveText}
                        </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-white/40 uppercase tracking-wider">Jauge cible</span>
                        <span className="font-display font-bold text-accent-300">{player.objectiveTarget} pts</span>
                    </div>
                </div>

                {isMandatory ? (
                    <button
                        onClick={() => onRespond(true)}
                        className="btn-accent w-full text-lg py-4"
                    >
                        Accepter (obligatoire) ✓
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={() => onRespond(false)}
                            className="btn-secondary flex-1"
                        >
                            Refuser
                        </button>
                        <button
                            onClick={() => onRespond(true)}
                            className="btn-accent flex-1"
                        >
                            Accepter ✓
                        </button>
                    </div>
                )}

                {!isMandatory && (
                    <p className="text-xs text-white/30 text-center mt-4">
                        Si tu refuses, tu ne pourras gagner que par la jauge de stabilité
                    </p>
                )}
            </div>
        </div>
    );
}
