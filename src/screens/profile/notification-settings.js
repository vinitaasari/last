import React, { Fragment, useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "react-switch";

const useStyles = makeStyles((theme) => ({
  heading: {
    color: "#334856",
    fontSize: "16px",
    fontWeight: 500,
  },
  notificationContainer: {
    width: "40%",
    paddingBottom: theme.spacing(3),
    borderBottom: "1px solid #E5E2E2",
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
  onHandleColor,
}) => {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={3}
      className={classes.notificationContainer}
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

const NotificationSettings = (props) => {
  const classes = useStyles();
  const [preferences, setPreferences] = useState({
    is_preference_email: true,
    is_preference_sms: true,
    is_preference_push_notification: true,
  });
  const [allPreferred, setAllPreferred] = useState(false);
  const { updateLearnerProfile } = props;

  useEffect(() => {
    setPreferences({ ...props.preferences });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.preferences]);

  const handleSwitchChange = (checked, event, id) => {
    setPreferences((prevValues) => ({
      ...prevValues,
      [id]: checked,
    }));
  };

  useEffect(() => {
    if (allPreferred) {
      let newPreferences = {};
      for (const key in preferences) {
        newPreferences = { ...newPreferences, [key]: true };
      }
      setPreferences(newPreferences);
    }
  }, [allPreferred]);

  useEffect(() => {
    const allTrue =
      Object.keys(preferences).length !== 0 &&
      Object.keys(preferences).every((key) => preferences[key]);
    if (allTrue) {
      setAllPreferred(true);
    } else {
      setAllPreferred(false);
    }
  }, [preferences]);

  return (
    <Fragment>
      <Typography variant="body1" classes={{ root: classes.heading }}>
        Please give Midigiworld permission to contact you about updates and your
        account
      </Typography>
      <Box mt={4}>
        <SingleNotification
          id="is_preference_email"
          label="Email notifications"
          handleSwitchChange={handleSwitchChange}
          checked={true}
          disabled={true}
        />
        <SingleNotification
          id="is_preference_sms"
          label="SMS notifications"
          handleSwitchChange={handleSwitchChange}
          checked={preferences.is_preference_sms}
        />
        <SingleNotification
          id="is_preference_push_notification"
          label="In-App notification"
          handleSwitchChange={handleSwitchChange}
          checked={preferences.is_preference_push_notification}
        />
        <SingleNotification
          id="allPreferred"
          handleSwitchChange={(choice) => {
            if (choice == false) {
              setPreferences({
                is_preference_email: true,
                is_preference_sms: false,
                is_preference_push_notification: false,
              });
            }
            setAllPreferred(choice);
          }}
          label="Agree to all the above"
          checked={allPreferred}
        />
      </Box>
      <Box mt={6}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => updateLearnerProfile(preferences)}
        >
          {
            props.imageApiStatus.isPending ? (
              <CircularProgress size={20} style={{ color: 'white' }} className={classes.loader} />
            ) : ("UPDATE")
          }
        </Button>
      </Box>
    </Fragment>
  );
};

export default NotificationSettings;
