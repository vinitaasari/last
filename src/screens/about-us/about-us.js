import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";
// import BrandLogo from "../../assets/images/logo-horizontal.svg";
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
    minHeight: "calc(100vh - 70px - 350px)",
  },
  heading: {
    marginTop: theme.spacing(2),
    color: theme.palette.custom.title,
    fontSize: "28px",
    fontWeight: 500,
  },
  contentContainer: {
    // marginBottom: "50px",
  },
  paragraph: {
    color: theme.palette.custom.paragraph,
    fontSize: "16px",
    marginBottom: 0,
  },
}));

const AboutUs = (props) => {
  const classes = useStyles();
  const [aboutUs, setAboutUsText] = useState({});
  const { logout } = useAuth();

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

      setAboutUsText(data.about_us);
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
        title="Midigiworld - About Us"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Container maxWidth="lg" classes={{ root: classes.container }}>
        {/* <Box>
          <img src={BrandLogo} alt="Brand Logo" />
        </Box> */}

        <Typography
          variant="h4"
          component="h2"
          classes={{ root: classes.heading }}
        >
          About Us
        </Typography>

        <Box mt={2} className={classes.contentContainer}>
          <Card classes={{ root: classes.card }}>
            <CardContent>
              <Typography paragraph classes={{ paragraph: classes.paragraph }}>
                {aboutUs.content}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </AppWrapper>
  );
};

export default AboutUs;
