const { levenshteinDistance, getSecretWords } = require('../utils/strings');
const { Player } = require('./Player');

class Room {
  constructor(roomName, isPrivate, roomOwner) {
    this.name = roomName;
    this.isPrivate = isPrivate;
    this.owner = roomOwner;
    this.maxPlayers = 10;
    this.rounds = 5;
    this.players = new Map();
    this.disconnectedPlayers = new Map();
    this.createInitialState();
  }

  createInitialState() {
    this.currRound = 0;
    this.roundStartTime;
    this.currPlayer = 0;
    this.playerInTurn = null;
    this.secretWord = '';
    this.theme = null;
    this.secretWords = [];
    this.playerOrder = [];
    this.endGame = false;
    this.disconnectedPlayers = new Map();
    this.playersThatGuessedCorrectly = new Set();
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
    this.roundStartTime = Date.now();
    this.guesserPoints = 1000;
    this.playerInTurnPoints = 1000;
  }

  resetPlayersThatGuessedCorrectly() {
    this.playersThatGuessedCorrectly = new Set();
  }

  joinRoom(username, userId, image) {
    if (this.players.has(username)) return true;

    if (this.disconnectedPlayers.has(username)) {
      const player = this.disconnectedPlayers.get(username);
      this.players.set(username, player);
      this.disconnectedPlayers.delete(player);
      return true;
    }

    if (this.players.size < this.maxPlayers) {
      const player = new Player(username, userId, image);
      this.players.set(username, player);
      if (this.currRound !== 0) this.playerOrder.push(username);
      return true;
    }

    return false;
  }

  getPlayers() {
    return Array.from(this.players.values());
  }

  getPoints() {
    const elapsedTime = Math.floor((Date.now() - this.roundStartTime) / 1000);
    const guesser = Math.floor(this.guesserPoints / elapsedTime);
    const playerInTurn = Math.floor(this.playerInTurnPoints / (elapsedTime * this.players.size));
    return [guesser, playerInTurn];
  }

  addPoints(username) {
    if (this.playersThatGuessedCorrectly.has(username)) return false;
    const [guesser, playerInTurn] = this.getPoints();
    
    this.players.get(username).addPoints(guesser);
    this.playerInTurn.addPoints(playerInTurn);
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
      
      if (this.owner === username) {
        this.owner = Array.from(this.players.keys())[0] || null;
        console.log('disconnecting: ', username, ' setting as owner: ', this.owner);
      }   
      return true;
    }

    return false;
  }

  getMatchResults() {
    const players = Array.from(this.players.values());
    players.sort((p1, p2) => p2.getPoints() - p1.getPoints());
    const matchResults = [];
    for (const [i, player] of players.entries()) {
      const p = { userId: player.id, points: player.getPoints(), placement: i+1 };
      matchResults.push(p);
    }
    return matchResults;
  }

  setTheme(theme) {
    this.theme = theme;
  }

  cleanPlayerPoints(players) {
    for (const player of players) {
      player.resetPoints();
    }
  }

  playAgain() {
    this.createInitialState();
    this.cleanPlayerPoints(this.players);
    this.disconnectedPlayers = new Map();
    this.startGame();
  }
}

module.exports = Room;
