// ═══════════════════════════════════════════════════════════
// DÉCOUVRE TA VOIE — Server (Express + Socket.io)
// ═══════════════════════════════════════════════════════════

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

// ── Global crash protection ──
process.on('uncaughtException', (err) => {
    console.error('⚠️ Uncaught Exception (server kept alive):', err.message);
    console.error(err.stack);
});
process.on('unhandledRejection', (reason) => {
    console.error('⚠️ Unhandled Rejection (server kept alive):', reason);
});

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            /\.vercel\.app$/,
            'https://ibrahim0899.github.io',
        ],
        methods: ['GET', 'POST'],
    },
});

// ── Latency ping handler ──────────────────────────────────
io.on('connection', (socket) => {
    socket.on('ping-check', (cb) => { if (typeof cb === 'function') cb(); });
});

// ── Game Data (mirrored from client) ──────────────────────
const CARDS_BONUS = [
    { text: "Entretien d'embauche pour le métier de tes rêves.", effect: 3 },
    { text: "Validation de la période d'essai.", effect: 6 },
    { text: "Formation certifiante.", effect: 4 },
    { text: "Le mentor bienveillant.", effect: 4 },
    { text: "Prime d'activité.", effect: 2 },
    { text: "Aide à la mobilité.", effect: 3 },
    { text: "Coup de collier réussi.", effect: 4 },
    { text: "Le réseau s'active.", effect: 5 },
    { text: "Droit à la déconnexion.", effect: 2 },
    { text: "Entretien annuel positif.", effect: 4 },
    { text: "Équilibre Vie Pro/Vie Perso.", effect: 5 },
    { text: "CV percutant.", effect: 3 },
    { text: "Simulation d'entretien réussie.", effect: 2 },
    { text: "Compétence numérique maîtrisée.", effect: 4 },
    { text: "Stage ou alternance valorisant(e).", effect: 3 },
    { text: "Recommandation professionnelle.", effect: 5 },
    { text: "Contrat signé.", effect: 6 },
    { text: "Coaching emploi.", effect: 3 },
    { text: "Soft skills remarquées.", effect: 4 },
    { text: "Projet personnel valorisé.", effect: 3 },
];

const CARDS_MALUS = [
    { text: "Fin de contrat CDD.", effect: -4 },
    { text: "Burn-out / Fatigue intense.", effect: -3 },
    { text: "Coupure de budget.", effect: -2 },
    { text: "Retard de versement.", effect: -2 },
    { text: "Le Ghosting des recruteurs.", effect: -1 },
    { text: "Conflit de valeurs.", effect: -2 },
    { text: "Matériel défaillant.", effect: -1 },
    { text: "Réorganisation interne.", effect: -2 },
    { text: "Compétences obsolètes.", effect: -2 },
    { text: "Erreur de casting.", effect: -1 },
    { text: "Entretien raté.", effect: -1 },
    { text: "Refus automatique algorithme.", effect: -1 },
    { text: "Stage non rémunéré.", effect: -2 },
    { text: "Promesse non tenue.", effect: -2 },
    { text: "Mobilité imposée.", effect: -1 },
    { text: "Pression hiérarchique.", effect: -3 },
    { text: "Période d'essai non validée.", effect: -3 },
    { text: "Problème de santé imprévu.", effect: -2 },
];

const CARDS_CHANCE = [
    { text: "Prospect signé.", effect: 2 },
    { text: "Bonne négociation.", effect: 1 },
    { text: "Recommandation client.", effect: 3 },
    { text: "Formation suivie.", effect: 2 },
    { text: "Pitch réussi.", effect: 4 },
    { text: "Client hésitant.", effect: -3 },
    { text: "Concurrence agressive.", effect: -3 },
    { text: "Manque d'organisation.", effect: -2 },
    { text: "Stress.", effect: -4 },
    { text: "Objectif flou.", effect: -1 },
    { text: "Enfin du bonheur (chèques cadeaux).", effect: 2 },
    { text: "Panne de réveil.", effect: -1 },
    { text: "Tendresse (chat).", effect: 3 },
    { text: "Besoins (toilettes bouchées).", effect: -2 },
    { text: "Manque de cohésion.", effect: -3 },
    { text: "Discrimination.", effect: -5 },
    { text: "Opportunité promotion.", effect: 5 },
    { text: "Jalousie collègue.", effect: -4 },
    { text: "Réseau (carte patron).", effect: 3 },
    { text: "Audace.", effect: 3 },
];

const QUESTIONS_START = [
    { type: "BAC", q: "Qui est l'auteur de Les Misérables ?", a: "Victor Hugo", choices: ["Zola", "Victor Hugo", "Balzac"] },
    { type: "BAC", q: "En quelle année la France remporte la coupe du monde ?", a: "2018", choices: ["1998", "2006", "2018"] },
    { type: "BAC Pro", q: "Combien de joueurs compose une équipe de rugby?", a: "15", choices: ["11", "13", "15"] },
    { type: "BAC Pro", q: 'Quel élément du tableau périodique a pour symbole "Au" ?', a: "Or", choices: ["Argent", "Or", "Cuivre"] },
    { type: "BAC+2", q: "Somme des angles d'un triangle ?", a: "180°", choices: ["90°", "180°", "360°"] },
    { type: "BAC+2", q: "Déesse de la guerre ?", a: "Athena", choices: ["Héra", "Aphrodite", "Athena"] },
    { type: "Entrepreneur", q: "Année déclaration indépendance USA ?", a: "1776", choices: ["1492", "1776", "1789"] },
];

const GENERAL_KNOWLEDGE_QUESTIONS = [
    // ── Culture Générale ──
    { q: "Quelle est la capitale de l'Australie ?", a: "Canberra", choices: ["Sydney", "Melbourne", "Canberra"] },
    { q: "Combien de continents y a-t-il ?", a: "7", choices: ["5", "6", "7"] },
    { q: "Qui a peint la Joconde ?", a: "Léonard de Vinci", choices: ["Michel-Ange", "Raphaël", "Léonard de Vinci"] },
    { q: "Quel est le plus grand océan ?", a: "Pacifique", choices: ["Atlantique", "Indien", "Pacifique"] },
    { q: "En quelle année l'homme a-t-il marché sur la Lune ?", a: "1969", choices: ["1965", "1969", "1972"] },
    { q: "Quel gaz les plantes absorbent-elles ?", a: "CO2", choices: ["O2", "CO2", "N2"] },
    { q: "Combien d'os a le corps humain adulte ?", a: "206", choices: ["186", "206", "226"] },
    { q: "Quelle est la monnaie du Japon ?", a: "Yen", choices: ["Won", "Yen", "Yuan"] },
    { q: "Qui a écrit Le Petit Prince ?", a: "Saint-Exupéry", choices: ["Victor Hugo", "Albert Camus", "Saint-Exupéry"] },
    { q: "Quel est le plus long fleuve du monde ?", a: "Le Nil", choices: ["L'Amazone", "Le Nil", "Le Yangtsé"] },
    { q: "De quel pays vient le sushi ?", a: "Japon", choices: ["Chine", "Corée", "Japon"] },
    { q: "Combien de faces a un cube ?", a: "6", choices: ["4", "6", "8"] },
    { q: "Quelle planète est surnommée la planète rouge ?", a: "Mars", choices: ["Jupiter", "Mars", "Vénus"] },
    { q: "Qui a inventé l'ampoule électrique ?", a: "Thomas Edison", choices: ["Nikola Tesla", "Thomas Edison", "Graham Bell"] },
    { q: "Quel est le symbole chimique de l'eau ?", a: "H2O", choices: ["CO2", "H2O", "NaCl"] },
    { q: "Dans quel pays se trouve la Grande Muraille ?", a: "Chine", choices: ["Japon", "Inde", "Chine"] },
    { q: "Combien de minutes dans une heure ?", a: "60", choices: ["30", "60", "90"] },
    { q: "Quel animal est le plus rapide ?", a: "Le guépard", choices: ["Le lion", "Le guépard", "Le faucon"] },
    { q: "Quelle est la langue la plus parlée au monde ?", a: "Le mandarin", choices: ["L'anglais", "L'espagnol", "Le mandarin"] },
    { q: "Combien de joueurs dans une équipe de football ?", a: "11", choices: ["9", "11", "13"] },
    { q: "Quel est le plus petit pays du monde ?", a: "Vatican", choices: ["Monaco", "Vatican", "Malte"] },
    { q: "De quel continent vient le café ?", a: "Afrique", choices: ["Amérique du Sud", "Asie", "Afrique"] },
    { q: "Combien de lettres dans l'alphabet français ?", a: "26", choices: ["24", "26", "28"] },
    { q: "Quel est le métal le plus conducteur ?", a: "L'argent", choices: ["Le cuivre", "L'or", "L'argent"] },
    { q: "Dans quel pays se trouve le Machu Picchu ?", a: "Pérou", choices: ["Bolivie", "Pérou", "Colombie"] },
    { q: "Qui a fondé Apple ?", a: "Steve Jobs", choices: ["Bill Gates", "Steve Jobs", "Elon Musk"] },
    { q: "Quel organe produit l'insuline ?", a: "Le pancréas", choices: ["Le foie", "Le pancréas", "L'estomac"] },
    { q: "Quelle est la devise de la France ?", a: "Liberté, Égalité, Fraternité", choices: ["Unité, Force, Progrès", "Liberté, Égalité, Fraternité", "Justice, Paix, Travail"] },
    { q: "Combien de pays dans l'Union Européenne (2024) ?", a: "27", choices: ["25", "27", "30"] },
    { q: "Quel est le plus grand désert du monde ?", a: "Antarctique", choices: ["Sahara", "Antarctique", "Gobi"] },
    // ── Réinsertion Professionnelle ──
    { q: "Qu'est-ce que Pôle Emploi (France Travail) ?", a: "Un service public d'aide à l'emploi", choices: ["Une banque", "Un service public d'aide à l'emploi", "Une école"] },
    { q: "Que signifie le sigle CV ?", a: "Curriculum Vitae", choices: ["Contrat de Vente", "Curriculum Vitae", "Courrier Validé"] },
    { q: "Quel document accompagne généralement un CV ?", a: "Une lettre de motivation", choices: ["Un passeport", "Une lettre de motivation", "Un relevé bancaire"] },
    { q: "Que signifie CDI ?", a: "Contrat à Durée Indéterminée", choices: ["Contrat de Développement Individuel", "Contrat à Durée Indéterminée", "Certificat de Diplôme International"] },
    { q: "Que signifie CDD ?", a: "Contrat à Durée Déterminée", choices: ["Contrat à Durée Déterminée", "Contrat de Droit Direct", "Certificat de Début de Diplôme"] },
    { q: "Qu'est-ce qu'un entretien d'embauche ?", a: "Un rendez-vous pour évaluer un candidat", choices: ["Un examen médical", "Un rendez-vous pour évaluer un candidat", "Une formation"] },
    { q: "Que sont les soft skills ?", a: "Les compétences relationnelles et comportementales", choices: ["Des logiciels informatiques", "Les compétences relationnelles et comportementales", "Des certifications"] },
    { q: "Qu'est-ce qu'un bilan de compétences ?", a: "Une démarche pour analyser ses compétences et aspirations", choices: ["Un examen scolaire", "Une démarche pour analyser ses compétences et aspirations", "Un test médical"] },
    { q: "Que signifie VAE ?", a: "Validation des Acquis de l'Expérience", choices: ["Vérification Annuelle d'Emploi", "Validation des Acquis de l'Expérience", "Valeur Ajoutée Économique"] },
    { q: "Quel est le salaire minimum en France (SMIC) en 2024 ?", a: "Environ 1 400 € net/mois", choices: ["Environ 1 000 € net/mois", "Environ 1 400 € net/mois", "Environ 1 800 € net/mois"] },
    { q: "Qu'est-ce que le CPF ?", a: "Compte Personnel de Formation", choices: ["Curriculum Personnel de Formation", "Compte Personnel de Formation", "Centre Professionnel de France"] },
    { q: "Quelle est la durée légale du travail en France ?", a: "35 heures par semaine", choices: ["30 heures par semaine", "35 heures par semaine", "40 heures par semaine"] },
    { q: "Qu'est-ce qu'une période d'essai ?", a: "Une période pour évaluer le salarié et l'emploi", choices: ["Un test écrit", "Une période pour évaluer le salarié et l'emploi", "Un stage obligatoire"] },
    { q: "Que signifie RSA ?", a: "Revenu de Solidarité Active", choices: ["Revenu de Solidarité Active", "Régime Social Alternatif", "Réseau Social d'Aide"] },
    { q: "Qu'est-ce que l'intérim ?", a: "Un travail temporaire via une agence", choices: ["Un stage en entreprise", "Un travail temporaire via une agence", "Un contrat de fonction publique"] },
    { q: "Que signifie le sigle SMIC ?", a: "Salaire Minimum Interprofessionnel de Croissance", choices: ["Service Minimum d'Insertion et de Compétences", "Salaire Minimum Interprofessionnel de Croissance", "Système de Mobilité Interne et Collective"] },
    { q: "Qu'est-ce qu'une reconversion professionnelle ?", a: "Changer de métier ou de secteur d'activité", choices: ["Prendre sa retraite", "Changer de métier ou de secteur d'activité", "Obtenir une promotion"] },
    { q: "Quel organisme gère l'assurance chômage en France ?", a: "France Travail (ex Pôle Emploi)", choices: ["La CAF", "France Travail (ex Pôle Emploi)", "La CPAM"] },
    { q: "Qu'est-ce qu'un réseau professionnel ?", a: "Des contacts utiles pour sa carrière", choices: ["Un réseau Wi-Fi au travail", "Des contacts utiles pour sa carrière", "Un logiciel de gestion"] },
    { q: "Que signifie le terme freelance ?", a: "Travailleur indépendant", choices: ["Travailleur indépendant", "Stagiaire non rémunéré", "Employé à mi-temps"] },
    { q: "Qu'est-ce que LinkedIn ?", a: "Un réseau social professionnel", choices: ["Un moteur de recherche", "Un réseau social professionnel", "Un site d'e-commerce"] },
    { q: "Que veut dire 'être en insertion professionnelle' ?", a: "Être en démarche pour intégrer le marché du travail", choices: ["Être à la retraite", "Être en démarche pour intégrer le marché du travail", "Être en vacances"] },
    { q: "Qu'est-ce qu'un micro-entrepreneur ?", a: "Un indépendant avec un régime fiscal simplifié", choices: ["Le patron d'une grande entreprise", "Un indépendant avec un régime fiscal simplifié", "Un employé de mairie"] },
    { q: "Quel est l'intérêt d'un stage en entreprise ?", a: "Acquérir de l'expérience et des compétences", choices: ["Gagner plus d'argent", "Acquérir de l'expérience et des compétences", "Remplacer un diplôme"] },
    { q: "Que signifie le sigle ARE ?", a: "Allocation de Retour à l'Emploi", choices: ["Aide à la Reconversion Entrepreneuriale", "Allocation de Retour à l'Emploi", "Assurance Retraite Européenne"] },
];

const OBJECTIVES = {
    noDiploma: "Tu n'as pas de diplôme, mais tu es motivé. Ton objectif est d'avoir au moins 15 points d'objectifs avant la moitié des tours.",
    bac: "Tu as le BAC, maintenant il te faut l'emploi qui va avec. Atteint 20 points d'objectifs.",
    bacPro: "Après ton BAC pro, tu décides de changer d'horizon. Cette liberté sera atteignable à 20 points d'objectifs.",
    bac2: "Après ton BAC + 2, tu veux un emploi stable. Ton objectif est d'avoir 20 points d'objectifs.",
    bac3: "Après ton BAC + 3, tu souhaites travailler. Tu auras ton emploi avec 20 points d'objectifs.",
    bac5: "BAC + 5 check ! Ta maison de rêve est atteignable à 25 points d'objectif.",
    bac8: "Après ton BAC + 8, tu rêves de stabilité. Il te faut 25 points d'objectif.",
    entrepreneur: "Tu veux être entrepreneur. Pour ce faire, tu dois remplir ta jauge d'objectif à au moins 20 points.",
};

const OBJECTIVE_TARGETS = {
    noDiploma: 15, bac: 20, bacPro: 20, bac2: 20, bac3: 20, bac5: 25, bac8: 25, entrepreneur: 20,
};

const DIPLOMA_PATHS = [
    { id: "noDiploma", label: "Sans Diplôme", stabilityBonus: 2, stabilityMalus: -1 },
    { id: "bac", label: "BAC", stabilityBonus: 3, stabilityMalus: -1 },
    { id: "bacPro", label: "BAC Pro", stabilityBonus: 3, stabilityMalus: -1 },
    { id: "bac2", label: "BAC+2", stabilityBonus: 4, stabilityMalus: -2 },
    { id: "bac3", label: "BAC+3", stabilityBonus: 4, stabilityMalus: -2 },
    { id: "bac5", label: "BAC+5", stabilityBonus: 5, stabilityMalus: -2 },
    { id: "bac8", label: "BAC+8", stabilityBonus: 6, stabilityMalus: -3 },
    { id: "entrepreneur", label: "Entrepreneur", stabilityBonus: 4, stabilityMalus: -2 },
];

const DIPLOMA_TO_QUESTION_TYPE = {
    noDiploma: null, bac: "BAC", bacPro: "BAC Pro", bac2: "BAC+2", bac3: "BAC+3", bac5: "BAC+5", bac8: "BAC+8", entrepreneur: "Entrepreneur",
};

const MAX_TURNS = 40;
const MAX_OBJECTIVE = 30;

// ── Room Storage ──────────────────────────────────────────
const rooms = new Map();

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

function rollDice(sides = 6) {
    return Math.floor(Math.random() * sides) + 1;
}

function drawCard(diceResult) {
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

function getSetupQuestion(diplomaId) {
    const questionType = DIPLOMA_TO_QUESTION_TYPE[diplomaId];
    if (!questionType) {
        return GENERAL_KNOWLEDGE_QUESTIONS[Math.floor(Math.random() * GENERAL_KNOWLEDGE_QUESTIONS.length)];
    }
    const matched = QUESTIONS_START.filter(q => q.type === questionType);
    if (matched.length === 0) {
        return GENERAL_KNOWLEDGE_QUESTIONS[Math.floor(Math.random() * GENERAL_KNOWLEDGE_QUESTIONS.length)];
    }
    return matched[Math.floor(Math.random() * matched.length)];
}

function getRandomQuestion(usedIndices = []) {
    const available = GENERAL_KNOWLEDGE_QUESTIONS
        .map((q, i) => ({ ...q, _index: i }))
        .filter(q => !usedIndices.includes(q._index));
    if (available.length === 0) {
        const idx = Math.floor(Math.random() * GENERAL_KNOWLEDGE_QUESTIONS.length);
        return { ...GENERAL_KNOWLEDGE_QUESTIONS[idx], _index: idx };
    }
    return available[Math.floor(Math.random() * available.length)];
}

// ── Safe handler wrapper (prevents server crash) ──
function safeHandler(fn) {
    return (...args) => {
        try {
            fn(...args);
        } catch (err) {
            console.error(`⚠️ Socket handler error: ${err.message}`);
            console.error(err.stack);
        }
    };
}

// ── Socket.io Logic ───────────────────────────────────────
io.on('connection', (socket) => {
    console.log(`✦ Connected: ${socket.id}`);

    // ── Create Room ──
    socket.on('create-room', ({ playerName }, callback) => {
        const roomCode = generateRoomCode();
        const room = {
            code: roomCode,
            hostId: socket.id,
            players: [{
                id: 0,
                socketId: socket.id,
                name: playerName,
                diploma: null,
                diplomaId: null,
                stabilityGauge: 30,
                objectiveGauge: 0,
                objectiveTarget: 0,
                objectiveText: '',
                acceptedObjective: false,
                isTurn: false,
                ready: false,
            }],
            phase: 'LOBBY',
            currentPlayerIndex: 0,
            currentSetupPlayerIndex: 0,
            currentTurn: 1,
            usedQuestionIndices: [],
            currentDiceResult: null,
            currentCard: null,
            currentQuestion: null,
            currentSetupQuestion: null,
            setupAnswerCorrect: null,
            setupReward: 0,
            questionAnswerCorrect: null,
            objectiveDiceResult: null,
            winner: null,
            victoryReason: null,
            started: false,
        };
        rooms.set(roomCode, room);
        socket.join(roomCode);
        callback({ success: true, roomCode, playerId: 0 });
        console.log(`✦ Room ${roomCode} created by ${playerName}`);
    });

    // ── Join Room ──
    socket.on('join-room', ({ roomCode, playerName }, callback) => {
        const room = rooms.get(roomCode);
        if (!room) return callback({ success: false, error: 'Salon introuvable' });
        if (room.started) return callback({ success: false, error: 'La partie a déjà commencé' });
        if (room.players.length >= 8) return callback({ success: false, error: 'Salon plein (max 8)' });

        const playerId = room.players.length;
        room.players.push({
            id: playerId,
            socketId: socket.id,
            name: playerName,
            diploma: null,
            diplomaId: null,
            stabilityGauge: 30,
            objectiveGauge: 0,
            objectiveTarget: 0,
            objectiveText: '',
            acceptedObjective: false,
            isTurn: false,
            ready: false,
        });
        socket.join(roomCode);
        callback({ success: true, roomCode, playerId });
        io.to(roomCode).emit('room-update', { players: room.players.map(sanitizePlayer), phase: room.phase });
        console.log(`✦ ${playerName} joined room ${roomCode}`);
    });

    // ── Rejoin Room (for page navigation) ──
    socket.on('rejoin-room', ({ roomCode, playerName, playerId }, callback) => {
        const room = rooms.get(roomCode);
        if (!room) return callback({ success: false, error: 'Salon introuvable' });

        const player = room.players[playerId];
        if (!player || player.name !== playerName) {
            return callback({ success: false, error: 'Joueur non trouvé' });
        }

        // Update socket ID for this player
        player.socketId = socket.id;
        socket.join(roomCode);

        // Cancel any pending room deletion timer
        if (room._deleteTimer) {
            clearTimeout(room._deleteTimer);
            room._deleteTimer = null;
        }

        // Cancel any pending turn-skip timer
        if (room._turnSkipTimer) {
            clearTimeout(room._turnSkipTimer);
            room._turnSkipTimer = null;
        }

        // If the game hasn't started, check if this is the host
        if (!room.started && room.players[0].socketId === socket.id) {
            room.hostId = socket.id;
        }

        callback({ success: true });

        // Send current state
        if (room.started) {
            socket.emit('game-state', sanitizeRoom(room));
        } else {
            socket.emit('room-update', { players: room.players.map(sanitizePlayer), phase: room.phase });
        }
        console.log(`✦ ${playerName} rejoined room ${roomCode}`);
    });

    // ── Start Game ──
    socket.on('start-game', ({ roomCode }) => {
        const room = rooms.get(roomCode);
        if (!room || room.hostId !== socket.id) return;
        if (room.players.length < 2) return;

        room.started = true;
        room.phase = 'PATH_SELECTION';
        room.currentSetupPlayerIndex = 0;
        io.to(roomCode).emit('game-state', sanitizeRoom(room));
        console.log(`✦ Game started in room ${roomCode}`);
    });

    // ── Choose Path ──
    socket.on('choose-path', ({ roomCode, diplomaId, diplomaLabel }) => {
        const room = rooms.get(roomCode);
        if (!room) return;
        const playerIdx = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIdx === -1 || playerIdx !== room.currentSetupPlayerIndex) return;

        const path = DIPLOMA_PATHS.find(p => p.id === diplomaId);
        if (!path) return;

        room.players[playerIdx].diplomaId = diplomaId;
        room.players[playerIdx].diploma = diplomaLabel;

        const question = getSetupQuestion(diplomaId);
        room.currentSetupQuestion = question;
        room.phase = 'SETUP_QUESTION';
        io.to(roomCode).emit('game-state', sanitizeRoom(room));
    });

    // ── Answer Setup Question ──
    socket.on('answer-setup-question', ({ roomCode, answer }) => {
        const room = rooms.get(roomCode);
        if (!room) return;
        const playerIdx = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIdx === -1 || playerIdx !== room.currentSetupPlayerIndex) return;

        const isCorrect = answer === room.currentSetupQuestion.a;
        const path = DIPLOMA_PATHS.find(p => p.id === room.players[playerIdx].diplomaId);
        const reward = isCorrect ? path.stabilityBonus : path.stabilityMalus;
        room.players[playerIdx].stabilityGauge = Math.max(0, room.players[playerIdx].stabilityGauge + reward);
        room.setupAnswerCorrect = isCorrect;
        room.setupReward = reward;
        room.phase = 'SETUP_RESULT';
        io.to(roomCode).emit('game-state', sanitizeRoom(room));
    });

    // ── Proceed to Objective ──
    socket.on('proceed-to-objective', ({ roomCode }) => {
        const room = rooms.get(roomCode);
        if (!room) return;
        const idx = room.currentSetupPlayerIndex;
        const player = room.players[idx];
        const diplomaId = player.diplomaId;

        player.objectiveText = OBJECTIVES[diplomaId];
        player.objectiveTarget = OBJECTIVE_TARGETS[diplomaId];
        player.acceptedObjective = diplomaId === 'noDiploma';

        room.phase = 'OBJECTIVE_DISPLAY';
        io.to(roomCode).emit('game-state', sanitizeRoom(room));
    });

    // ── Respond to Objective ──
    socket.on('respond-objective', ({ roomCode, accepted }) => {
        const room = rooms.get(roomCode);
        if (!room) return;
        const idx = room.currentSetupPlayerIndex;
        room.players[idx].acceptedObjective = accepted;

        const nextIdx = idx + 1;
        if (nextIdx < room.players.length) {
            room.currentSetupPlayerIndex = nextIdx;
            room.phase = 'PATH_SELECTION';
            room.currentSetupQuestion = null;
            room.setupAnswerCorrect = null;
            room.setupReward = 0;
        } else {
            // Start main game
            room.players.forEach((p, i) => { p.isTurn = i === 0; });
            room.currentPlayerIndex = 0;
            room.currentTurn = 1;
            room.phase = 'MAIN_DICE';
            room.currentSetupQuestion = null;
            room.setupAnswerCorrect = null;
            room.setupReward = 0;
        }
        io.to(roomCode).emit('game-state', sanitizeRoom(room));
    });

    // ── Roll Main Dice ──
    socket.on('roll-dice', ({ roomCode }) => {
        const room = rooms.get(roomCode);
        if (!room) return;
        const playerIdx = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIdx !== room.currentPlayerIndex) return;

        const result = rollDice(6);
        const card = drawCard(result);
        room.currentDiceResult = result;
        room.currentCard = card;
        room.phase = 'CARD_DISPLAY';
        io.to(roomCode).emit('game-state', sanitizeRoom(room));
    });

    // ── Apply Card ──
    socket.on('apply-card', ({ roomCode }) => {
        const room = rooms.get(roomCode);
        if (!room) return;
        const idx = room.currentPlayerIndex;
        room.players[idx].stabilityGauge = Math.max(0, room.players[idx].stabilityGauge + room.currentCard.effect);

        const question = getRandomQuestion(room.usedQuestionIndices);
        room.currentQuestion = question;
        room.phase = 'END_TURN_QUESTION';
        io.to(roomCode).emit('game-state', sanitizeRoom(room));
    });

    // ── Answer Question ──
    socket.on('answer-question', ({ roomCode, answer }) => {
        const room = rooms.get(roomCode);
        if (!room) return;
        const playerIdx = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIdx !== room.currentPlayerIndex) return;

        const isCorrect = answer === room.currentQuestion.a;
        room.usedQuestionIndices.push(room.currentQuestion._index);
        room.questionAnswerCorrect = isCorrect;
        room.playerAnswer = answer;

        if (isCorrect) {
            const currentPlayer = room.players[room.currentPlayerIndex];
            if (currentPlayer.acceptedObjective) {
                room.phase = 'OBJECTIVE_DICE';
            } else {
                // No objective — skip objective dice
                room.objectiveDiceResult = null;
                room.phase = 'TURN_SUMMARY';
            }
        } else {
            room.objectiveDiceResult = null;
            room.phase = 'TURN_SUMMARY';
        }
        io.to(roomCode).emit('game-state', sanitizeRoom(room));
    });

    // ── Roll Objective Dice ──
    socket.on('roll-objective-dice', ({ roomCode }) => {
        const room = rooms.get(roomCode);
        if (!room) return;
        const idx = room.currentPlayerIndex;
        const player = room.players[idx];

        if (!player.acceptedObjective) {
            room.objectiveDiceResult = 0;
            room.phase = 'TURN_SUMMARY';
        } else {
            const result = rollDice(3);
            player.objectiveGauge = Math.min(MAX_OBJECTIVE, player.objectiveGauge + result);
            room.objectiveDiceResult = result;
            room.phase = 'TURN_SUMMARY';
        }
        io.to(roomCode).emit('game-state', sanitizeRoom(room));
    });

    // ── Next Turn ──
    socket.on('next-turn', ({ roomCode }) => {
        const room = rooms.get(roomCode);
        if (!room) return;

        const nextIndex = (room.currentPlayerIndex + 1) % room.players.length;
        const isNewRound = nextIndex === 0;
        const nextTurn = isNewRound ? room.currentTurn + 1 : room.currentTurn;

        // Check victory at end of 40 turns
        if (nextTurn > MAX_TURNS) {
            // ── Fair scoring system ──
            // Score = stabilityGauge + objectiveBonus
            // objectiveBonus = (objectiveGauge / objectiveTarget) * 20  (up to 20 points bonus)
            // Players without objective: bonus = 0
            // A player MUST have >= 50 stability to be eligible to win
            const scored = room.players.map(p => {
                const objBonus = p.acceptedObjective
                    ? Math.round((Math.min(p.objectiveGauge, p.objectiveTarget) / p.objectiveTarget) * 20)
                    : 0;
                const totalScore = p.stabilityGauge + objBonus;
                const eligible = p.stabilityGauge >= 50;
                return { ...sanitizePlayer(p), totalScore, objBonus, eligible };
            });

            // Sort: eligible players first, then by totalScore desc
            scored.sort((a, b) => {
                if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
                return b.totalScore - a.totalScore;
            });

            room.winner = scored[0];
            room.victoryReason = scored[0].eligible ? 'score' : 'best_effort';
            room.finalScores = scored;
            room.phase = 'GAME_OVER';
            io.to(roomCode).emit('game-state', sanitizeRoom(room));
            return;
        }

        room.players.forEach((p, i) => { p.isTurn = i === nextIndex; });
        room.currentPlayerIndex = nextIndex;
        room.currentTurn = nextTurn;
        room.currentDiceResult = null;
        room.currentCard = null;
        room.currentQuestion = null;
        room.questionAnswerCorrect = null;
        room.objectiveDiceResult = null;
        room.phase = 'MAIN_DICE';
        io.to(roomCode).emit('game-state', sanitizeRoom(room));
    });

    // ── Leave Game (voluntary) ──
    socket.on('leave-game', ({ roomCode }) => {
        const room = rooms.get(roomCode);
        if (!room) return;
        const idx = room.players.findIndex(p => p.socketId === socket.id);
        if (idx === -1) return;

        const leavingName = room.players[idx].name;
        room.players.splice(idx, 1);

        // Re-index player IDs
        room.players.forEach((p, i) => { p.id = i; });

        if (room.players.length === 0) {
            rooms.delete(roomCode);
            return;
        }

        // If only 1 player left and game is in progress, end the game
        if (room.started && room.players.length === 1) {
            room.winner = sanitizePlayer(room.players[0]);
            room.victoryReason = 'last_standing';
            room.phase = 'GAME_OVER';
            io.to(roomCode).emit('game-state', sanitizeRoom(room));
            io.to(roomCode).emit('player-left', { playerName: leavingName });
            return;
        }

        if (room.started) {
            // Adjust currentPlayerIndex
            if (idx < room.currentPlayerIndex) {
                room.currentPlayerIndex = room.currentPlayerIndex - 1;
            } else if (idx === room.currentPlayerIndex) {
                // It was this player's turn — move to next
                room.currentPlayerIndex = room.currentPlayerIndex % room.players.length;
                room.currentDiceResult = null;
                room.currentCard = null;
                room.currentQuestion = null;
                room.questionAnswerCorrect = null;
                room.objectiveDiceResult = null;
                room.phase = 'MAIN_DICE';
            }
            // Ensure index is in bounds
            if (room.currentPlayerIndex >= room.players.length) {
                room.currentPlayerIndex = 0;
            }
            room.players.forEach((p, i) => { p.isTurn = i === room.currentPlayerIndex; });

            // Adjust setup indices too
            if (room.currentSetupPlayerIndex >= room.players.length) {
                room.currentSetupPlayerIndex = room.players.length - 1;
            }

            // Transfer host if needed
            if (room.hostId === socket.id && room.players.length > 0) {
                room.hostId = room.players[0].socketId;
            }

            io.to(roomCode).emit('game-state', sanitizeRoom(room));
            io.to(roomCode).emit('player-left', { playerName: leavingName });
        } else {
            // Game hasn't started — transfer host if needed
            if (room.hostId === socket.id && room.players.length > 0) {
                room.hostId = room.players[0].socketId;
            }
            io.to(roomCode).emit('room-update', { players: room.players.map(sanitizePlayer), phase: room.phase });
            io.to(roomCode).emit('player-left', { playerName: leavingName });
        }
        socket.leave(roomCode);
        console.log(`✦ ${leavingName} left room ${roomCode}`);
    });

    // ── Disconnect ──
    socket.on('disconnect', () => {
        console.log(`✦ Disconnected: ${socket.id}`);
        for (const [code, room] of rooms) {
            const idx = room.players.findIndex(p => p.socketId === socket.id);
            if (idx !== -1) {
                if (!room.started) {
                    // Mark player as having a stale socket (will be updated on rejoin)
                    room.players[idx].socketId = null;

                    // Check if ALL sockets are null (everyone navigated away)
                    const allDisconnected = room.players.every(p => p.socketId === null);
                    if (allDisconnected) {
                        // Grace period: wait 15s — if no one rejoins, delete the room
                        room._deleteTimer = setTimeout(() => {
                            const stillAllDisconnected = room.players.every(p => p.socketId === null);
                            if (stillAllDisconnected) {
                                rooms.delete(code);
                                console.log(`✦ Room ${code} deleted (abandoned)`);
                            }
                        }, 15000);
                    } else {
                        // Notify remaining players
                        if (room.hostId === socket.id && room.players.some(p => p.socketId)) {
                            const newHost = room.players.find(p => p.socketId);
                            if (newHost) room.hostId = newHost.socketId;
                        }
                        io.to(code).emit('room-update', { players: room.players.map(sanitizePlayer), phase: room.phase });
                    }
                } else {
                    // Game in progress: mark as disconnected and notify
                    room.players[idx].socketId = null;
                    io.to(code).emit('player-disconnected', { playerName: room.players[idx].name });

                    // If it's this player's turn, auto-skip after 30s
                    if (room.currentPlayerIndex === idx) {
                        room._turnSkipTimer = setTimeout(() => {
                            // Check they're still disconnected
                            if (room.players[idx].socketId === null && rooms.has(code)) {
                                console.log(`✦ Auto-skipping ${room.players[idx].name}'s turn (disconnected 30s)`);
                                // Move to next player
                                const connectedPlayers = room.players.filter(p => p.socketId !== null);
                                if (connectedPlayers.length === 0) {
                                    rooms.delete(code);
                                    return;
                                }
                                let nextIndex = (room.currentPlayerIndex + 1) % room.players.length;
                                // Skip over disconnected players
                                let attempts = 0;
                                while (room.players[nextIndex].socketId === null && attempts < room.players.length) {
                                    nextIndex = (nextIndex + 1) % room.players.length;
                                    attempts++;
                                }
                                room.currentPlayerIndex = nextIndex;
                                room.currentDiceResult = null;
                                room.currentCard = null;
                                room.currentQuestion = null;
                                room.questionAnswerCorrect = null;
                                room.objectiveDiceResult = null;
                                room.phase = 'MAIN_DICE';
                                io.to(code).emit('game-state', sanitizeRoom(room));
                                io.to(code).emit('turn-skipped', { playerName: room.players[idx].name });
                            }
                        }, 30000);
                    }
                }
            }
        }
    });
});

// ── Sanitize for client (remove socketId) ─────────────────
function sanitizePlayer(p) {
    const { socketId, ...rest } = p;
    return rest;
}

function sanitizeRoom(room) {
    return {
        code: room.code,
        phase: room.phase,
        players: room.players.map(sanitizePlayer),
        currentPlayerIndex: room.currentPlayerIndex,
        currentSetupPlayerIndex: room.currentSetupPlayerIndex,
        currentTurn: room.currentTurn,
        currentDiceResult: room.currentDiceResult,
        currentCard: room.currentCard,
        currentQuestion: room.currentQuestion,
        currentSetupQuestion: room.currentSetupQuestion,
        setupAnswerCorrect: room.setupAnswerCorrect,
        setupReward: room.setupReward,
        questionAnswerCorrect: room.questionAnswerCorrect,
        playerAnswer: room.playerAnswer || null,
        objectiveDiceResult: room.objectiveDiceResult,
        winner: room.winner,
        victoryReason: room.victoryReason,
        finalScores: room.finalScores || null,
    };
}

// ── Health Check ──────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ status: 'ok', rooms: rooms.size });
});

// ── Start Server ──────────────────────────────────────────
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`\n✦ Découvre ta Voie Server`);
    console.log(`✦ Listening on http://localhost:${PORT}\n`);
});
