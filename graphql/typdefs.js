const gql = require("graphql-tag");

module.exports = gql`
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  type Room {
    id: ID!
    users: [String]!
    url: String!
    playing: Boolean!
    vidTime: Float!
    volume: Float!
    userCount: Int!
    candidate: String!
    offer: String!
    answer: String!
  }
  type RoomSub {
    room: Room!
    username: String!
  }
  type RTCSub {
    id: ID!
    username: String!
    offer: String
    answer: String
    candidate: String
  }
  type ReactionSub {
    id: ID!
    username: String!
    reaction: String!
    photo: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    queryRoom(id: ID!): Room!
    queryCandidate(id: ID!): String!
    queryOffer(id: ID!): String!
    queryAnswer(id: ID!): String!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createRoom(username: String!): Room!
    pauseVideo(id: ID!, username: String!): Boolean!
    playVideo(id: ID!, username: String!): Boolean!
    seekVideo(id: ID!, vidTime: Float, username: String!): Boolean!
    setVolumeVideo(id: ID!, volume: Float!, username: String!): Boolean!
    setUrlVideo(id: ID!, url: String!, username: String!): Boolean!
    syncVideo(
      id: ID!
      vidTime: Float!
      url: String!
      username: String!
    ): Boolean!
    joinRoom(id: ID!, username: String!): Boolean!
    leaveRoom(id: ID!, username: String!): Boolean!
    setCandidate(id: ID!, username: String!, candidate: String!): Boolean!
    setOffer(id: ID!, username: String!, offer: String!): Boolean!
    setAnswer(id: ID!, username: String!, answer: String!): Boolean!
    resetRoomRTC(id: ID!, username: String!): Boolean!
    sendReaction(
      id: ID!
      username: String!
      reaction: String!
      photo: String!
    ): Boolean!
  }
  type Subscription {
    videoPaused(id: ID!): RoomSub
    videoPlayed(id: ID!): RoomSub
    videoSeeked(id: ID!): RoomSub
    videoUrlSet(id: ID!): RoomSub
    videoVolumeSet(id: ID!, username: String!): RoomSub
    videoSynced(id: ID!): RoomSub
    candidateSet(id: ID!, username: String!): RTCSub!
    offerSet(id: ID!, username: String!): RTCSub!
    answerSet(id: ID!, username: String!): RTCSub!
    roomRTCReset(id: ID!): RTCSub!
    reactionSent(id: ID!): ReactionSub!
  }
`;
