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
    if (this.checkRoomExistance(id)) {
      const room = this.rooms.get(id);
      const joined = room.joinRoom(username);
      if (joined) {
        const room = this.rooms.get(id);
        return { success: true, room };
      } else {
        return { success: false, err: "Could not join room" };
      }
    } else {
      return { success: false, err: "Room does not exist" };
    }
  }

  createRoom(req) {
    try {
      const roomName = req.body.roomName;
      const isRoomPrivate = req.body.isRoomPrivate;
      const owner = req.body.owner;
      const room = new Room(roomName, isRoomPrivate, owner);
      this.rooms.set(roomName, room);
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

}

module.exports = { Rooms };
