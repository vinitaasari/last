import React from "react";
import { useHistory } from "react-router-dom";
import { Box, Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Pluralize from "react-pluralize";

const useStyles = makeStyles((theme) => ({
  categoryCard: {
    height: 180,
    marginBottom: theme.spacing(1.5),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  categoryIconContainer: {
    height: "64px",
    width: "64px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  categoryIcon: {
    height: "100%",
    width: "100%",
  },
  categoryName: {
    color: "#05589C",
    fontSize: "18px",
    fontWeight: 600,
    textAlign: "center",
  },
  categorySkills: {
    color: "#52534F",
    fontSize: "16px",
    fontWeight: 400,
    textAlign: "center",
  },
}));

const CategoryCard = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const viewCategory = (categoryId, name) => {
    history.push(`/explore/${categoryId}`, { name: name });
  };

  return (
    <Card
      classes={{ root: classes.categoryCard }}
      onClick={() => viewCategory(props.id, props.name)}
    >
      <CardContent>
        <Box mb={1.5} className={classes.categoryIconContainer}>
          <img
            src={props.imgUrl}
            alt={props.name}
            className={classes.categoryIcon}
          />
        </Box>
        <Typography classes={{ root: classes.categoryName }}>
          {props.name}
        </Typography>
        <Typography classes={{ root: classes.categorySkills }}>
          <Pluralize singular={"skill"} count={props.count} />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
