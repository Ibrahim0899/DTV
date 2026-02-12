// ═══════════════════════════════════════════════════════════
// DÉCOUVRE TA VOIE — Game Engine (pure functions)
// ═══════════════════════════════════════════════════════════

import {
    CARDS_BONUS, CARDS_MALUS, CARDS_CHANCE,
    QUESTIONS_START, GENERAL_KNOWLEDGE_QUESTIONS,
    OBJECTIVES, OBJECTIVE_TARGETS, DIPLOMA_PATHS,
    DIPLOMA_TO_QUESTION_TYPE, MAX_TURNS, MAX_OBJECTIVE,
} from '../constants/gameData.js';

// ── Dice ───────────────────────────────────────────────────
export function rollDice(sides = 6) {
    return Math.floor(Math.random() * sides) + 1;
}

// ── Card Drawing ───────────────────────────────────────────
export function drawCard(diceResult) {
    if (diceResult === 1) {
        const card = CARDS_MALUS[Math.floor(Math.random() * CARDS_MALUS.length)];
        return { ...card, type: 'malus' };
    } else if (diceResult === 6) {
        const card = CARDS_BONUS[Math.floor(Math.random() * CARDS_BONUS.length)];
        return { ...card, type: 'bonus' };
    } else {
        const card = CARDS_CHANCE[Math.floor(Math.random() * CARDS_CHANCE.length)];
        return { ...card, type: 'chance' };
    }
}

// ── Apply card effect ──────────────────────────────────────
export function applyCardEffect(player, card) {
    const newStability = Math.max(0, player.stabilityGauge + card.effect);
    return { ...player, stabilityGauge: newStability };
}

// ── Setup question logic ───────────────────────────────────
export function getSetupQuestion(diplomaId) {
    const questionType = DIPLOMA_TO_QUESTION_TYPE[diplomaId];
    if (!questionType) {
        // "Sans Diplôme" — use a random general knowledge question
        return GENERAL_KNOWLEDGE_QUESTIONS[Math.floor(Math.random() * GENERAL_KNOWLEDGE_QUESTIONS.length)];
    }
    const matched = QUESTIONS_START.filter(q => q.type === questionType);
    if (matched.length === 0) {
        // Fallback to general knowledge
        return GENERAL_KNOWLEDGE_QUESTIONS[Math.floor(Math.random() * GENERAL_KNOWLEDGE_QUESTIONS.length)];
    }
    return matched[Math.floor(Math.random() * matched.length)];
}

// ── General knowledge question ─────────────────────────────
export function getRandomQuestion(usedIndices = []) {
    const available = GENERAL_KNOWLEDGE_QUESTIONS
        .map((q, i) => ({ ...q, _index: i }))
        .filter(q => !usedIndices.includes(q._index));

    if (available.length === 0) {
        // All exhausted, reset
        const q = GENERAL_KNOWLEDGE_QUESTIONS[Math.floor(Math.random() * GENERAL_KNOWLEDGE_QUESTIONS.length)];
        return { ...q, _index: GENERAL_KNOWLEDGE_QUESTIONS.indexOf(q) };
    }
    return available[Math.floor(Math.random() * available.length)];
}

// ── Get objective for a path ───────────────────────────────
export function getObjective(diplomaId) {
    return {
        text: OBJECTIVES[diplomaId],
        target: OBJECTIVE_TARGETS[diplomaId],
        isMandatory: diplomaId === 'noDiploma',
    };
}

// ── Get stability bonus/malus for setup answer ─────────────
export function getSetupReward(diplomaId, isCorrect) {
    const path = DIPLOMA_PATHS.find(p => p.id === diplomaId);
    if (!path) return 0;
    return isCorrect ? path.stabilityBonus : path.stabilityMalus;
}

// ── Apply objective points ─────────────────────────────────
export function applyObjectivePoints(player, points) {
    const newObjective = Math.min(MAX_OBJECTIVE, player.objectiveGauge + points);
    return { ...player, objectiveGauge: newObjective };
}

// ── Check victory ──────────────────────────────────────────
export function checkVictory(players, currentTurn) {
    // Check if any player with accepted objective reached their target
    for (const player of players) {
        if (player.acceptedObjective && player.objectiveGauge >= player.objectiveTarget) {
            return { gameOver: true, winner: player, reason: 'objective' };
        }
    }

    // Check if we've reached max turns
    if (currentTurn > MAX_TURNS) {
        const sorted = [...players].sort((a, b) => b.stabilityGauge - a.stabilityGauge);
        return { gameOver: true, winner: sorted[0], reason: 'stability' };
    }

    return { gameOver: false };
}

// ── Create initial player object ───────────────────────────
export function createPlayer(name, index) {
    return {
        id: index,
        name,
        diploma: null,
        diplomaId: null,
        stabilityGauge: 0,
        objectiveGauge: 0,
        objectiveTarget: 0,
        objectiveText: '',
        acceptedObjective: false,
        isTurn: index === 0,
    };
}

// ── Advance to next player ─────────────────────────────────
export function getNextPlayerIndex(currentIndex, totalPlayers) {
    return (currentIndex + 1) % totalPlayers;
}
