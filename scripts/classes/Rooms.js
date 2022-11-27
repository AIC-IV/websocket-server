const { PreventXSS } = require('../utils/PreventXSS');
const Room = require("./Room");

class Rooms {

  constructor() {
    this.rooms = new Map();
    this.preventXSS = new PreventXSS();
  }

  getRoomInfo(req) {
    let query = this.preventXSS.escapeAllContentStrings(req["query"]);
    const id = query["id"];

    if (this.checkRoomExistance(id)) {
      return { success: true, room: this.rooms.get(id) };
    } else {
      return { success: false, err: "Room does not exist" };
    }
  };

  joinRoom(req) {
    const id = req.body.roomId;
    const username = req.body.username;
    const image = req.body.image;
    console.log(image);
    if (this.checkRoomExistance(id)) {
      const room = this.rooms.get(id);
      const joined = room.joinRoom(username, image);
      if (joined) {
        const room = this.rooms.get(id);
        return { success: true, room, players: room.getPlayers() };
      } else {
        return { success: false, err: "Could not join room" };
      }
    } else {
      return { success: false, err: "Room does not exist" };
    }
  }

  createRoom(req) {
    try {
      const name = req.body.roomName;
      const isPrivate = req.body.isRoomPrivate;
      const owner = req.body.owner;
      const room = new Room(name, isPrivate, owner);
      this.rooms.set(name, room);
      return { success: true }
    } catch (e) {
      return { success: false }
    }
  }

  getRoom(id) {
    if (this.rooms.has(id)) {
      return this.rooms.get(id);
    }

    return null;
  }

  doesRoomExist(req) {
    const query = req["query"];
    let cleanQuery = this.preventXSS.escapeAllContentStrings(query);
    const id = cleanQuery["id"];
    return { exists: this.checkRoomExistance(id) };
  }

  checkRoomExistance(id) {
    return this.rooms.has(id);
  }

  getRooms() {
    const roomsArr = Array.from(this.rooms.values());
    return { rooms:
        roomsArr
        .filter(room => !room.isPrivate)
        .filter(room => room.players.size < room.maxPlayers)
        .map(room => { return { ...room, numOfPlayers: room.players.size } })
    };
  }

}

module.exports = { Rooms };
