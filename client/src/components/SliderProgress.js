import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import { Mutation } from "react-apollo";

import { SET_TIME_MUTATION } from "../util/graphql";
import { Segment } from "semantic-ui-react";

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  input: {
    width: 42
  }
});

function InputSlider({ time, id, duration, username }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    setValue((time / duration) * 100);
  }, [time, duration]);

  const handleSliderChange = newValue => {
    setValue(newValue);
  };

  return (
    <Mutation mutation={SET_TIME_MUTATION}>
      {setTimeMutation => {
        return (
          <Segment inverted>
            <div className={classes.root} style={{ padding: "1em" }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs>
                  <Slider
                    value={typeof value === "number" ? value : 0}
                    onChange={(e, newValue) =>
                      handleSliderChange(
                        newValue,
                        setTimeMutation({
                          variables: {
                            id,
                            vidTime: (newValue / 100) * duration,
                            username
                          }
                        })
                      )
                    }
                    aria-labelledby="input-slider"
                    className="whiteFont"
                  />
                </Grid>
              </Grid>
            </div>
          </Segment>
        );
      }}
    </Mutation>
  );
}

export default InputSlider;
