// ═══════════════════════════════════════════════════════════
// DÉCOUVRE TA VOIE — Game Data Constants
// ═══════════════════════════════════════════════════════════

export const MAX_TURNS = 40;
export const MAX_OBJECTIVE = 30;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 8;

// ── Diploma Paths ──────────────────────────────────────────
export const DIPLOMA_PATHS = [
    { id: "noDiploma", label: "Sans Diplôme", stabilityBonus: 2, stabilityMalus: -1 },
    { id: "bac", label: "BAC", stabilityBonus: 3, stabilityMalus: -1 },
    { id: "bacPro", label: "BAC Pro", stabilityBonus: 3, stabilityMalus: -1 },
    { id: "bac2", label: "BAC+2", stabilityBonus: 4, stabilityMalus: -2 },
    { id: "bac3", label: "BAC+3", stabilityBonus: 4, stabilityMalus: -2 },
    { id: "bac5", label: "BAC+5", stabilityBonus: 5, stabilityMalus: -2 },
    { id: "bac8", label: "BAC+8", stabilityBonus: 6, stabilityMalus: -3 },
    { id: "entrepreneur", label: "Entrepreneur", stabilityBonus: 4, stabilityMalus: -2 },
];

// ── Objectives ─────────────────────────────────────────────
export const OBJECTIVES = {
    noDiploma: "Tu n'as pas de diplôme, mais tu es motivé. Ton objectif est d'avoir au moins 15 points d'objectifs avant la moitié des tours.",
    bac: "Tu as le BAC, maintenant il te faut l'emploi qui va avec. Atteint 20 points d'objectifs.",
    bacPro: "Après ton BAC pro, tu décides de changer d'horizon. Cette liberté sera atteignable à 20 points d'objectifs.",
    bac2: "Après ton BAC + 2, tu veux un emploi stable. Ton objectif est d'avoir 20 points d'objectifs.",
    bac3: "Après ton BAC + 3, tu souhaites travailler. Tu auras ton emploi avec 20 points d'objectifs.",
    bac5: "BAC + 5 check ! Ta maison de rêve est atteignable à 25 points d'objectif.",
    bac8: "Après ton BAC + 8, tu rêves de stabilité. Il te faut 25 points d'objectif.",
    entrepreneur: "Tu veux être entrepreneur. Pour ce faire, tu dois remplir ta jauge d'objectif à au moins 20 points.",
};

export const OBJECTIVE_TARGETS = {
    noDiploma: 15,
    bac: 20,
    bacPro: 20,
    bac2: 20,
    bac3: 20,
    bac5: 25,
    bac8: 25,
    entrepreneur: 20,
};

// ── Setup Questions (per Path) ─────────────────────────────
export const QUESTIONS_START = [
    { type: "BAC", q: "Qui est l'auteur de Les Misérables ?", a: "Victor Hugo", choices: ["Zola", "Victor Hugo", "Balzac"] },
    { type: "BAC", q: "En quelle année la France remporte la coupe du monde ?", a: "2018", choices: ["1998", "2006", "2018"] },
    { type: "BAC Pro", q: "Combien de joueurs compose une équipe de rugby?", a: "15", choices: ["11", "13", "15"] },
    { type: "BAC Pro", q: "Quel élément du tableau périodique a pour symbole \"Au\" ?", a: "Or", choices: ["Argent", "Or", "Cuivre"] },
    { type: "BAC+2", q: "Somme des angles d'un triangle ?", a: "180°", choices: ["90°", "180°", "360°"] },
    { type: "BAC+2", q: "Déesse de la guerre ?", a: "Athena", choices: ["Héra", "Aphrodite", "Athena"] },
    { type: "Entrepreneur", q: "Année déclaration indépendance USA ?", a: "1776", choices: ["1492", "1776", "1789"] },
];

// ── General Knowledge Questions (for end-of-turn) ──────────
export const GENERAL_KNOWLEDGE_QUESTIONS = [
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
];

// ── Bonus Cards ────────────────────────────────────────────
export const CARDS_BONUS = [
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

// ── Malus Cards ────────────────────────────────────────────
export const CARDS_MALUS = [
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

// ── Chance Cards ───────────────────────────────────────────
export const CARDS_CHANCE = [
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

// ── Helper: map diploma id to question type ────────────────
export const DIPLOMA_TO_QUESTION_TYPE = {
    noDiploma: null,
    bac: "BAC",
    bacPro: "BAC Pro",
    bac2: "BAC+2",
    bac3: "BAC+3",
    bac5: "BAC+5",
    bac8: "BAC+8",
    entrepreneur: "Entrepreneur",
};
