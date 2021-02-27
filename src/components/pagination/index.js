import React, { useState } from "react";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paginationRoot: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const CustomPagination = (props) => {
  const classes = useStyles();
  const { page, totalPages, onPageChange } = props;

  const handlePageChange = (event, newPage) => {
    event.preventDefault();
    onPageChange(newPage);
  };

  return (
    <div className={classes.paginationRoot}>
      <Pagination
        page={page}
        onChange={handlePageChange}
        count={totalPages}
        shape="rounded"
      />
    </div>
  );
};

export default CustomPagination;
