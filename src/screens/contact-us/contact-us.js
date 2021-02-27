import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";
// import BrandLogo from "../../assets/images/logo-horizontal.svg";s

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
  contactUsCard: {
    maxWidth: "680px",
  },
  contactUsCategory: {
    display: "flex",
    alignItems: "flex-start",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  categoryBorder: {
    borderBottom: "1px solid #c9c9c9",
  },
  contactUsLabel: {
    color: "#494B47",
    fontWeight: 600,
    fontSize: "16px",
  },
  contactUsValue: {
    color: "#676767",
    fontWeight: 400,
    fontSize: "16px",
  },
}));

const ContactUs = (props) => {
  const classes = useStyles();

  const [phoneNum, setPhoneNum] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
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

      setPhoneNum(data.contact_us_phone.content);
      setEmail(data.contact_us_email.content);
      setAddress(data.contact_us.content);
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
        title="Midigiworld - Contact Us"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Container maxWidth="lg" classes={{ root: classes.container }}>
        {/* <Box>
          <img src={BrandLogo} alt="Brand" />
        </Box> */}

        <Typography
          variant="h4"
          component="h2"
          classes={{ root: classes.heading }}
        >
          Contact Us
        </Typography>

        <Box mt={2}>
          <Card classes={{ root: classes.contactUsCard }}>
            <CardContent>
              <Box
                pb={2}
                className={`${classes.contactUsCategory} ${classes.categoryBorder}`}
              >
                <Box mr={6}>
                  <Typography classes={{ root: classes.contactUsLabel }}>
                    Phone:
                  </Typography>
                </Box>
                <Typography classes={{ root: classes.contactUsValue }}>
                  {phoneNum}
                </Typography>
              </Box>
              <Box
                mt={2}
                pb={2}
                className={`${classes.contactUsCategory} ${classes.categoryBorder}`}
              >
                <Box mr={6}>
                  <Typography classes={{ root: classes.contactUsLabel }}>
                    Email:
                  </Typography>
                </Box>
                <Typography classes={{ root: classes.contactUsValue }}>
                  {email}
                </Typography>
              </Box>
              <Box mt={2} className={classes.contactUsCategory}>
                <Box mr={4}>
                  <Typography classes={{ root: classes.contactUsLabel }}>
                    Address:
                  </Typography>
                </Box>
                <Typography classes={{ root: classes.contactUsValue }}>
                  {address}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </AppWrapper>
  );
};

export default ContactUs;
