import { useState, useEffect, useRef } from 'react';

export default function DiceRoller({ sides = 6, onResult, label, disabled = false, serverResult }) {
    const [rolling, setRolling] = useState(false);
    const [displayValue, setDisplayValue] = useState(null);
    const [finalValue, setFinalValue] = useState(null);
    const intervalRef = useRef(null);

    const handleRoll = () => {
        if (rolling || disabled) return;
        setRolling(true);
        setFinalValue(null);

        // Rapid cycling of numbers for visual effect
        let count = 0;
        const maxCycles = 15;
        intervalRef.current = setInterval(() => {
            setDisplayValue(Math.floor(Math.random() * sides) + 1);
            count++;
            if (count >= maxCycles) {
                clearInterval(intervalRef.current);
                // Use server result if provided, otherwise fallback to random (local mode)
                const result = serverResult != null ? serverResult : (Math.floor(Math.random() * sides) + 1);
                setDisplayValue(result);
                setFinalValue(result);
                setRolling(false);
                // Fire callback after a short delay for the landing animation
                setTimeout(() => onResult(), 500);
            }
        }, 80);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const sideLabel = sides === 3 ? '1d3' : '1d6';

    return (
        <div className="flex flex-col items-center gap-4">
            {displayValue !== null ? (
                <div className={`dice-container ${rolling ? 'dice-spinning' : finalValue ? 'dice-landed' : ''}`}>
                    <div className={`
                        w-24 h-24 sm:w-28 sm:h-28 rounded-2xl font-display font-bold text-4xl sm:text-5xl
                        flex items-center justify-center shadow-2xl select-none
                        ${finalValue
                            ? 'bg-gradient-to-br from-white to-gray-100 text-surface-900 ring-4 ring-primary-400/50'
                            : 'bg-white/90 text-surface-900'
                        }
                    `}>
                        {displayValue}
                    </div>
                    {finalValue && (
                        <div className="absolute -inset-4 rounded-3xl bg-primary-500/20 animate-ping-once pointer-events-none" />
                    )}
                </div>
            ) : (
                <button
                    onClick={handleRoll}
                    disabled={disabled}
                    className="btn-primary w-full text-lg py-5 dice-button-glow"
                >
                    <span className="flex items-center justify-center gap-2">
                        <span className="text-2xl dice-icon-float">🎲</span>
                        {label || `Lancer le dé (${sideLabel})`}
                    </span>
                </button>
            )}
        </div>
    );
}
