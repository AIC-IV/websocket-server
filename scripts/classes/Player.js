class Player {
  
  constructor(username, id, image) {
    this.username = username;
    this.id = id;
    this.image = image;
    this.points = 0;
  }

  resetPoints() {
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