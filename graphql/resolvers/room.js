const { withFilter } = require("apollo-server");

const Room = require("../../models/Room");

module.exports = {
  Query: {
    async queryRoom(_, { id }) {
      return await Room.findById({ _id: id });
    },

    async queryCandidate(_, { id }) {
      const room = await Room.findById({ _id: id });
      if (room) {
        return room.candidate;
      } else {
        throw new Error("Room not found");
      }
    },

    async queryOffer(_, { id }) {
      const room = await Room.findById({ _id: id });
      if (room) {
        return room.offer;
      } else {
        throw new Error("Room not found");
      }
    },

    async queryAnswer(_, { id }) {
      const room = await Room.findById({ _id: id });
      if (room) {
        return room.answer;
      } else {
        throw new Error("Room not found");
      }
    }
  },

  Mutation: {
    async createRoom(_, { username }) {
      return await new Room({
        users: [username],
        url: "https://www.youtube.com/watch?v=Q-Zh3Av6fpA",
        playing: true,
        vidTime: 0,
        volume: 1,
        candidate: "",
        offer: "",
        answer: ""
      }).save();
    },

    async pauseVideo(_, { id, username }, context) {
      const room = await Room.findById({ _id: id });
      if (!room) {
        throw new Error("Room not found");
      }
      await Room.updateOne({ _id: id }, { $set: { playing: false } });
      const roomUp = await Room.findById({ _id: id });

      context.pubsub.publish("VIDEO_PAUSED", {
        videoPaused: { room: roomUp, username }
      });
      return roomUp.playing;
    },

    async playVideo(_, { id, username }, context) {
      const room = await Room.findById({ _id: id });
      if (!room) {
        throw new Error("Room not found");
      }
      await Room.updateOne({ _id: id }, { $set: { playing: true } });
      const roomUp = await Room.findById({ _id: id });

      context.pubsub.publish("VIDEO_PLAYED", {
        videoPlayed: { room: roomUp, username }
      });
      return roomUp.playing;
    },

    async setUrlVideo(_, { id, url, username }, context) {
      const room = await Room.findById({ _id: id });
      if (!room) {
        throw new Error("Room not found");
      }
      await Room.updateOne({ _id: id }, { $set: { url, vidTime: 0 } });
      const roomUp = await Room.findById({ _id: id });
      context.pubsub.publish("VIDEO_URL_SET", {
        videoUrlSet: { room: roomUp, username }
      });
      return true;
    },

    async seekVideo(_, { id, vidTime, username }, context) {
      const room = await Room.findById({ _id: id });
      if (!room) {
        throw new Error("Room not found");
      }
      await Room.updateOne({ _id: id }, { $set: { vidTime } });
      const roomUp = await Room.findById({ _id: id });
      context.pubsub.publish("VIDEO_SEEKED", {
        videoSeeked: { room: roomUp, username }
      });
      return vidTime;
    },

    async setVolumeVideo(_, { id, volume, username }, context) {
      const room = await Room.findById({ _id: id });
      if (!room) {
        throw new Error("Room not found");
      }
      await Room.updateOne({ _id: id }, { $set: { volume } });
      const roomUp = await Room.findById({ _id: id });
      context.pubsub.publish("VIDEO_VOLUME_SET", {
        videoVolumeSet: { room: roomUp, username }
      });
      return true;
    },

    async joinRoom(_, { id, username }, context) {
      const room = await Room.findById({ _id: id });
      if (!room) {
        throw new Error("Room not found");
      }
      if (room.users.indexOf(username) < 0) {
        await Room.updateOne(
          { _id: id },
          { $set: { users: [...room.users, username] } }
        );
        const roomUp = await Room.findById({ _id: id });
        context.pubsub.publish("USER_JOINED_ROOM", {
          userJoinedRoom: { room: roomUp, username }
        });
        return roomUp.users.indexOf(username) > 0;
      }
      return false;
    },

    async leaveRoom(_, { id, username }, context) {
      const room = await Room.findById({ _id: id });
      if (!room) {
        throw new Error("Room not found");
      }
      if (room.users.indexOf(username) > -1) {
        await Room.updateOne(
          { _id: id },
          {
            $set: {
              users: room.users.filter(usernameA => usernameA !== username)
            }
          }
        );
        const roomUp = await Room.findById({ _id: id });
        context.pubsub.publish("USER_LEFT_ROOM", {
          userJoinedRoom: { room: roomUp, username }
        });
        return true;
      }
      return false;
    },

    async syncVideo(_, { id, url, vidTime, username }, context) {
      const room = await Room.findById({ _id: id });
      if (!room) {
        throw new Error("Room not found");
      }
      await Room.updateOne(
        { _id: id },
        { $set: { url, vidTime, playing: true } }
      );
      const roomUp = await Room.findById({ _id: id });
      context.pubsub.publish("VIDEO_SYNCED", {
        videoSynced: { room: roomUp, username }
      });
      return true;
    },

    async setCandidate(_, { id, username, candidate }, context) {
      const room = await Room.findById({ _id: id });
      if (!room) {
        throw new Error("Room not found");
      }
      await Room.updateOne({ _id: id }, { $set: { candidate } });
      const roomUp = await Room.findById({ _id: id });
      context.pubsub.publish("CANDIDATE_SET", {
        candidateSet: { id, candidate, username }
      });
      return true;
    },

    async setOffer(_, { id, username, offer }, context) {
      const room = await Room.findById({ _id: id });
      if (!room) {
        throw new Error("Room not found");
      }
      await Room.updateOne({ _id: id }, { $set: { offer } });
      const roomUp = await Room.findById({ _id: id });
      context.pubsub.publish("OFFER_SET", {
        offerSet: { id, offer, username }
      });
      return true;
    },

    async setAnswer(_, { id, username, answer }, context) {
      const room = await Room.findById({ _id: id });
      if (!room) {
        throw new Error("Room not found");
      }
      await Room.updateOne({ _id: id }, { $set: { answer } });
      const roomUp = await Room.findById({ _id: id });
      context.pubsub.publish("ANSWER_SET", {
        answerSet: { id, answer, username }
      });
      return true;
    },

    async resetRoomRTC(_, { id, username }, context) {
      const room = await Room.findById({ _id: id });
      if (!room) {
        throw new Error("Room not found");
      }
      await Room.updateOne(
        { _id: id },
        { $set: { answer: "", candidate: "", offer: "" } }
      );
      const roomUp = await Room.findById({ _id: id });
      context.pubsub.publish("ROOMRTC_RESET", {
        roomRTCReset: { id, username }
      });
      return true;
    },

    async sendReaction(_, { id, photo, reaction, username }, context) {
      context.pubsub.publish("REACTION_SENT", {
        reactionSent: { id, username, reaction, photo }
      });
      return true;
    }
  },

  Subscription: {
    videoPaused: {
      subscribe: withFilter(
        (_, __, context) => context.pubsub.asyncIterator("VIDEO_PAUSED"),
        (payload, variables) => {
          return payload.videoPaused.room._id == variables.id;
        }
      )
    },
    videoPlayed: {
      subscribe: withFilter(
        (_, __, context) => context.pubsub.asyncIterator("VIDEO_PLAYED"),
        (payload, variables) => {
          return payload.videoPlayed.room._id == variables.id;
        }
      )
    },
    videoSeeked: {
      subscribe: withFilter(
        (_, __, context) => context.pubsub.asyncIterator("VIDEO_SEEKED"),
        (payload, variables) => {
          return payload.videoSeeked.room._id == variables.id;
        }
      )
    },
    videoUrlSet: {
      subscribe: withFilter(
        (_, __, context) => context.pubsub.asyncIterator("VIDEO_URL_SET"),
        (payload, variables) => {
          return payload.videoUrlSet.room._id == variables.id;
        }
      )
    },
    videoVolumeSet: {
      subscribe: withFilter(
        (_, __, context) => context.pubsub.asyncIterator("VIDEO_VOLUME_SET"),
        (payload, variables) => {
          return (
            payload.videoVolumeSet.room._id == variables.id &&
            payload.videoVolumeSet.username === variables.username
          );
        }
      )
    },
    videoSynced: {
      subscribe: withFilter(
        (_, __, context) => context.pubsub.asyncIterator("VIDEO_SYNCED"),
        (payload, variables) => {
          return payload.videoSynced.room._id == variables.id;
        }
      )
    },
    candidateSet: {
      subscribe: withFilter(
        (_, __, context) => context.pubsub.asyncIterator("CANDIDATE_SET"),
        (payload, variables) => {
          return (
            payload.candidateSet.id == variables.id &&
            payload.candidateSet.username !== variables.username
          );
        }
      )
    },
    offerSet: {
      subscribe: withFilter(
        (_, __, context) => context.pubsub.asyncIterator("OFFER_SET"),
        (payload, variables) => {
          return (
            payload.offerSet.id == variables.id &&
            payload.offerSet.username !== variables.username
          );
        }
      )
    },
    answerSet: {
      subscribe: withFilter(
        (_, __, context) => context.pubsub.asyncIterator("ANSWER_SET"),
        (payload, variables) => {
          return (
            payload.answerSet.id == variables.id &&
            payload.answerSet.username !== variables.username
          );
        }
      )
    },
    roomRTCReset: {
      subscribe: withFilter(
        (_, __, context) => context.pubsub.asyncIterator("ROOMRTC_RESET"),
        (payload, variables) => {
          return payload.roomRTCReset.id == variables.id;
        }
      )
    },
    reactionSent: {
      subscribe: withFilter(
        (_, __, context) => context.pubsub.asyncIterator("REACTION_SENT"),
        (payload, variables) => {
          return payload.reactionSent.id == variables.id;
        }
      )
    }
  }
};
