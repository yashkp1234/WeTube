import gql from "graphql-tag";

export const VIDEO_PLAYED_SUBSCRIPTION = gql`
  subscription($id: ID!) {
    videoPlayed(id: $id) {
      room {
        playing
      }
      username
    }
  }
`;

export const VIDEO_PAUSED_SUBSCRIPTION = gql`
  subscription($id: ID!) {
    videoPaused(id: $id) {
      room {
        playing
      }
      username
    }
  }
`;

export const SET_TIME_SUBSCRIPTION = gql`
  subscription($id: ID!) {
    videoSeeked(id: $id) {
      room {
        vidTime
      }
      username
    }
  }
`;

export const SET_URL_SUBSCRIPTION = gql`
  subscription($id: ID!) {
    videoUrlSet(id: $id) {
      room {
        url
      }
      username
    }
  }
`;

export const SET_VOLUME_SUBSCRIPTION = gql`
  subscription($id: ID!, $username: String!) {
    videoVolumeSet(id: $id, username: $username) {
      room {
        volume
      }
      username
    }
  }
`;

export const VIDEO_SYNCED_SUBSCRIPTION = gql`
  subscription($id: ID!) {
    videoSynced(id: $id) {
      room {
        url
        vidTime
      }
      username
    }
  }
`;

export const CANDIDATE_SET_SUBSCRIPTION = gql`
  subscription($id: ID!, $username: String!) {
    candidateSet(id: $id, username: $username) {
      id
      username
      candidate
    }
  }
`;

export const OFFER_SET_SUBSCRIPTION = gql`
  subscription($id: ID!, $username: String!) {
    offerSet(id: $id, username: $username) {
      id
      username
      offer
    }
  }
`;

export const ANSWER_SET_SUBSCRIPTION = gql`
  subscription($id: ID!, $username: String!) {
    answerSet(id: $id, username: $username) {
      id
      username
      answer
    }
  }
`;

export const ROOMRTC_RESET_SUBSCRIPTION = gql`
  subscription($id: ID!) {
    roomRTCReset(id: $id) {
      id
      username
    }
  }
`;

export const REACTION_SENT_SUBSCRIPTION = gql`
  subscription($id: ID!) {
    reactionSent(id: $id) {
      id
      username
      reaction
      photo
    }
  }
`;

export const GET_ROOM_QUERY = gql`
  query($id: ID!) {
    queryRoom(id: $id) {
      vidTime
      url
      playing
      users
      userCount
    }
  }
`;

export const GET_CANDIDATE_QUERY = gql`
  query($id: ID!) {
    queryCandidate(id: $id)
  }
`;

export const GET_ANSWER_QUERY = gql`
  query($id: ID!) {
    queryAnswer(id: $id)
  }
`;

export const GET_OFFER_QUERY = gql`
  query($id: ID!) {
    queryOffer(id: $id)
  }
`;

export const PAUSE_VIDEO_MUTATION = gql`
  mutation($id: ID!, $username: String!) {
    pauseVideo(id: $id, username: $username)
  }
`;

export const PLAY_VIDEO_MUTATION = gql`
  mutation($id: ID!, $username: String!) {
    playVideo(id: $id, username: $username)
  }
`;

export const SET_TIME_MUTATION = gql`
  mutation($id: ID!, $vidTime: Float!, $username: String!) {
    seekVideo(id: $id, vidTime: $vidTime, username: $username)
  }
`;

export const SET_URL_MUTATION = gql`
  mutation($id: ID!, $url: String!, $username: String!) {
    setUrlVideo(id: $id, url: $url, username: $username)
  }
`;

export const SET_VOLUME_MUTATION = gql`
  mutation($id: ID!, $volume: Float!, $username: String!) {
    setVolumeVideo(id: $id, volume: $volume, username: $username)
  }
`;

export const SYNC_VIDEO_MUTATION = gql`
  mutation($id: ID!, $url: String!, $vidTime: Float!, $username: String!) {
    syncVideo(id: $id, url: $url, vidTime: $vidTime, username: $username)
  }
`;

export const CREATE_ROOM_MUTATION = gql`
  mutation($username: String!) {
    createRoom(username: $username) {
      id
      url
      users
    }
  }
`;

export const JOIN_ROOM_MUTATION = gql`
  mutation($id: ID!, $username: String!) {
    joinRoom(id: $id, username: $username)
  }
`;

export const LEAVE_ROOM_MUTATION = gql`
  mutation($id: ID!, $username: String!) {
    leaveRoom(id: $id, username: $username)
  }
`;

export const CANDIDATE_MUTATION = gql`
  mutation($id: ID!, $username: String!, $candidate: String!) {
    setCandidate(id: $id, username: $username, candidate: $candidate)
  }
`;

export const ANSWER_MUTATION = gql`
  mutation($id: ID!, $username: String!, $answer: String!) {
    setAnswer(id: $id, username: $username, answer: $answer)
  }
`;

export const OFFER_MUTATION = gql`
  mutation($id: ID!, $username: String!, $offer: String!) {
    setOffer(id: $id, username: $username, offer: $offer)
  }
`;

export const RESET_ROOMRTC_MUTATION = gql`
  mutation($id: ID!, $username: String!) {
    resetRoomRTC(id: $id, username: $username)
  }
`;

export const SEND_REACTION_MUTATION = gql`
  mutation($id: ID!, $username: String!, $reaction: String!, $photo: String!) {
    sendReaction(
      id: $id
      username: $username
      reaction: $reaction
      photo: $photo
    )
  }
`;
