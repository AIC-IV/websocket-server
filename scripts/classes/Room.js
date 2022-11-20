const { levenshteinDistance, getSecretWords } = require('../utils/strings');
const { Player } = require('./Player');

class Room {
  constructor(roomName, isPrivate, roomOwner) {
    this.name = roomName;
    this.isPrivate = isPrivate;
    this.owner = roomOwner;
    this.rounds = 2;
    this.currRound = 0;
    this.currPlayer = 0;
    this.playerInTurn = null;
    this.secretWord = "banana";
    this.maxPlayers = 10;
    this.theme = null;
    this.players = new Map();
    this.disconnectedPlayers = new Map();
    this.playersThatGuessedCorrectly = new Set();
    this.secretWords = [];
    this.playerOrder = [];
    this.endGame = false;
  }

  startGame() {
    this.secretWords = getSecretWords(this.theme);
    this.playerOrder = Array.from(this.players.keys());
    this.currRound = 0;
    this.nextRound();
    this.nextTurn();
  }

  nextPlayer() {
    while (this.currPlayer <= this.playerOrder.length) {
      const nextPlayer = this.playerOrder[this.currPlayer];
      this.currPlayer++;

      if (this.players.has(nextPlayer)) {
        this.playerInTurn = this.players.get(nextPlayer);
        return;
      }
    }

    this.nextRound();
    this.nextTurn();
  }

  nextRound() {
    this.currRound++;
    this.currPlayer = 0;
    if (this.currRound >= this.rounds) {
      this.endGame =  true;
    }
  }

  nextTurn() {
    this.nextPlayer();
    this.secretWord = this.secretWords.pop().toLowerCase().trim();
    this.resetAvailablePoints();
    this.resetPlayersThatGuessedCorrectly();
  }

  resetAvailablePoints() {
    this.guesserPoints = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    this.playerInTurnPoints = 10;
  }

  resetPlayersThatGuessedCorrectly() {
    this.playersThatGuessedCorrectly = new Set();
  }

  joinRoom(username) {
    if (this.players.has(username)) return true;

    if (this.disconnectedPlayers.has(username)) {
      const player = this.disconnectedPlayers.get(username);
      this.players.set(username, player);
      this.disconnectedPlayers.delete(player);
      return true;
    }

    if (this.players.size < this.maxPlayers) {
      const player = new Player(username);
      this.players.set(username, player);
      if (this.currRound !== 0) this.playerOrder.push(username);
      return true;
    }

    return false;
  }

  getPlayers() {
    return Array.from(this.players.values());
  }

  addPoints(username) {
    if (this.playersThatGuessedCorrectly.has(username)) return false;

    const points = this.guesserPoints.pop();
    this.players.get(username).addPoints(points);
    this.playerInTurn.addPoints(this.playerInTurnPoints);
    this.playersThatGuessedCorrectly.add(username);

    return true;
  }

  didAllPlayersGuessCorrectly() {
    for (const [username, _] of this.players) {
      if (!this.playersThatGuessedCorrectly.has(username) && username !== this.playerInTurn.username) {
        return false;
      }
    }
    return true;
  }

  validateGuess(guess) {
    const curatedGuess = guess.toLowerCase().trim();
    const dist = levenshteinDistance(this.secretWord, curatedGuess);

    if (dist === 0) {
      return { match: true, message: `Palavra correta! ` };
    } else if (dist === 1 || dist === 2) {
      return { match: false, message: `Quase lá... A palavra é bem parecida com essa` };
    } else {
      return { match: false };
    }
  }

  disconnectPlayer(username) {
    if (this.players.has(username)) {
      const player = this.players.get(username);
      this.disconnectedPlayers.set(username, player);
      this.players.delete(username);
      return true;
    }

    return false;
  }

  setTheme(theme) {
    this.theme = theme;
  }
}

module.exports = Room;
