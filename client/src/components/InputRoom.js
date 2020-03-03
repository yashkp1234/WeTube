import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "react-apollo";
import { Message, Input } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

import { GET_ROOM_QUERY, JOIN_ROOM_MUTATION } from "../util/graphql";

const InputRoom = ({ username }) => {
  const history = useHistory();
  const [id, setId] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [queryRoom] = useLazyQuery(GET_ROOM_QUERY, {
    variables: { id },
    onCompleted: data => {
      handleSubmit(data);
    },
    onError: () => {
      setErrorMsg("Room id: " + id + " does not exist.");
      setId("");
    }
  });
  const [joinRoom, { data, loading }] = useMutation(JOIN_ROOM_MUTATION, {});

  useEffect(() => {
    setTimeout(() => {
      setErrorMsg(false);
    }, 8000);
  }, [errorMsg]);

  if (loading) {
    return <p>Loading</p>;
  }

  if (data) {
    const pathRed = "/room/" + id;
    history.push(pathRed);
  }

  const handleSubmit = data => {
    if (
      data.queryRoom.userCount >= 2 &&
      data.queryRoom.users.indexOf(username) < 0
    ) {
      setErrorMsg("Room is full. It has a capacity of 2 people.");
      return;
    }
    joinRoom({
      variables: { id, username }
    });
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (!username) {
          setErrorMsg("You are not logged in please login.");
          setId("");
        } else {
          queryRoom();
        }
      }}
    >
      <Input
        value={id}
        inverted
        iconPosition="left"
        icon="search"
        placeholder="Enter room id here ..."
        onChange={e => {
          setId(e.target.value);
        }}
      />
      {errorMsg ? (
        <Message warning header="Unable to join room" list={[errorMsg]} />
      ) : (
        <div></div>
      )}
    </form>
  );
};

export default InputRoom;
