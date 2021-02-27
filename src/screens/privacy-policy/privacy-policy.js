import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";

import { useSnackbar } from "notistack";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import Loader from "../../components/loader";
import AppWrapper from "../../components/app-wrapper";
import { format } from "date-fns";
import { useAuth } from "../../contexts/auth-context";
import { useUser } from "../../contexts/user-context";
import SEO from "../../components/seo";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  heading: {
    color: theme.palette.custom.title,
    fontSize: "34px",
    fontWeight: 600,
  },
  subHeading: {
    color: theme.palette.custom.title,
    fontSize: "17px",
    fontWeight: 400,
  },
  paragraph: {
    color: "#676767",
    fontSize: "16px",
    fontWeight: 400,
    marginBottom: 0,
  },
}));

const PrivacyPolicy = (props) => {
  const classes = useStyles();
  const { logout } = useAuth();
  const { setNoti } = useUser();
  const [privacyPolicy, setPrivacyPolicy] = useState({});
  const cmsApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();

  const _getCMSPages = async () => {
    try {
      const res = await cmsApiStatus.run(
        apiClient("POST", "cms", "getcmspages", {
          body: {},
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      const {
        content: { data },
      } = res;

      setPrivacyPolicy(data.privacy_policy_learner);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      console.log("error", error);
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  useEffect(() => {
    _getCMSPages();
    setNoti(Math.random());
    // eslint-disable-next-line
  }, []);

  if (cmsApiStatus.isPending) {
    return <Loader />;
  }

  return (
    <AppWrapper>
      <SEO
        title="Midigiworld - Privacy Policy"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Container maxWidth="lg" classes={{ root: classes.container }}>
        <Typography
          variant="h4"
          component="h2"
          classes={{ root: classes.heading }}
        >
          Privacy Policy
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          classes={{ root: classes.subHeading }}
        >
          Last updated on{" "}
          {privacyPolicy.updated_at &&
            format(new Date(privacyPolicy.updated_at * 1000), "MMMM dd, yyyy")}
        </Typography>

        <Box mt={2}>
          <Card classes={{ root: classes.card }}>
            <CardContent>
              <Typography paragraph classes={{ paragraph: classes.paragraph }}>
                {privacyPolicy.content}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </AppWrapper>
  );
};

export default PrivacyPolicy;
