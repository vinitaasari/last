import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "react-switch";

const useNotificationStyles = makeStyles((theme) => ({
  heading: {
    color: "#334856",
    fontSize: "16px",
    fontWeight: 500,
  },
  notificationContainer: {
    width: "100%",
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  notificationLabel: {
    color: "#334856",
    fontSize: "15px",
    fontWeight: 400,
  },
}));

const SingleNotification = ({
  id,
  label,
  checked,
  handleSwitchChange,
  disabled,
  noBorder,
}) => {
  const classes = useNotificationStyles();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={3}
      className={classes.notificationContainer}
      style={{ borderBottom: noBorder ? undefined : "1px solid #E5E2E2" }}
    >
      <Typography variant="body1" classes={{ root: classes.notificationLabel }}>
        {label}
      </Typography>
      <Switch
        id={id}
        onChange={handleSwitchChange}
        checked={checked}
        checkedIcon={false}
        uncheckedIcon={false}
        height={22}
        disabled={disabled}
        width={44}
      />
    </Box>
  );
};

export default SingleNotification;
