import React from "react";
import { Container, Box } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(10),
  },
  loadingContainer: {
    // maxWidth: "60%",
  },
}));

export const CourseDetailsLoader = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" classes={{ root: classes.container }}>
      <Box className={classes.loadingContainer}>
        <Skeleton variant="rect" width="100%" height={200} />
        <br />
        <br />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <br />
        <br />
        <Box display="flex" justifyContent="space-between">
          <Skeleton variant="rect" width="60%" height={300} />
          <Skeleton variant="rect" width="35%" height={150} />
        </Box>
      </Box>
    </Container>
  );
};
