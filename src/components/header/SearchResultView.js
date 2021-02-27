import React from "react";
import { Box, CircularProgress, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CallMade } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

import { searchOptionToRoutesMapping } from "../../static-data/data";
import { course_types } from "../../static-data/course-constants";

// TODO: implement lazy loading via scroll

const useStyles = makeStyles((theme) => ({
  root: {
    boxSizing: "border-box",
    padding: theme.spacing(2),
    borderRadius: "5px",
    width: "450px",
    height: "auto",
    maxHeight: "300px",
    backgroundColor: theme.palette.primary.background,
    boxShadow: "3px 4px 14px 0 rgba(0, 0, 0, 0.09)",
    position: "absolute",
    top: "100%",
    zIndex: "101",
    overflowY: "scroll",
  },
  loader: {},
  noDataMsg: {
    textAlign: "center",
    color: theme.palette.custom.contrastText,
  },
  searchOptionsList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    margin: 0,
    listStyle: "none",
    width: "100%",
  },
  searchOptionsListItem: {
    borderBottom: "1px solid #e7e8ea",
    width: "100%",

    "&:last-of-type": {
      borderBottom: "1px solid transparent",
    },
  },
  optionBtn: {
    display: "flex",
    justifyContent: "space-between",
    textTransform: "capitalize",
  },
  btnTextContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    textAlign: "left",
  },
  optionTitle: {
    color: theme.palette.primary.text,
    fontSize: "15px",
    fontWeight: 600,
  },
  optionType: {
    color: theme.palette.primary.text,
    fontSize: "13px",
  },
}));

function SearchResultView({
  isOpen = false,
  options = [],
  isLoading = false,
  callback,
}) {
  const history = useHistory();
  const classes = useStyles();

  if (isOpen === false) {
    return null;
  }

  const getRouteFromOption = (option) => {
    if (option.type === searchOptionToRoutesMapping.course_type) {
      return `${searchOptionToRoutesMapping[option.type]}/${
        course_types[option.course_type]
      }/${option.id}`;
    }

    if (option.type === searchOptionToRoutesMapping.skill_type) {
      return `/skill/${option.id}`;
    }

    if (option.type === searchOptionToRoutesMapping.category_type) {
      return `/explore/${option.id}`;
    }

    if (option.type === searchOptionToRoutesMapping.instructor_type) {
      return `/instructor/${option.id}`;
    }
  };

  const handleOptionClick = (option) => {
    const url = getRouteFromOption(option);
    history.push(url, {
      name: option.name,
    });
    callback();
  };

  return (
    <Box className={classes.root}>
      {isLoading === true ? (
        <Box w={1} display="flex" justifyContent="center">
          <CircularProgress size={20} className={classes.loader} />
        </Box>
      ) : isLoading === false && options.length === 0 ? (
        <Typography className={classes.noDataMsg}>
          Nothing to show here
        </Typography>
      ) : (
        <ul className={classes.searchOptionsList}>
          {options.map((item) => (
            <li key={item.id} className={classes.searchOptionsListItem}>
              <Button
                fullWidth
                className={classes.optionBtn}
                onClick={() => handleOptionClick(item)}
              >
                <Box component="span" className={classes.btnTextContainer}>
                  <Typography component="span" className={classes.optionTitle}>
                    {item.title || ""}
                  </Typography>
                  <Typography component="span" className={classes.optionType}>
                    {`In ${item.type}` || ""}
                  </Typography>
                </Box>
                <CallMade fontSize="small" style={{ fill: "#2c516c" }} />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Box>
  );
}

export default SearchResultView;
