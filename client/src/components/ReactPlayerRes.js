import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";
import ReactPlayer from "react-player";
import { Segment } from "semantic-ui-react";

import SliderP from "./SliderProgress";

const ReactPlayerRes = forwardRef(({ id, user, setIsSet }, ref) => {
  const [playing, setPlaying] = useState(false);
  const [url, setUrl] = useState(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const player = useRef(null);
  const timeRefs = useRef(null);

  const getInfoRef = () => {
    return { vidTime: timeRefs.current, url };
  };

  const setVolumeRef = volume => {
    setVolume(volume);
  };

  const setPlayingRef = isPlaying => {
    setPlaying(isPlaying);
  };

  const setUrlRef = url => {
    setUrl(url);
  };

  const setTimeRef = times => {
    setTime(times);
    player.current.seekTo(times, "seconds");
  };

  useImperativeHandle(ref, () => {
    return {
      setPlayingRef: setPlayingRef,
      setUrlRef: setUrlRef,
      setTimeRef: setTimeRef,
      setVolumeRef: setVolumeRef,
      getInfoRef: getInfoRef
    };
  });

  return (
    <>
      <Segment basic className="seggy">
        <div className="player-wrapper">
          <ReactPlayer
            className="react-player"
            width={"100%"}
            height={"100%"}
            playing={playing}
            url={url}
            ref={e => {
              player.current = e;
              setIsSet(player);
            }}
            controls={true}
            volume={volume}
            onPause={() => {
              setPlaying(false);
            }}
            onPlay={() => {
              setPlaying(true);
            }}
            onDuration={e => {
              setDuration(e);
            }}
            onProgress={e => {
              if (e.playedSeconds) {
                timeRefs.current = e.playedSeconds;
                setTime(e.playedSeconds);
              }
            }}
          />
        </div>
        <SliderP
          time={time}
          duration={duration}
          id={id}
          username={user.username}
        ></SliderP>
      </Segment>
    </>
  );
});

export default ReactPlayerRes;
