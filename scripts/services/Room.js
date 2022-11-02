class Room {

  constructor(theme, roomOwner) {
    this.theme = theme;
    this.roomOwner = roomOwner;
    this.rounds = 4;
    this.currRound = 0;
    this.currWord = '';
    this.maxPlayers = 10;
    this.players = [roomOwner];
  }

  getPlayers() {
    return this.players;
  }
   
}

module.exports = new Room();
