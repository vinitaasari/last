import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import CommentIcon from "@material-ui/icons/Comment";

const useStyles = makeStyles((theme) => ({
  container: {},
}));

function ReviewCard({ title = "How would you rate the content ?", onSubmit }) {
  const [value, setValue] = useState(3);

  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Typography>{title}</Typography>
      <Rating
        name="course-rating"
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
      />
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CommentIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button variant="contained" onClick={onSubmit}>
        Next
      </Button>
    </Box>
  );
}

export default ReviewCard;
