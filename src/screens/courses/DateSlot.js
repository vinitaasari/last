import React from "react";
import { Box, Typography, Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  slotContainer: {
    borderBottom: "1px solid #E7E7EA",
    paddingBottom: theme.spacing(2),
  },
  slotCourseName: {
    color: "#6E6C6C",
    fontSize: "12px",
    fontWeight: 400,
  },
  slotDate: {
    color: "#1C1A1A",
    fontSize: "14px",
    fontWeight: 500,
  },
  slotTime: {
    color: "#1C1A1A",
    fontSize: "12px",
    fontWeight: 400,
  },
  selectBtn: (props) => ({
    minWidth: "120px",
    backgroundColor: props.isSelected
      ? "rgb(96,196,36)"
      : theme.palette.secondary.main,

    "&:hover": {
      backgroundColor: props.isSelected
        ? "rgb(96,196,36)"
        : theme.palette.secondary.main,
    },
  }),
}));

const DateSlot = ({
  date_str = "",
  time_str = "",
  title = "",
  id,
  onSelectClick,
  isSelected,
  isLoading,
}) => {
  const classes = useStyles({ isSelected });

  const handleClick = () => {
    onSelectClick(id);
  };

  return (
    <Box
      mt={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      className={classes.slotContainer}
    >
      <Box>
        <Typography classes={{ root: classes.slotCourseName }}>
          {title}
        </Typography>
        <Typography classes={{ root: classes.slotDate }}>{date_str}</Typography>
        <Typography classes={{ root: classes.slotTime }}>{time_str}</Typography>
      </Box>
      <Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClick}
          className={classes.selectBtn}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={20} />
          ) : isSelected && !isLoading ? (
            "Selected"
          ) : (
            "Choose"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default DateSlot;
