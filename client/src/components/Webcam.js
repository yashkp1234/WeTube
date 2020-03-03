import React, { useRef, useState, useEffect } from "react";
import { Grid, Button, Header, Icon } from "semantic-ui-react";
import { useMutation, useLazyQuery, useSubscription } from "react-apollo";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

import {
  CANDIDATE_MUTATION,
  GET_OFFER_QUERY,
  OFFER_MUTATION,
  ANSWER_MUTATION,
  SEND_REACTION_MUTATION,
  RESET_ROOMRTC_MUTATION,
  OFFER_SET_SUBSCRIPTION,
  ANSWER_SET_SUBSCRIPTION,
  CANDIDATE_SET_SUBSCRIPTION,
  REACTION_SENT_SUBSCRIPTION
} from "../util/graphql";
import {
  reactionNotification,
  webcamNotification
} from "../util/Notifications";

const configuration = {
  iceServers: [{ urls: "stun:stun4.l.google.com:19302" }]
};

const videoConstraints = {
  facingMode: "user"
};

function Camera({ id, username }) {
  const videoRef = useRef();
  const videosRef = useRef();
  const rtcPeer = useRef();
  const [muted, setMuted] = useState(true);
  const [mutedIn, setMutedIn] = useState(true);
  const offer = useRef(false);
  const [yourReactions, setYourReactions] = useState(false);
  const [setCandidate] = useMutation(CANDIDATE_MUTATION);
  const [setOfferAll] = useMutation(OFFER_MUTATION);
  const [resetRoomRTC] = useMutation(RESET_ROOMRTC_MUTATION);
  const [setAnswer] = useMutation(ANSWER_MUTATION);
  const [sendReaction] = useMutation(SEND_REACTION_MUTATION);

  const [offerQuery] = useLazyQuery(GET_OFFER_QUERY, {
    variables: { id },
    fetchPolicy: "network-only",
    onCompleted: data => {
      offer.current = data.queryOffer;
      if (offer.current && offer.current !== "") {
        handleOffer(offer.current);
      } else {
        handleOfferCreation();
      }
    },
    onError: e => {
      console.log(e);
    }
  });

  const capture = async () => {
    const video = document.querySelector(".my_cam_vid");
    if (video) {
      const model = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceExpressions();
      if (model && videoRef.current) {
        const obj = model.expressions;
        const expression_detected = Object.keys(obj).reduce((a, b) =>
          obj[a] > obj[b] ? a : b
        );
        if (
          expression_detected !== "neutral" &&
          obj[expression_detected] > 0.7
        ) {
          sendReaction({
            variables: {
              id,
              username,
              reaction: expression_detected,
              photo: videoRef.current.getScreenshot()
            }
          });
        }
      }
    }
  };

  async function handleOfferCreation() {
    const offers = await rtcPeer.current.createOffer();
    const offerString = JSON.stringify(offers.toJSON());
    await rtcPeer.current.setLocalDescription(offers);
    setOfferAll({ variables: { id, username, offer: offerString } });
  }

  async function handleOffer(offerString) {
    await rtcPeer.current.setRemoteDescription(JSON.parse(offerString));
    const answer = await rtcPeer.current.createAnswer();
    await rtcPeer.current.setLocalDescription(answer);
    const answerString = JSON.stringify(answer.toJSON());
    setAnswer({ variables: { id, username, answer: answerString } });
  }

  useSubscription(OFFER_SET_SUBSCRIPTION, {
    variables: { id, username },
    onSubscriptionData: e => {
      const receivedOffer = e.subscriptionData.data.offerSet.offer;
      offer.current = receivedOffer;
      if (offer.current && offer.current !== "") {
        handleOffer(offer.current);
      }
    }
  });

  useSubscription(REACTION_SENT_SUBSCRIPTION, {
    variables: { id },
    onSubscriptionData: e => {
      const { reaction, photo } = e.subscriptionData.data.reactionSent;
      const subUsername = e.subscriptionData.data.reactionSent.username;
      if (
        (subUsername === username && yourReactions) ||
        subUsername !== username
      ) {
        reactionNotification(subUsername, reaction, photo);
      }
    }
  });

  useSubscription(CANDIDATE_SET_SUBSCRIPTION, {
    variables: { id, username },
    onSubscriptionData: e => {
      const receivedCandidate = e.subscriptionData.data.candidateSet.candidate;
      rtcPeer.current.addIceCandidate(JSON.parse(receivedCandidate));
    }
  });

  useSubscription(ANSWER_SET_SUBSCRIPTION, {
    variables: { id, username },
    onSubscriptionData: e => {
      rtcPeer.current.setRemoteDescription(
        JSON.parse(e.subscriptionData.data.answerSet.answer)
      );
      resetRoomRTC({ variables: { id, username } });
    }
  });

  useEffect(() => {
    const rtc = rtcPeer.current;
    return () => {
      if (rtc) {
        rtc.close();
      }
    };
  }, []);

  return (
    <div>
      <Grid className="addMarginTop">
        <Grid.Column width={10} style={{ margin: "auto" }}>
          <Header
            textAlign="center"
            inverted
            style={{ color: "white! important" }}
          >
            Their Cam
          </Header>
          <video
            height={"40%"}
            width={"100%"}
            ref={videosRef}
            className={".thevid"}
            autoPlay
            playsInline
            muted={mutedIn}
          ></video>
          {!mutedIn ? (
            <Button
              color="black"
              onClick={() => {
                setMutedIn(true);
              }}
            >
              <Icon name="microphone icon"></Icon>
            </Button>
          ) : (
            <Button color="black" onClick={() => setMutedIn(false)}>
              <Icon name="microphone slash"></Icon>
            </Button>
          )}
          <Header
            inverted
            textAlign="center"
            style={{ color: "white! important" }}
          >
            Your Cam
          </Header>
          <Webcam
            autoPlay={true}
            playsInline={true}
            audio={true}
            className={"my_cam_vid"}
            height={"40%"}
            width={"100%"}
            style={{ margin: "auto" }}
            ref={videoRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            muted={muted}
            onUserMedia={() => {
              try {
              rtcPeer.current = new RTCPeerConnection(configuration);
              rtcPeer.current.ontrack = e => {
                videosRef.current.srcObject = e.streams[0];
              };
              rtcPeer.current.onicecandidate = e => {
                if (e && e.candidate != null) {
                  const candidate = JSON.stringify(e.candidate.toJSON());
                  setCandidate({
                    variables: { id, username, candidate },
                    onError: error => console.log(error)
                  });
                }
              };
              rtcPeer.current.onconnectionstatechange = e => {
                if (e.srcElement.connectionState === "failed") {
                  resetRoomRTC({ variables: { id, username } });
                  handleOfferCreation();
                } else if (e.srcElement.connectionState === "connecting") {
                  webcamNotification();
                }
              };
              rtcPeer.current.onnegotiationneeded = e => {
                offerQuery();
              };
              const stream = videoRef.current.stream;
              for (const track of stream.getTracks()) {
                rtcPeer.current.addTrack(track, stream);
              }
            }
            catch (err) {
              console.log(err)
            }
            finally {
              setInterval(capture, 7000);
            }
            }}
          />
          {!muted ? (
            <Button
              color="black"
              onClick={() => {
                setMuted(true);
              }}
            >
              <Icon name="microphone icon"></Icon>
            </Button>
          ) : (
            <Button color="black" onClick={() => setMuted(false)}>
              <Icon name="microphone slash"></Icon>
            </Button>
          )}
          {!yourReactions ? (
            <Button
              color="black"
              onClick={() => {
                setYourReactions(true);
              }}
            >
              See Your Reactions
            </Button>
          ) : (
            <Button color="black" onClick={() => setYourReactions(false)}>
              Dont See Your Reactions
            </Button>
          )}
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default Camera;
