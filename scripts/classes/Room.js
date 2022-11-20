const { levenshteinDistance } = require('../utils/strings');

class Room {

  constructor(roomName, isPrivate, roomOwner) {
    this.name = roomName;
    this.isPrivate = isPrivate;
    this.owner = roomOwner;
    this.rounds = 4;
    this.currRound = 0;
    this.currPlayer = 0;
    this.secretWord = 'banana';
    this.maxPlayers = 10;
    this.players = [];
    this.theme = null;
  }

  joinRoom(player) {
    let playerAlreadyJoined = false;
    for (const p of this.players) {
      if (p.username === player) playerAlreadyJoined = true;
    }

    if (playerAlreadyJoined) return true;

    if (this.players.length < this.maxPlayers) {
      this.players.push({ username: player, points: 0 });
      return true;
    }

    return false;
  }

  getPlayers() {
    return this.players;
  }

  validateGuess(guess) {
    console.log(guess)
    const curatedGuess = guess.toLowerCase().trim();
    const dist = levenshteinDistance(this.secretWord, curatedGuess);
    
    if (dist === 0) {
      return { match: true, message: `Palavra correta! `};
    } else if (dist === 1 || dist === 2) {
      return { match: false, message: `Quase lá... A palavra é bem parecida com essa` };
    } else {
      return { match: false };
    }
  }
}

module.exports = Room;
