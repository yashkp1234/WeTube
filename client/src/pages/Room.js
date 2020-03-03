import React, { useState, useContext, useRef, useEffect } from "react";
import { Grid, Segment, Dimmer, Loader } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import {
  useQuery,
  useLazyQuery,
  Subscription,
  useMutation
} from "react-apollo";
import * as faceapi from "face-api.js";

import ReactPlayerRes from "../components/ReactPlayerRes";
import Controls from "../components/Controls";
import { AuthContext } from "../context/auth";
import Webcams from "../components/Webcam";
import {
  GET_ROOM_QUERY,
  VIDEO_PAUSED_SUBSCRIPTION,
  VIDEO_PLAYED_SUBSCRIPTION,
  SET_TIME_SUBSCRIPTION,
  SET_URL_SUBSCRIPTION,
  SET_VOLUME_SUBSCRIPTION,
  VIDEO_SYNCED_SUBSCRIPTION,
  SYNC_VIDEO_MUTATION,
  LEAVE_ROOM_MUTATION
} from "../util/graphql";
import {
  videoChangedNotification,
  videoPausedNotification,
  videoPlayedNotification,
  videoSeekedNotification,
  videoSyncedNotification
} from "../util/Notifications";

function Room(props) {
  const history = useHistory();
  let { user } = useContext(AuthContext);
  const [isSet, setIsSet] = useState(null);
  const loading = useRef(false);
  const ref = useRef(null);
  const players = useRef(null);
  const userCounts = useRef(0);
  const id = props.match.params.id;
  const [leaveRoom] = useMutation(LEAVE_ROOM_MUTATION);
  const [syncVideo] = useMutation(SYNC_VIDEO_MUTATION);
  const [getInfo] = useLazyQuery(GET_ROOM_QUERY, {
    variables: { id },
    fetchPolicy: "network-only",
    onCompleted: data => {
      if (data && ref) {
        const { vidTime, playing } = data.queryRoom;
        ref.current.setPlayingRef(playing);
        ref.current.setTimeRef(vidTime);
      }
    },
    onError: e => {
      console.log(e);
    }
  });

  if (!user) {
    user = ".";
  }

  const getInfoRef = () => {
    return ref.current.getInfoRef();
  };

  useQuery(GET_ROOM_QUERY, {
    variables: { id },
    fetchPolicy: "network-only",
    onCompleted: data => {
      const { vidTime, playing, url, users, userCount } = data.queryRoom;
      userCounts.current = userCount;
      if (!users.includes(user.username)) {
        //history.push("/");
      }
      if (data && ref) {
        ref.current.setUrlRef(url);
        ref.current.setPlayingRef(playing);
        if (isSet) {
          ref.current.setTimeRef(vidTime);
        }
      }
    },
    onError: e => {
      console.log(e);
      history.push("/");
    }
  });

  useEffect(() => {
    if (isSet) {
      getInfo();
    }
  }, [isSet, getInfo]);

  useEffect(() => {
    const fetchData = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      loading.current = false;
    };
    loading.current = true;
    fetchData();
    return () => {
      let { url, vidTime } = getInfoRef();
      if (vidTime && user && user.username) {
        let username = user.username;
        syncVideo({ variables: { id, url, vidTime, username } });
        leaveRoom({ variables: { id, username } });
      }
    };
  }, [id, leaveRoom, syncVideo, user]);

  return (
    <div className="room">
      {!loading.current ? (
        <Dimmer active>
          <Loader />
        </Dimmer>
      ) : (
        <div></div>
      )}
      <Segment className="roomSeg">
        <Grid fluid="true" stretched className="gridStyle" divided>
          <Grid.Column width={10}>
            <Grid.Row className="player">
              <ReactPlayerRes
                user={user}
                id={id}
                players={players}
                ref={ref}
                setIsSet={setIsSet}
                isSet={isSet}
              ></ReactPlayerRes>
            </Grid.Row>
            <Subscription
              subscription={VIDEO_PLAYED_SUBSCRIPTION}
              variables={{ id: id }}
            >
              {({ data, error }) => {
                if (error) {
                  console.log(error);
                }
                if (data) {
                  ref.current.setPlayingRef(true);
                  videoPlayedNotification(data.videoPlayed.username);
                }
                return <div></div>;
              }}
            </Subscription>
            <Subscription
              subscription={VIDEO_PAUSED_SUBSCRIPTION}
              variables={{ id: id }}
            >
              {({ data, error }) => {
                if (error) {
                  console.log(error);
                }
                if (data) {
                  ref.current.setPlayingRef(false);
                  videoPausedNotification(data.videoPaused.username);
                }
                return <div></div>;
              }}
            </Subscription>
            <Subscription
              subscription={SET_URL_SUBSCRIPTION}
              variables={{ id: id }}
            >
              {({ data, error }) => {
                if (error) {
                  console.log(error);
                }
                if (data) {
                  ref.current.setUrlRef(data.videoUrlSet.room.url);
                  ref.current.setTimeRef(0);
                  videoChangedNotification(data.videoUrlSet.username);
                }
                return <div></div>;
              }}
            </Subscription>
            <Subscription
              subscription={SET_TIME_SUBSCRIPTION}
              variables={{ id: id }}
            >
              {({ data, error }) => {
                if (error) {
                  console.log(error);
                }
                if (data) {
                  ref.current.setTimeRef(data.videoSeeked.room.vidTime);
                  videoSeekedNotification(data.videoSeeked.username);
                }
                return <div></div>;
              }}
            </Subscription>
            <Subscription
              subscription={SET_VOLUME_SUBSCRIPTION}
              variables={{ id: id, username: user.username }}
            >
              {({ data, error }) => {
                if (error) {
                  console.log(error);
                }
                if (data) {
                  ref.current.setVolumeRef(data.videoVolumeSet.room.volume);
                }
                return <div></div>;
              }}
            </Subscription>
            <Subscription
              subscription={VIDEO_SYNCED_SUBSCRIPTION}
              variables={{ id: id }}
            >
              {({ data, error }) => {
                if (error) {
                  console.log(error);
                }
                if (data) {
                  ref.current.setTimeRef(data.videoSynced.room.vidTime);
                  ref.current.setUrlRef(data.videoSynced.room.url);
                  ref.current.setPlayingRef(true);
                  videoSyncedNotification(data.videoSynced.username);
                }
                return <div></div>;
              }}
            </Subscription>
            <Grid.Row>
              <Controls
                id={id}
                player={players}
                user={user}
                getInfoRef={getInfoRef}
              ></Controls>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={6} style={{ height: "50%" }}>
            <Webcams id={id} username={user.username}></Webcams>
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  );
}

export default Room;
