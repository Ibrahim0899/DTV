import { useState } from 'react';
import { playCorrect, playWrong, playClick } from '../hooks/useSound.js';

export default function QuestionModal({ question, player, onAnswer }) {
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);

    const handleSelect = (choice) => {
        if (answered) return;
        playClick();
        setSelected(choice);
    };

    const handleConfirm = () => {
        if (!selected || answered) return;
        setAnswered(true);
        const isCorrect = selected === question.a;
        setTimeout(() => {
            if (isCorrect) playCorrect();
            else playWrong();
        }, 100);
        setTimeout(() => onAnswer(selected), 600);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
            <div className="glass-card-strong p-6 sm:p-10 max-w-lg w-full animate-slide-up">
                <div className="text-center mb-6">
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
                        Question Culture Générale
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                        {player.name}, c'est à toi !
                    </h3>
                </div>

                <p className="text-white/90 text-center text-base sm:text-lg mb-8 leading-relaxed">
                    {question.q}
                </p>

                <div className="space-y-3 mb-6">
                    {question.choices.map((choice, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(choice)}
                            disabled={answered}
                            className={`w-full p-3 sm:p-4 rounded-xl text-left font-medium transition-all duration-200
                ${selected === choice
                                    ? 'bg-cyan-500/20 border-2 border-cyan-400 text-white scale-[1.02]'
                                    : 'bg-white/5 border-2 border-transparent hover:bg-white/10 text-white/80'
                                }
                ${answered ? 'cursor-default' : 'cursor-pointer'}
              `}
                        >
                            <span className="inline-block w-6 h-6 rounded-full bg-white/10 text-center text-sm leading-6 mr-3">
                                {String.fromCharCode(65 + i)}
                            </span>
                            {choice}
                        </button>
                    ))}
                </div>

                {!answered && (
                    <button
                        onClick={handleConfirm}
                        disabled={!selected}
                        className="btn-primary w-full"
                    >
                        Valider ma réponse
                    </button>
                )}

                {player.acceptedObjective && (
                    <p className="text-xs text-white/30 text-center mt-4">
                        Bonne réponse = Lancer le dé d'objectif (1d3)
                    </p>
                )}
            </div>
        </div>
    );
}
