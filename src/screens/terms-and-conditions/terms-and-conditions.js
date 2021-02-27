import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";
import { format } from "date-fns";

import { useSnackbar } from "notistack";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import Loader from "../../components/loader";
import AppWrapper from "../../components/app-wrapper";
import { useAuth } from "../../contexts/auth-context";
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

const TermsAndConditions = (props) => {
  const classes = useStyles();

  const [tc, setTc] = useState({});
  const cmsApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { logout } = useAuth();

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

      setTc(data.terms_and_condition_learner);
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
    // eslint-disable-next-line
  }, []);

  if (cmsApiStatus.isPending) {
    return <Loader />;
  }

  return (
    <AppWrapper>
      <SEO
        title="Midigiworld - Terms & Conditions"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Container maxWidth="lg" classes={{ root: classes.container }}>
        <Typography
          variant="h4"
          component="h2"
          classes={{ root: classes.heading }}
        >
          Terms & Conditions
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          classes={{ root: classes.subHeading }}
        >
          Last updated on{" "}
          {tc.updated_at &&
            format(new Date(tc.updated_at * 1000), "MMMM dd, yyyy")}
        </Typography>

        <Box mt={2}>
          <Card classes={{ root: classes.card }}>
            <CardContent>
              <Typography paragraph classes={{ paragraph: classes.paragraph }}>
                {tc.content}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </AppWrapper>
  );
};

export default TermsAndConditions;
