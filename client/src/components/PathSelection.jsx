import { DIPLOMA_PATHS } from '../constants/gameData.js';

const pathEmojis = {
    noDiploma: '🔥',
    bac: '📚',
    bacPro: '🔧',
    bac2: '🎓',
    bac3: '💼',
    bac5: '🏆',
    bac8: '🧬',
    entrepreneur: '🚀',
};

export default function PathSelection({ player, playerIndex, onSelect }) {
    return (
        <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
            <div className="max-w-3xl w-full animate-slide-up">
                <div className="text-center mb-8">
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary-300 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4">
                        Joueur {playerIndex + 1}
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
                        <span className="text-white">{player.name}</span>
                        <span className="text-white/40">, choisis ta voie</span>
                    </h2>
                    <p className="text-white/50 text-sm">Chaque chemin offre des bonus et défis différents</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {DIPLOMA_PATHS.map((path) => (
                        <button
                            key={path.id}
                            onClick={() => onSelect(path.id, path.label)}
                            className="glass-card p-4 text-center hover:bg-white/10 hover:border-primary-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
                        >
                            <span className="text-3xl mb-2 block group-hover:animate-float">
                                {pathEmojis[path.id]}
                            </span>
                            <span className="font-semibold text-sm text-white block mb-2">
                                {path.label}
                            </span>
                            <div className="flex items-center justify-center gap-2 text-[10px]">
                                <span className="text-emerald-400">+{path.stabilityBonus}</span>
                                <span className="text-white/20">|</span>
                                <span className="text-red-400">{path.stabilityMalus}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
