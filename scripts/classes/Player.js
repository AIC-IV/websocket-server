class Player {
  
  constructor(username, image) {
    this.username = username;
    this.image = image;
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