import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.contrastText,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImg: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(4),
  },
  mainText: {
    marginTop: theme.spacing(2),
    color: "#494b47",
    fontSize: "20px",
    fontWeight: 600,
    textAlign: "center",
  },
  subText: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    color: "#494b47",
    fontSize: "16px",
    fontWeight: 400,
    textAlign: "center",
  },
  cardBtn: {
    minWidth: "120px",
    boxShadow: "none",
  },
}));

function FeedbackCard({
  imgSrc,
  cardText = "",
  cardSubText = "",
  btnText = "",
  onClick = () => {},
}) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        {imgSrc && <img src={imgSrc} alt="card" className={classes.cardImg} />}
        <Typography component="p" variant="h4" className={classes.mainText}>
          {cardText}
        </Typography>
        <Typography component="p" variant="h4" className={classes.subText}>
          {cardSubText}
        </Typography>
        <CardActions>
          <Button
            type="button"
            onClick={onClick}
            className={classes.cardBtn}
            variant="contained"
            color="secondary"
          >
            {btnText}
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}

export default FeedbackCard;
