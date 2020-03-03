import { store } from "react-notifications-component";
import React from "react";
import { Card, Image, Segment } from "semantic-ui-react";

const CardExampleCard = (photo, username, reaction) => (
  <Segment inverted>
    <Card style={{ height: "20vh!important", width: "20vw!important" }}>
      <Image
        style={{ height: "10%!important", width: "10%!important" }}
        src={photo}
        wrapped
        ui={false}
      />
      <Card.Content style={{ color: "white" }}>
        <Card.Header style={{ color: "white" }}>{username}</Card.Header>
        <Card.Description style={{ color: "white" }}>
          {"Reaction: " + reaction}
        </Card.Description>
      </Card.Content>
    </Card>
  </Segment>
);

export const loginErrorNotification = () => {
  store.addNotification({
    title: "Login Error",
    message: "Please login before you create a room.",
    type: "info",
    insert: "top",
    container: "bottom-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 3000,
      onScreen: true
    }
  });
};

export const videoPausedNotification = user => {
  store.addNotification({
    title: "Video Paused",
    message: user + " has paused the video for everyone",
    type: "info",
    insert: "top",
    container: "bottom-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 2000,
      onScreen: true
    }
  });
};

export const videoPlayedNotification = user => {
  store.addNotification({
    title: "Video Played",
    message: user + " has played the video for everyone",
    type: "info",
    insert: "top",
    container: "bottom-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 2000,
      onScreen: true
    }
  });
};

export const videoChangedNotification = user => {
  store.addNotification({
    title: "Video Changed",
    message: user + " has changed the video for everyone",
    type: "info",
    insert: "top",
    container: "bottom-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 2000,
      onScreen: true
    }
  });
};

export const videoSeekedNotification = user => {
  store.addNotification({
    title: "Video Forwarded/Rewinded",
    message: user + " has forwarded/rewinded the video for everyone.",
    type: "info",
    insert: "top",
    container: "bottom-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 2000,
      onScreen: true
    }
  });
};

export const videoSyncedNotification = user => {
  store.addNotification({
    title: "Video Synced",
    message: user + " has synced everyones videos to his/hers.",
    type: "info",
    insert: "top",
    container: "bottom-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 2000,
      onScreen: true
    }
  });
};

export const webcamNotification = () => {
  store.addNotification({
    title: "Partners Webcam",
    message:
      "Trying to connect to someones webcam, if this does not work refresh the page.",
    type: "info",
    insert: "top",
    container: "bottom-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 2000,
      onScreen: true
    }
  });
};

export const reactionNotification = (username, reaction, photo, bottom) => {
  store.addNotification({
    title: username + " Reaction",
    message: reaction,
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    content: CardExampleCard(photo, username, reaction),
    container: bottom ? "bottom-right" : "top-right",
    dismiss: {
      duration: 5000,
      onScreen: false
    }
  });
};
