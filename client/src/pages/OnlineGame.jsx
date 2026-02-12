import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
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
import ConnectionStatus from '../components/ConnectionStatus.jsx';

export default function OnlineGame() {
    const location = useLocation();
    const navigate = useNavigate();
    const socketRef = useRef(null);

    const [gameState, setGameState] = useState(null);
    const [lobbyPlayers, setLobbyPlayers] = useState([]);
    const [isHost, setIsHost] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const [playerId, setPlayerId] = useState(0);
    const [playerName, setPlayerName] = useState('');
    const [disconnectedPlayer, setDisconnectedPlayer] = useState(null);
    const [connectionError, setConnectionError] = useState('');
    const [actionPending, setActionPending] = useState(false);
    const actionTimeoutRef = useRef(null);

    useEffect(() => {
        const state = location.state;
        if (!state) {
            navigate('/online');
            return;
        }

        const { roomCode: rc, playerId: pid, playerName: pn, isHost: ih } = state;
        setRoomCode(rc);
        setPlayerId(pid);
        setPlayerName(pn);
        setIsHost(ih);

        // Create a fresh socket connection with auto-reconnection
        const socket = io(import.meta.env.VITE_SERVER_URL, {
            reconnection: true,
            reconnectionAttempts: 15,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000,
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            // Rejoin the room with this new socket
            socket.emit('rejoin-room', { roomCode: rc, playerName: pn, playerId: pid }, (res) => {
                if (!res.success) {
                    setConnectionError(res.error || 'Impossible de rejoindre le salon');
                }
            });
        });

        socket.on('connect_error', () => {
            setConnectionError('Impossible de se connecter au serveur');
        });

        socket.on('room-update', ({ players, phase }) => {
            setLobbyPlayers(players);
            setGameState(prev => prev ? { ...prev, players, phase } : { phase, players });
        });

        socket.on('game-state', (newState) => {
            setGameState(newState);
            // Clear action lock when new state arrives
            setActionPending(false);
            if (actionTimeoutRef.current) {
                clearTimeout(actionTimeoutRef.current);
                actionTimeoutRef.current = null;
            }
        });

        socket.on('player-disconnected', ({ playerName: name }) => {
            setDisconnectedPlayer(name);
            setTimeout(() => setDisconnectedPlayer(null), 5000);
        });

        socket.on('turn-skipped', ({ playerName: name }) => {
            setDisconnectedPlayer(`Tour de ${name} passé (déconnecté)`);
            setTimeout(() => setDisconnectedPlayer(null), 5000);
        });

        return () => {
            socket.disconnect();
            if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
        };
    }, []);

    const socket = socketRef.current;

    const handleStartGame = () => {
        socket?.emit('start-game', { roomCode });
    };

    const isMyTurn = (phase) => {
        if (!gameState) return false;
        if (['PATH_SELECTION', 'SETUP_QUESTION', 'SETUP_RESULT', 'OBJECTIVE_DISPLAY'].includes(phase)) {
            return gameState.currentSetupPlayerIndex === playerId;
        }
        return gameState.currentPlayerIndex === playerId;
    };

    const renderPhase = () => {
        if (connectionError) {
            return (
                <div className="min-h-screen flex items-center justify-center px-4">
                    <div className="glass-card-strong p-8 max-w-sm w-full text-center">
                        <p className="text-red-400 text-lg mb-4">❌ {connectionError}</p>
                        <button onClick={() => navigate('/online')} className="btn-primary">Retour au lobby</button>
                    </div>
                </div>
            );
        }
        if (!gameState) return <div className="text-white/50 text-center py-20">Chargement...</div>;

        const phase = gameState.phase;

        // ── Lobby ──
        if (phase === 'LOBBY') {
            const players = gameState.players || lobbyPlayers;
            return (
                <div className="min-h-screen flex items-center justify-center px-4 py-8">
                    <div className="glass-card-strong p-8 sm:p-10 max-w-md w-full animate-slide-up">
                        <div className="text-center mb-6">
                            <h2 className="font-display text-2xl font-bold text-white mb-2">Salon En Ligne</h2>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                                <span className="text-xs text-white/40">Code:</span>
                                <span className="font-display font-bold text-xl tracking-[0.2em] text-primary-300">{roomCode}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">Joueurs ({players.length}/8)</h3>
                            <div className="space-y-2">
                                {players.map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold">
                                            {i + 1}
                                        </span>
                                        <span className="text-white font-medium">{p.name}</span>
                                        {i === 0 && <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full ml-auto">Hôte</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isHost && players.length >= 2 && (
                            <button onClick={handleStartGame} className="btn-accent w-full text-lg py-4">
                                Lancer la partie 🚀
                            </button>
                        )}
                        {isHost && players.length < 2 && (
                            <p className="text-white/40 text-sm text-center">En attente d'au moins 2 joueurs...</p>
                        )}
                        {!isHost && (
                            <p className="text-white/40 text-sm text-center">En attente du lancement par l'hôte...</p>
                        )}
                    </div>
                </div>
            );
        }

        // ── Path Selection ──
        if (phase === 'PATH_SELECTION') {
            const setupPlayer = gameState.players[gameState.currentSetupPlayerIndex];
            if (!isMyTurn(phase)) {
                return (
                    <WaitingScreen message={`${setupPlayer.name} choisit sa voie...`} gameState={gameState} />
                );
            }
            return (
                <PathSelection
                    player={setupPlayer}
                    playerIndex={gameState.currentSetupPlayerIndex}
                    onSelect={(diplomaId, diplomaLabel) => {
                        emitAction('choose-path', { roomCode, diplomaId, diplomaLabel });
                    }}
                />
            );
        }

        // ── Setup Question ──
        if (phase === 'SETUP_QUESTION') {
            const setupPlayer = gameState.players[gameState.currentSetupPlayerIndex];
            if (!isMyTurn(phase)) {
                return <WaitingScreen message={`${setupPlayer.name} répond à une question...`} gameState={gameState} />;
            }
            return (
                <SetupQuestion
                    player={setupPlayer}
                    question={gameState.currentSetupQuestion}
                    onAnswer={(answer) => emitAction('answer-setup-question', { roomCode, answer })}
                />
            );
        }

        // ── Setup Result ──
        if (phase === 'SETUP_RESULT') {
            const setupPlayer = gameState.players[gameState.currentSetupPlayerIndex];
            return (
                <SetupResult
                    player={setupPlayer}
                    isCorrect={gameState.setupAnswerCorrect}
                    reward={gameState.setupReward}
                    onContinue={() => {
                        if (isMyTurn(phase)) emitAction('proceed-to-objective', { roomCode });
                    }}
                />
            );
        }

        // ── Objective Display ──
        if (phase === 'OBJECTIVE_DISPLAY') {
            const setupPlayer = gameState.players[gameState.currentSetupPlayerIndex];
            if (!isMyTurn(phase)) {
                return <WaitingScreen message={`${setupPlayer.name} consulte son objectif...`} gameState={gameState} />;
            }
            return (
                <ObjectiveCard
                    player={setupPlayer}
                    onRespond={(accepted) => emitAction('respond-objective', { roomCode, accepted })}
                />
            );
        }

        // ── Main Dice ──
        if (phase === 'MAIN_DICE') {
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            if (!isMyTurn(phase)) {
                return <WaitingScreen message={`C'est au tour de ${currentPlayer.name}...`} gameState={gameState} showBoard />;
            }
            return (
                <GameBoard
                    state={gameState}
                    onRollDice={() => emitAction('roll-dice', { roomCode })}
                />
            );
        }

        // ── Card Display ──
        if (phase === 'CARD_DISPLAY') {
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            return (
                <CardDisplay
                    card={gameState.currentCard}
                    diceResult={gameState.currentDiceResult}
                    player={currentPlayer}
                    onContinue={() => {
                        if (isMyTurn(phase)) emitAction('apply-card', { roomCode });
                    }}
                />
            );
        }

        // ── End Turn Question ──
        if (phase === 'END_TURN_QUESTION') {
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            if (!isMyTurn(phase)) {
                return <WaitingScreen message={`${currentPlayer.name} répond à une question...`} gameState={gameState} />;
            }
            return (
                <QuestionModal
                    question={gameState.currentQuestion}
                    player={currentPlayer}
                    onAnswer={(answer) => emitAction('answer-question', { roomCode, answer })}
                />
            );
        }

        // ── Objective Dice ──
        if (phase === 'OBJECTIVE_DICE') {
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            if (!isMyTurn(phase)) {
                return <WaitingScreen message={`${currentPlayer.name} lance le dé d'objectif...`} gameState={gameState} />;
            }
            return (
                <ObjectiveDice
                    player={currentPlayer}
                    onRoll={() => emitAction('roll-objective-dice', { roomCode })}
                />
            );
        }

        // ── Turn Summary ──
        if (phase === 'TURN_SUMMARY') {
            return (
                <TurnSummary
                    state={gameState}
                    onNext={() => emitAction('next-turn', { roomCode })}
                />
            );
        }

        // ── Game Over ──
        if (phase === 'GAME_OVER') {
            return (
                <VictoryScreen
                    winner={gameState.winner}
                    reason={gameState.victoryReason}
                    players={gameState.players}
                    onPlayAgain={() => navigate('/')}
                />
            );
        }

        return null;
    };

    /**
     * Emit a socket action with double-click protection and timeout.
     * Locks the UI until a new game-state is received or 8s passes.
     */
    const emitAction = useCallback((event, data = {}) => {
        if (actionPending || !socket) return;
        setActionPending(true);
        socket.emit(event, data);
        // Safety timeout — unlock after 8s if server doesn't respond
        actionTimeoutRef.current = setTimeout(() => {
            setActionPending(false);
            actionTimeoutRef.current = null;
        }, 8000);
    }, [actionPending, socket]);

    return (
        <div className="min-h-screen bg-game">
            {/* Connection indicator */}
            <ConnectionStatus socket={socket} />

            {/* Top bar */}
            {gameState && gameState.phase !== 'LOBBY' && gameState.phase !== 'GAME_OVER' && (
                <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-surface-950/80 backdrop-blur-lg border-b border-white/5">
                    <h2 className="font-display font-bold text-sm bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                        Découvre ta Voie
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] text-white/30 bg-white/5 px-2 py-1 rounded font-mono">{roomCode}</span>
                        {gameState.phase !== 'PATH_SELECTION' && gameState.phase !== 'SETUP_QUESTION' && gameState.phase !== 'SETUP_RESULT' && gameState.phase !== 'OBJECTIVE_DISPLAY' && (
                            <span className="text-xs text-white/40">Tour {gameState.currentTurn}/40</span>
                        )}
                    </div>
                </div>
            )}

            {/* Disconnection warning */}
            {disconnectedPlayer && (
                <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm animate-fade-in">
                    ⚠️ {disconnectedPlayer}
                </div>
            )}

            {/* Action pending overlay */}
            {actionPending && (
                <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white/60 text-xs flex items-center gap-2 animate-fade-in">
                    <span className="inline-block w-3 h-3 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                </div>
            )}

            <div className={gameState && gameState.phase !== 'LOBBY' && gameState.phase !== 'GAME_OVER' ? 'pt-14' : ''}>
                {renderPhase()}
            </div>
        </div>
    );
}

// ── Waiting Screen (for non-active players) ───────────────
function WaitingScreen({ message, gameState, showBoard }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
            {showBoard && gameState && (
                <div className="w-full max-w-3xl mb-6">
                    <div className="w-full overflow-x-auto pb-2">
                        <div className="flex gap-2 min-w-max px-1">
                            {gameState.players.map((player, i) => (
                                <div
                                    key={i}
                                    className={`flex-shrink-0 rounded-xl p-3 transition-all ${i === gameState.currentPlayerIndex
                                        ? 'bg-primary-500/20 border border-primary-400/30'
                                        : 'bg-white/5 border border-white/5'
                                        }`}
                                    style={{ minWidth: '120px' }}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        {i === gameState.currentPlayerIndex && <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />}
                                        <span className="text-xs font-semibold truncate text-white/60">{player.name}</span>
                                    </div>
                                    <div className="flex gap-3 text-[10px]">
                                        <span className="text-emerald-400">S: {player.stabilityGauge}</span>
                                        {player.acceptedObjective && <span className="text-accent-400">O: {player.objectiveGauge}/{player.objectiveTarget}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="glass-card-strong p-10 max-w-sm w-full text-center animate-slide-up">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-500/20 border border-primary-400/30 flex items-center justify-center">
                    <span className="animate-spin text-xl">⏳</span>
                </div>
                <p className="text-white/60 text-lg">{message}</p>
            </div>
        </div>
    );
}
