import { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameReducer, initialState, PHASES } from '../game/gameReducer.js';
import PlayerSetup from '../components/PlayerSetup.jsx';
import PathSelection from '../components/PathSelection.jsx';
import SetupQuestion from '../components/SetupQuestion.jsx';
import SetupResult from '../components/SetupResult.jsx';
import ObjectiveCard from '../components/ObjectiveCard.jsx';
import GameBoard from '../components/GameBoard.jsx';
import CardDisplay from '../components/CardDisplay.jsx';
import QuestionModal from '../components/QuestionModal.jsx';
import ObjectiveDice from '../components/ObjectiveDice.jsx';
import TurnSummary from '../components/TurnSummary.jsx';
import VictoryScreen from '../components/VictoryScreen.jsx';

export default function LocalGame() {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const navigate = useNavigate();

    const handleReset = () => {
        dispatch({ type: 'RESET_GAME' });
        navigate('/');
    };

    const renderPhase = () => {
        switch (state.phase) {
            case PHASES.LOBBY:
                return <PlayerSetup onSubmit={(names) => dispatch({ type: 'ADD_PLAYERS', names })} />;

            case PHASES.PATH_SELECTION:
                return (
                    <PathSelection
                        player={state.players[state.currentSetupPlayerIndex]}
                        playerIndex={state.currentSetupPlayerIndex}
                        onSelect={(diplomaId, diplomaLabel) =>
                            dispatch({ type: 'CHOOSE_PATH', playerIndex: state.currentSetupPlayerIndex, diplomaId, diplomaLabel })
                        }
                    />
                );

            case PHASES.SETUP_QUESTION:
                return (
                    <SetupQuestion
                        player={state.players[state.currentSetupPlayerIndex]}
                        question={state.currentSetupQuestion}
                        onAnswer={(answer) => dispatch({ type: 'ANSWER_SETUP_QUESTION', answer })}
                    />
                );

            case PHASES.SETUP_RESULT:
                return (
                    <SetupResult
                        player={state.players[state.currentSetupPlayerIndex]}
                        isCorrect={state.setupAnswerCorrect}
                        reward={state.setupReward}
                        onContinue={() => dispatch({ type: 'PROCEED_TO_OBJECTIVE' })}
                    />
                );

            case PHASES.OBJECTIVE_DISPLAY:
                return (
                    <ObjectiveCard
                        player={state.players[state.currentSetupPlayerIndex]}
                        onRespond={(accepted) => dispatch({ type: 'RESPOND_OBJECTIVE', accepted })}
                    />
                );

            case PHASES.MAIN_DICE:
                return (
                    <GameBoard
                        state={state}
                        onRollDice={() => dispatch({ type: 'ROLL_MAIN_DICE' })}
                    />
                );

            case PHASES.CARD_DISPLAY:
                return (
                    <CardDisplay
                        card={state.currentCard}
                        diceResult={state.currentDiceResult}
                        player={state.players[state.currentPlayerIndex]}
                        onContinue={() => dispatch({ type: 'APPLY_CARD' })}
                    />
                );

            case PHASES.END_TURN_QUESTION:
                return (
                    <QuestionModal
                        question={state.currentQuestion}
                        player={state.players[state.currentPlayerIndex]}
                        onAnswer={(answer) => dispatch({ type: 'ANSWER_QUESTION', answer })}
                    />
                );

            case PHASES.OBJECTIVE_DICE:
                return (
                    <ObjectiveDice
                        player={state.players[state.currentPlayerIndex]}
                        onRoll={() => dispatch({ type: 'ROLL_OBJECTIVE_DICE' })}
                    />
                );

            case PHASES.TURN_SUMMARY:
                return (
                    <TurnSummary
                        state={state}
                        onNext={() => dispatch({ type: 'NEXT_TURN' })}
                    />
                );

            case PHASES.GAME_OVER:
                return (
                    <VictoryScreen
                        winner={state.winner}
                        reason={state.victoryReason}
                        players={state.players}
                        onPlayAgain={handleReset}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-game">
            {/* Top bar */}
            {state.phase !== PHASES.LOBBY && state.phase !== PHASES.GAME_OVER && (
                <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-surface-950/80 backdrop-blur-lg border-b border-white/5">
                    <h2 className="font-display font-bold text-sm sm:text-base bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                        Découvre ta Voie
                    </h2>
                    <div className="flex items-center gap-4">
                        {state.phase !== PHASES.PATH_SELECTION && state.phase !== PHASES.SETUP_QUESTION && state.phase !== PHASES.SETUP_RESULT && state.phase !== PHASES.OBJECTIVE_DISPLAY && (
                            <span className="text-xs text-white/40">
                                Tour {state.currentTurn}/{40}
                            </span>
                        )}
                        <button onClick={handleReset} className="text-xs text-white/40 hover:text-white/70 transition-colors">
                            ✕ Quitter
                        </button>
                    </div>
                </div>
            )}

            <div className={state.phase !== PHASES.LOBBY && state.phase !== PHASES.GAME_OVER ? 'pt-14' : ''}>
                {renderPhase()}
            </div>
        </div>
    );
}
