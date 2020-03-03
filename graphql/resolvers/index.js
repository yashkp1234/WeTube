const userResolvers = require("./users");
const roomResolvers = require("./room");

module.exports = {
  Room: {
    userCount: parent => parent.users.length
  },
  Query: {
    ...roomResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...roomResolvers.Mutation
  },
  Subscription: {
    ...roomResolvers.Subscription
  }
};
