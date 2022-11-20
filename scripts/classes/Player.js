class Player {
  
  constructor(username) {
    this.username = username;
    this.points = 0;
  }

  addPoints(points) {
    this.points += points;
  }

  getPoints() {
    return this.points;
  }

  getUsername() {
    return this.username;
  }

}

module.exports = { Player };