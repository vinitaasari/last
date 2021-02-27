import React from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const Loader = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress color="primary" size={48} />
    </Box>
  );
};

export const MyLearnings = () => {
  return (
    <Box fullWidth display="flex" justifyContent="space-between">
      <Skeleton
        variant="rect"
        width="35%"
        height={150}
        style={{ marginRight: "1rem" }}
      />
      <Skeleton
        variant="rect"
        width="35%"
        height={150}
        style={{ marginRight: "1rem" }}
      />
      <Skeleton
        variant="rect"
        width="35%"
        height={150}
        style={{ marginRight: "1rem" }}
      />
      <Skeleton
        variant="rect"
        width="35%"
        height={150}
        style={{ marginRight: "1rem" }}
      />
    </Box>
  );
};

export default Loader;
