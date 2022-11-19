const { faPlaneDeparture } = require('@fortawesome/free-solid-svg-icons');

class Room {

  constructor(roomName, isRoomPrivate, roomOwner) {
    this.roomName = roomName;
    this.isRoomPrivate = isRoomPrivate;
    this.owner = roomOwner;
    this.rounds = 4;
    this.currRound = 0;
    this.currPlayer = 0;
    this.currWord = '';
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
   
}

module.exports = Room;
