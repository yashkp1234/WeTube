import React from "react";
import { Grid, Button, Icon, Popup, Segment } from "semantic-ui-react";
import { Mutation } from "react-apollo";
import { adopt } from "react-adopt";
import SliderVol from "./SliderVolume";

import InputUrl from "./InputUrl";
import {
  PAUSE_VIDEO_MUTATION,
  PLAY_VIDEO_MUTATION,
  SET_URL_MUTATION,
  SET_VOLUME_MUTATION,
  SYNC_VIDEO_MUTATION
} from "../util/graphql";

function Controls({ id, user, getInfoRef }) {
  const Composed = adopt({
    pauseVideoMutation: ({ render }) => (
      <Mutation mutation={PAUSE_VIDEO_MUTATION}>
        {pauseMutation => render({ pauseMutation })}
      </Mutation>
    ),
    playVideoMutation: ({ render }) => (
      <Mutation mutation={PLAY_VIDEO_MUTATION}>
        {playMutation => render({ playMutation })}
      </Mutation>
    ),
    setUrlVideoMutation: ({ render }) => (
      <Mutation mutation={SET_URL_MUTATION}>
        {urlMutation => render({ urlMutation })}
      </Mutation>
    ),
    setVolumeMutation: ({ render }) => (
      <Mutation mutation={SET_VOLUME_MUTATION}>
        {volMutation => render({ volMutation })}
      </Mutation>
    ),
    syncVideoMutation: ({ render }) => (
      <Mutation mutation={SYNC_VIDEO_MUTATION}>
        {syncVideoMutation => render({ syncVideoMutation })}
      </Mutation>
    )
  });

  return (
    <Composed>
      {({
        pauseVideoMutation: { pauseMutation },
        playVideoMutation: { playMutation },
        setUrlVideoMutation: { urlMutation },
        setVolumeMutation: { volMutation },
        syncVideoMutation: { syncVideoMutation }
      }) => {
        return (
          <Segment inverted className="controlSeg">
            <Grid fluid="true" columns="equal" className="separate">
              <Grid.Column className="controlCol">
                <Grid.Row>
                  <Popup
                    content="Play Video For All Users"
                    trigger={
                      <Button
                        color="black"
                        icon
                        onClick={() => {
                          playMutation({
                            variables: { id, username: user.username }
                          });
                        }}
                      >
                        <Icon name="play" />
                      </Button>
                    }
                  ></Popup>
                  <Popup
                    content="Pause Video For All Users"
                    trigger={
                      <Button
                        color="black"
                        icon
                        onClick={() => {
                          pauseMutation({
                            variables: { id, username: user.username }
                          });
                        }}
                      >
                        <Icon name="pause" />
                      </Button>
                    }
                  ></Popup>
                  <Popup
                    content="Sync and Play Video For All Users"
                    trigger={
                      <Button
                        color="black"
                        icon
                        onClick={() => {
                          const info = getInfoRef();
                          syncVideoMutation({
                            variables: {
                              id,
                              url: info.url,
                              vidTime: info.vidTime,
                              username: user.username
                            }
                          });
                        }}
                      >
                        <Icon name="sync alternate" />
                      </Button>
                    }
                  ></Popup>
                  <Segment inverted className="volumeSegement">
                    <SliderVol
                      id={id}
                      setVol={volMutation}
                      username={user.username}
                    ></SliderVol>
                  </Segment>
                  <InputUrl
                    urlMutation={urlMutation}
                    id={id}
                    user={user}
                  ></InputUrl>
                </Grid.Row>
              </Grid.Column>
            </Grid>
          </Segment>
        );
      }}
    </Composed>
  );
}

export default Controls;
