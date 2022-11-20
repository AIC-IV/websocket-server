const levenshteinDistance = (str1 = "", str2 = "") => {
    const track = Array(str2.length + 1)
        .fill(null)
        .map(() => Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator // substitution
            );
        }
    }
    return track[str2.length][str1.length];
};

const { animals } = require("../words/animals");
const { food } = require("../words/food");
const { objects } = require("../words/objects");
const { verbs } = require("../words/verbs");
const { professions } = require("../words/professions");
const { places } = require("../words/places");
const shuffle = require('shuffle-array');

const getSecretWords = (category) => {
    switch (category) {
        case "animais":
            return shuffle(animals).slice(0, 30);
        case "comida":
            return shuffle(food).slice(0, 30);
        case "objetos":
            return shuffle(objects).slice(0, 30);
        case "verbos":
            return shuffle(verbs).slice(0, 30);
        case "profissões":
            return shuffle(professions).slice(0, 30);
        case "lugares":
            return shuffle(places).slice(0, 30);
        default:
            return "Envie uma categoria";
    }
};

module.exports = { levenshteinDistance, getSecretWords };