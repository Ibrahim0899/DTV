// ═══════════════════════════════════════════════════════════
// DÉCOUVRE TA VOIE — Game Reducer (Local mode state machine)
// ═══════════════════════════════════════════════════════════

import {
    createPlayer, rollDice, drawCard, applyCardEffect,
    getSetupQuestion, getRandomQuestion, getObjective,
    getSetupReward, applyObjectivePoints, checkVictory,
    getNextPlayerIndex,
} from './gameEngine.js';
import { MAX_TURNS } from '../constants/gameData.js';

// ── Game Phases ────────────────────────────────────────────
export const PHASES = {
    LOBBY: 'LOBBY',
    PATH_SELECTION: 'PATH_SELECTION',
    SETUP_QUESTION: 'SETUP_QUESTION',
    SETUP_RESULT: 'SETUP_RESULT',
    OBJECTIVE_DISPLAY: 'OBJECTIVE_DISPLAY',
    MAIN_DICE: 'MAIN_DICE',
    CARD_DISPLAY: 'CARD_DISPLAY',
    END_TURN_QUESTION: 'END_TURN_QUESTION',
    OBJECTIVE_DICE: 'OBJECTIVE_DICE',
    TURN_SUMMARY: 'TURN_SUMMARY',
    GAME_OVER: 'GAME_OVER',
};

// ── Initial State ──────────────────────────────────────────
export const initialState = {
    phase: PHASES.LOBBY,
    players: [],
    currentPlayerIndex: 0,
    currentSetupPlayerIndex: 0,
    currentTurn: 1,
    usedQuestionIndices: [],
    // Transient state for current action
    currentDiceResult: null,
    currentCard: null,
    currentQuestion: null,
    currentSetupQuestion: null,
    setupAnswerCorrect: null,
    setupReward: 0,
    questionAnswerCorrect: null,
    objectiveDiceResult: null,
    // Victory
    winner: null,
    victoryReason: null,
};

// ── Reducer ────────────────────────────────────────────────
export function gameReducer(state, action) {
    switch (action.type) {
        // ── Lobby ──
        case 'ADD_PLAYERS': {
            const players = action.names.map((name, i) => createPlayer(name, i));
            return { ...state, players, phase: PHASES.PATH_SELECTION, currentSetupPlayerIndex: 0 };
        }

        // ── Path Selection ──
        case 'CHOOSE_PATH': {
            const { playerIndex, diplomaId, diplomaLabel } = action;
            const players = state.players.map((p, i) =>
                i === playerIndex ? { ...p, diplomaId, diploma: diplomaLabel } : p
            );
            // Get setup question for this player
            const question = getSetupQuestion(diplomaId);
            return {
                ...state,
                players,
                currentSetupPlayerIndex: playerIndex,
                currentSetupQuestion: question,
                phase: PHASES.SETUP_QUESTION,
            };
        }

        // ── Setup Question Answer ──
        case 'ANSWER_SETUP_QUESTION': {
            const { answer } = action;
            const idx = state.currentSetupPlayerIndex;
            const player = state.players[idx];
            const isCorrect = answer === state.currentSetupQuestion.a;
            const reward = getSetupReward(player.diplomaId, isCorrect);
            const newStability = Math.max(0, player.stabilityGauge + reward);
            const players = state.players.map((p, i) =>
                i === idx ? { ...p, stabilityGauge: newStability } : p
            );
            return {
                ...state,
                players,
                setupAnswerCorrect: isCorrect,
                setupReward: reward,
                phase: PHASES.SETUP_RESULT,
            };
        }

        // ── Proceed from Setup Result to Objective ──
        case 'PROCEED_TO_OBJECTIVE': {
            const idx = state.currentSetupPlayerIndex;
            const player = state.players[idx];
            const objective = getObjective(player.diplomaId);
            const players = state.players.map((p, i) =>
                i === idx ? {
                    ...p,
                    objectiveText: objective.text,
                    objectiveTarget: objective.target,
                    acceptedObjective: objective.isMandatory ? true : false,
                } : p
            );
            return {
                ...state,
                players,
                phase: PHASES.OBJECTIVE_DISPLAY,
            };
        }

        // ── Accept/Refuse Objective ──
        case 'RESPOND_OBJECTIVE': {
            const { accepted } = action;
            const idx = state.currentSetupPlayerIndex;
            const players = state.players.map((p, i) =>
                i === idx ? { ...p, acceptedObjective: accepted } : p
            );
            const nextSetupIdx = idx + 1;
            if (nextSetupIdx < players.length) {
                // More players to set up
                return {
                    ...state,
                    players,
                    currentSetupPlayerIndex: nextSetupIdx,
                    phase: PHASES.PATH_SELECTION,
                    currentSetupQuestion: null,
                    setupAnswerCorrect: null,
                    setupReward: 0,
                };
            }
            // All players set up — start main game
            const gamePlayers = players.map((p, i) => ({ ...p, isTurn: i === 0 }));
            return {
                ...state,
                players: gamePlayers,
                currentPlayerIndex: 0,
                currentTurn: 1,
                phase: PHASES.MAIN_DICE,
                currentSetupQuestion: null,
                setupAnswerCorrect: null,
                setupReward: 0,
            };
        }

        // ── Main Dice Roll ──
        case 'ROLL_MAIN_DICE': {
            const result = rollDice(6);
            const card = drawCard(result);
            return {
                ...state,
                currentDiceResult: result,
                currentCard: card,
                phase: PHASES.CARD_DISPLAY,
            };
        }

        // ── Apply Card & go to Question ──
        case 'APPLY_CARD': {
            const idx = state.currentPlayerIndex;
            const player = state.players[idx];
            const updated = applyCardEffect(player, state.currentCard);
            const players = state.players.map((p, i) => i === idx ? updated : p);
            const question = getRandomQuestion(state.usedQuestionIndices);
            return {
                ...state,
                players,
                currentQuestion: question,
                phase: PHASES.END_TURN_QUESTION,
            };
        }

        // ── Answer End-of-Turn Question ──
        case 'ANSWER_QUESTION': {
            const { answer } = action;
            const isCorrect = answer === state.currentQuestion.a;
            const usedQuestionIndices = [...state.usedQuestionIndices, state.currentQuestion._index];

            if (isCorrect) {
                return {
                    ...state,
                    questionAnswerCorrect: true,
                    usedQuestionIndices,
                    phase: PHASES.OBJECTIVE_DICE,
                };
            }
            // Wrong — go to turn summary
            return {
                ...state,
                questionAnswerCorrect: false,
                usedQuestionIndices,
                objectiveDiceResult: null,
                phase: PHASES.TURN_SUMMARY,
            };
        }

        // ── Roll Objective Die (1d3) ──
        case 'ROLL_OBJECTIVE_DICE': {
            const idx = state.currentPlayerIndex;
            const player = state.players[idx];
            if (!player.acceptedObjective) {
                // Player refused objective, skip
                return {
                    ...state,
                    objectiveDiceResult: 0,
                    phase: PHASES.TURN_SUMMARY,
                };
            }
            const result = rollDice(3);
            const updated = applyObjectivePoints(player, result);
            const players = state.players.map((p, i) => i === idx ? updated : p);
            return {
                ...state,
                players,
                objectiveDiceResult: result,
                phase: PHASES.TURN_SUMMARY,
            };
        }

        // ── End Turn → Next Player ──
        case 'NEXT_TURN': {
            const nextIndex = getNextPlayerIndex(state.currentPlayerIndex, state.players.length);
            const isNewRound = nextIndex === 0;
            const nextTurn = isNewRound ? state.currentTurn + 1 : state.currentTurn;

            // Check victory before advancing
            const victory = checkVictory(state.players, nextTurn);
            if (victory.gameOver) {
                return {
                    ...state,
                    winner: victory.winner,
                    victoryReason: victory.reason,
                    phase: PHASES.GAME_OVER,
                };
            }

            const players = state.players.map((p, i) => ({ ...p, isTurn: i === nextIndex }));
            return {
                ...state,
                players,
                currentPlayerIndex: nextIndex,
                currentTurn: nextTurn,
                currentDiceResult: null,
                currentCard: null,
                currentQuestion: null,
                questionAnswerCorrect: null,
                objectiveDiceResult: null,
                phase: PHASES.MAIN_DICE,
            };
        }

        // ── Reset ──
        case 'RESET_GAME':
            return { ...initialState };

        default:
            return state;
    }
}
