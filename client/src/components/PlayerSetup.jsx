import { useState } from 'react';
import { MIN_PLAYERS, MAX_PLAYERS } from '../constants/gameData.js';

export default function PlayerSetup({ onSubmit }) {
    const [names, setNames] = useState(['', '']);

    const addPlayer = () => {
        if (names.length < MAX_PLAYERS) setNames([...names, '']);
    };

    const removePlayer = (index) => {
        if (names.length > MIN_PLAYERS) setNames(names.filter((_, i) => i !== index));
    };

    const updateName = (index, value) => {
        const updated = [...names];
        updated[index] = value;
        setNames(updated);
    };

    const canStart = names.every(n => n.trim().length > 0) && names.length >= MIN_PLAYERS;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="glass-card-strong p-8 sm:p-10 max-w-lg w-full animate-slide-up">
                <div className="text-center mb-8">
                    <h2 className="font-display text-3xl font-bold bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent mb-2">
                        Joueurs
                    </h2>
                    <p className="text-white/50 text-sm">Ajoutez de 2 à 8 joueurs</p>
                </div>

                <div className="space-y-3 mb-8">
                    {names.map((name, i) => (
                        <div key={i} className="flex items-center gap-3 animate-fade-in">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {i + 1}
                            </span>
                            <input
                                type="text"
                                className="input-field flex-1"
                                placeholder={`Joueur ${i + 1}`}
                                value={name}
                                onChange={(e) => updateName(i, e.target.value)}
                                maxLength={20}
                            />
                            {names.length > MIN_PLAYERS && (
                                <button
                                    onClick={() => removePlayer(i)}
                                    className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center justify-center flex-shrink-0"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    {names.length < MAX_PLAYERS && (
                        <button onClick={addPlayer} className="btn-secondary w-full flex items-center justify-center gap-2">
                            <span className="text-lg">+</span> Ajouter un joueur
                        </button>
                    )}
                    <button
                        onClick={() => onSubmit(names.map(n => n.trim()))}
                        disabled={!canStart}
                        className="btn-primary w-full text-lg py-4"
                    >
                        Commencer 🎲
                    </button>
                </div>
            </div>
        </div>
    );
}
