import { useState } from 'react';
import DiceRoller from './DiceRoller.jsx';
import { playDiceResult } from '../hooks/useSound.js';

export default function ObjectiveDice({ player, onRoll }) {
    const [rolled, setRolled] = useState(false);

    const handleResult = () => {
        playDiceResult();
        setRolled(true);
        setTimeout(() => onRoll(), 600);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="glass-card-strong p-6 sm:p-10 max-w-md w-full text-center animate-slide-up">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-2xl mb-6">
                    ✓
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                    Bonne réponse !
                </h3>
                <p className="text-white/50 mb-8">
                    {player.name}, lance le dé d'objectif
                </p>

                {!rolled ? (
                    <DiceRoller sides={3} onResult={handleResult} label="Lancer le dé d'objectif" />
                ) : (
                    <div className="text-accent-300 font-medium animate-fade-in">
                        Résultat en cours...
                    </div>
                )}

                {player.acceptedObjective && (
                    <div className="mt-6 glass-card p-3">
                        <div className="text-xs text-white/40 mb-1">Jauge d'objectif</div>
                        <div className="text-xl font-display font-bold text-accent-400">
                            {player.objectiveGauge} / {player.objectiveTarget}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
