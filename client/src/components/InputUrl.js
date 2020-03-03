import React, { useState, useEffect } from "react";
import { Message, Input } from "semantic-ui-react";
import ReactPlayer from "react-player";

const InputUrl = ({ urlMutation, id, user }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setError(false);
      setUrl("");
    }, 2000);
  }, [error]);

  const handleSubmit = () => {
    if (ReactPlayer.canPlay(url)) {
      setError(false);
      urlMutation({
        variables: {
          id,
          url: url,
          username: user.username
        }
      });
      setUrl("");
    } else if (url !== "") {
      setError(true);
    }
  };

  return (
    <form
      style={{ width: 10 }}
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Input
        value={url}
        transparent
        inverted
        iconPosition="left"
        icon="search"
        className="roomInput"
        placeholder="Play a new video for everyone ..."
        onChange={e => {
          setUrl(e.target.value);
        }}
      />
      {error ? (
        <Message
          warning
          header="Invalid URL"
          list={["The url: " + url + " is invalid, please try again!"]}
        />
      ) : (
        <div></div>
      )}
    </form>
  );
};

export default InputUrl;
