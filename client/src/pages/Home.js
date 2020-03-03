import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Grid,
  Container,
  Header,
  Button,
  Responsive,
  Segment,
  Card,
  Divider
} from "semantic-ui-react";
import { Mutation } from "react-apollo";

import { AuthContext } from "../context/auth";
import { loginErrorNotification } from "../util/Notifications";
import { CREATE_ROOM_MUTATION } from "../util/graphql";
import InputRoom from "../components/InputRoom";

function Home() {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState("asas");
  const history = useHistory();
  localStorage.setItem("skip", false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const cardCreate = () => {
    return (
      <Card
        fluid
        inverted="true"
        className="card"
        style={{ width: "30%", margin: "auto" }}
      >
        <Card.Content>
          <Card.Header className="card_description_header">
            Create Room
          </Card.Header>
          <Card.Description className="card_description"></Card.Description>
          <Mutation
            mutation={CREATE_ROOM_MUTATION}
            variables={{ username: username }}
            onCompleted={({ createRoom }) => {
              const pathRed = "/room/" + createRoom.id;
              history.push(pathRed);
            }}
            onError={e => console.log(e)}
          >
            {createRoom => (
              <Button
                primary
                onClick={() => {
                  user ? createRoom() : loginErrorNotification();
                }}
              >
                Create
              </Button>
            )}
          </Mutation>
        </Card.Content>
      </Card>
    );
  };

  const cardJoin = () => {
    return (
      <Card fluid inverted="true" style={{ width: "30%", margin: "auto" }}>
        <Card.Content>
          <Card.Header className="card_description_header">
            Join Room
          </Card.Header>
          <Card.Description className="card_description"></Card.Description>
          <InputRoom username={username}></InputRoom>
        </Card.Content>
      </Card>
    );
  };

  const homePage = () => (
    <div style={{ width: "80%", margin: "auto" }}>
      <Container text>
        <Header
          as="h1"
          inverted
          content="We Tube"
          style={{
            fontSize: "4em",
            fontWeight: "normal",
            marginBottom: 0,
            marginTop: "0.5em"
          }}
        />
        <Header
          as="h2"
          inverted
          content="Experience Videos Like Never Before"
          style={{
            fontSize: "1.7em",
            fontWeight: "normal",
            marginTop: "1.5em"
          }}
        />
        <Divider></Divider>
      </Container>
      <Grid columns={2} fluid="true" style={{ marginTop: "5%" }}>
        <Grid.Row>
          {cardCreate()}
          {cardJoin()}
        </Grid.Row>
      </Grid>
    </div>
  );

  return (
    <>
      <Responsive fluid="true">
        <Segment
          basic
          textAlign="center"
          className="test"
          vertical
          style={{ marginTop: "2%", width: "100%", opacity: "0.95" }}
        >
          {homePage()}
        </Segment>
      </Responsive>
    </>
  );
}

export default Home;
