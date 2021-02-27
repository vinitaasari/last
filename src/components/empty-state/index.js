import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  text: {
    marginTop: theme.spacing(1),
    color: "#4e4e4e",
    fontSize: "18px",
    fontWeight: 500,
  },
}));

const EmptyState = ({ image, text }) => {
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <img src={image} alt={text} />
      <Typography className={classes.text}>{text}</Typography>
    </Box>
  );
};

export default EmptyState;
