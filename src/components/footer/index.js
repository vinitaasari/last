import React from "react";
import { Container, Grid, Box, Link, Typography } from "@material-ui/core";
import { Link as RouteLink } from "react-router-dom";
import GoogleIcon from "./../../assets/images/google_.png";
import AppleIcon from "./../../assets/images/apple_.png";


// import { useHistory } from "react-router-dom";

import { useStyles } from "./styles";

import MILogo from "../../assets/images/logo-horizontal.svg";
import { Face } from "@material-ui/icons";

const date = new Date();
const year = date.getFullYear();

function Footer() {
  const classes = useStyles();
  return (
    <Box className={classes.rootContainer}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <img
              src={MILogo}
              alt="Midigiworld"
              className={classes.footerLogo}
            />
            <Typography variant="body1" className={classes.footerNote}>
              Midigiworld is an interactive e-learning platform for upscaling skills
              and hobbies with the vision to inspire and create exceptional learning
              experiences with a live training session, exponential technologies,
              classroom-like feel at your comfort.
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box className={classes.cmsPagesLinksContainer}>
              <Link
                component={RouteLink}
                to="/about-us"
                className={classes.cmsPageLink}
              >
                About Us
              </Link>
              <Link
                component={RouteLink}
                to="/contact-us"
                className={classes.cmsPageLink}
              >
                Contact Us
              </Link>
              <Link
                component={RouteLink}
                to="/faq"
                className={classes.cmsPageLink}
              >
                FAQ
              </Link>
            </Box>
          </Grid>
          <Grid item xs={6} md={3} >
            <Box className={classes.cmsPagesLinksContainer}>
              <Box  >
                <Grid xs={12} onClick={() => {
                  window.open('https://play.google.com/store/apps/details?id=com.jump360.milife_learner.prod.release', '_blank')
                }}>
                  {/* <a href="https://play.google.com/store/apps/details?id=com.jump360.milife_learner.prod.release" target="_blank"> */}
                  <img style={{ height: '80px', width: '180px' }} src={GoogleIcon}></img>
                  {/* </a> */}

                </Grid>
              </Box>
              <Box >
                <Grid xs={12} style={{ marginTop: '-50px' }}>
                  {/* <a href="http://www.youtube.com" target="_blank"> */}
                  <div style={{ paddingLeft: '10px' }}>
                    <img style={{ height: '160px', width: '160px' }} align="center" src={AppleIcon}></img>
                    {/* </a> */}
                  </div>
                </Grid>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} className={classes.extraLinksContainer}>
            <Typography className={classes.additionalLink}>
              © {year} Midigiworld, Inc. All rights reserved
            </Typography>
            <Link component={RouteLink} to="/terms-and-conditions">
              <Typography className={classes.additionalLink}>
                Terms & Conditions
              </Typography>
            </Link>
            <Link component={RouteLink} to="/privacy-policy">
              <Typography className={classes.additionalLink}>
                Privacy Policy
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Footer;
