import React from "react";
import { Box, Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Forum } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  categoryCard: {
    height: 180,
    display: "flex",
    alignItems: "center",
  },
  categoryIconContainer: {
    height: "64px",
    width: "64px",
    backgroundColor: "#F0F0F0",
    display: "inline-block",
    borderRadius: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    color: "#05589C",
    fontSize: "18px",
    fontWeight: 600,
  },
  categorySkills: {
    color: "#52534F",
    fontSize: "16px",
    fontWeight: 400,
  },
}));

const CategoryCard = ({ category }) => {
  const classes = useStyles();

  return (
    <Box pr={2} flex={1}>
      <Card classes={{ root: classes.categoryCard }}>
        <CardContent>
          {category.image_url ? (
            <Box mb={1.5}>
              <img
                src={category.image_url}
                style={{ height: "28px", width: "28px" }}
              />
            </Box>
          ) : (
            <Box mb={1.5} className={classes.categoryIconContainer}>
              <Forum style={{ fontSize: "28px", color: "#05589C" }} />
            </Box>
          )}
          <Typography classes={{ root: classes.categoryName }}>
            {category.name}
          </Typography>
          <Typography classes={{ root: classes.categorySkills }}>
            {category.skill_count} Skills
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CategoryCard;
