import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "semantic-ui-react";
import Slider from "@material-ui/core/Slider";
import VolumeUp from "@material-ui/icons/VolumeUp";

const useStyles = makeStyles({
  root: {}
});

export default function InputSlider({ id, setVol, username }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0.5);

  const handleSliderChange = (_, newValue) => {
    setValue(newValue);
    setVol({ variables: { id, volume: newValue, username } });
  };

  return (
    <div className={classes.root}>
      <div className="removePadding">
        <Grid>
          <Grid.Row>
            <Grid.Column width={3} style={{ paddingRight: "0!important" }}>
              <VolumeUp style={{ color: "white" }} />
            </Grid.Column>
            <Grid.Column width={12}>
              <Slider
                value={typeof value === "number" ? value : 0}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
                className="whiteFont"
                max={1}
                min={0}
                step={0.1}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
}
