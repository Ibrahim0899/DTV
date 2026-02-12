import { useState, useEffect } from 'react';
import { playCardReveal, playBonusCard, playMalusCard } from '../hooks/useSound.js';

const cardStyles = {
    bonus: {
        border: 'border-emerald-400/30',
        bg: 'bg-emerald-500/10',
        icon: '⭐',
        label: 'Carte Bonus',
        labelColor: 'text-emerald-300',
        labelBg: 'bg-emerald-500/10 border-emerald-500/20',
        effectColor: 'text-emerald-400',
    },
    malus: {
        border: 'border-red-400/30',
        bg: 'bg-red-500/10',
        icon: '⚡',
        label: 'Carte Malus',
        labelColor: 'text-red-300',
        labelBg: 'bg-red-500/10 border-red-500/20',
        effectColor: 'text-red-400',
    },
    chance: {
        border: 'border-amber-400/30',
        bg: 'bg-amber-500/10',
        icon: '🃏',
        label: 'Carte Chance',
        labelColor: 'text-amber-300',
        labelBg: 'bg-amber-500/10 border-amber-500/20',
        effectColor: 'text-amber-400',
    },
};

export default function CardDisplay({ card, diceResult, player, onContinue }) {
    const [showCard, setShowCard] = useState(false);
    const style = cardStyles[card.type] || cardStyles.chance;

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCard(true);
            playCardReveal();
            setTimeout(() => {
                if (card.effect > 0) playBonusCard();
                else if (card.effect < 0) playMalusCard();
            }, 300);
        }, 400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
            <div className="max-w-md w-full animate-slide-up">
                {/* Dice result */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-white to-gray-100 text-surface-900 font-display font-bold text-3xl sm:text-4xl shadow-2xl ring-4 ring-primary-400/50 mb-3">
                        {diceResult}
                    </div>
                    <p className="text-white/40 text-sm">
                        Résultat du dé: <span className="font-bold text-white">{diceResult}</span>
                    </p>
                </div>

                {/* Card */}
                {showCard && (
                    <div className={`glass-card ${style.border} ${style.bg} p-6 sm:p-8 text-center animate-card-flip mb-6`}>
                        <span className={`inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase ${style.labelColor} ${style.labelBg} border rounded-full mb-4`}>
                            {style.label}
                        </span>

                        <div className="text-4xl mb-4">{style.icon}</div>

                        <p className="text-white/90 text-base sm:text-lg font-medium mb-6 leading-relaxed">
                            {card.text}
                        </p>

                        <div className="glass-card p-4 inline-block">
                            <span className="text-xs text-white/40 uppercase tracking-wider block mb-1">
                                Effet sur la stabilité
                            </span>
                            <span className={`text-2xl sm:text-3xl font-display font-bold ${style.effectColor}`}>
                                {card.effect > 0 ? '+' : ''}{card.effect}
                            </span>
                        </div>
                    </div>
                )}

                {showCard && (
                    <button onClick={onContinue} className="btn-primary w-full animate-fade-in">
                        Appliquer & Continuer →
                    </button>
                )}
            </div>
        </div>
    );
}
