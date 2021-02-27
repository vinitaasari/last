import React from "react";
import { Link } from "react-router-dom";
import { Box, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ChevronLeftRounded, ChevronRightRounded } from "@material-ui/icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const useStyles = makeStyles((theme) => ({
  sectionHeading: {
    color: "#3F3F3F",
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  buttonGroup: {
    position: "absolute",
    top: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
  },
  currentSlidesText: {
    color: "#45484D",
    fontSize: "16px",
    marginLeft: theme.spacing(1),
  },
  seeAllText: {
    color: "#45484D",
    fontSize: "16px",
    textDecoration: "none",

    "&:hover": {
      color: "#45484D",
    },
  },
  arrowIconContainer: {
    marginLeft: theme.spacing(1),
    border: "1px solid #B2B2B2",
    backgroundColor: "#fff",
    borderRadius: "100%",
  },
  carouselContainer: {
    padding: theme.spacing(2),
  },
  carouselNoDataContainer: {
    margin: "50px 0",
  },
  carouselNoDataMsg: {
    width: "100%",
    fontWeight: 600,
    textAlign: "center",
  },
  noPadding: {
    padding: 0,
  },
}));

const ButtonGroup = (props) => {
  const { next, previous, goToSlide, path, ...rest } = props;
  const classes = useStyles();
  const {
    carouselState: { currentSlide, slidesToShow, totalItems },
  } = rest;

  const isArrowsDisabled = slidesToShow === totalItems;

  // const totalPages = parseInt(totalItems / slidesToShow);
  // const currentPage = currentSlide + 1;

  return (
    <Box className={classes.buttonGroup}>
      {path && (
        <Link to={path} className={classes.seeAllText}>
          See All
        </Link>
      )}

      {/* <Typography to={path} className={classes.currentSlidesText}>
        {currentPage}/{totalPages}
      </Typography> */}

      {!isArrowsDisabled && (
        <IconButton
          size="small"
          disabled={isArrowsDisabled}
          classes={{ sizeSmall: classes.arrowIconContainer }}
          onClick={() => previous()}
        >
          <ChevronLeftRounded />
        </IconButton>
      )}

      {!isArrowsDisabled && (
        <IconButton
          size="small"
          disabled={isArrowsDisabled}
          classes={{ sizeSmall: classes.arrowIconContainer }}
          onClick={() => next()}
        >
          <ChevronRightRounded />
        </IconButton>
      )}
    </Box>
  );
};

const CustomCarousel = (props) => {
  const classes = useStyles();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: props.itemsToDisplay || 3,
      slidesToSlide: props.itemsToDisplay || 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: props.itemsToDisplay || 3,
      slidesToSlide: props.itemsToDisplay || 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <Box position="relative">
      <Box mb={2}>{props.heading}</Box>
      {props.dataLength === 0 ? (
        <Box className={classes.carouselNoDataContainer}>
          <Typography className={classes.carouselNoDataMsg}>
            {props.noDataMsg}
          </Typography>
        </Box>
      ) : (
        <Carousel
          arrows={false}
          swipeable={false}
          draggable={false}
          showDots={false}
          responsive={responsive}
          ssr={false}
          infinite={false}
          autoPlay={false}
          autoPlaySpeed={1000}
          keyBoardControl={true}
          customTransition="all 1s"
          transitionDuration={500}
          containerClass={`${classes.carouselContainer} ${
            props.noPadding ? classes.noPadding : ""
          }`}
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          renderButtonGroupOutside={true}
          customButtonGroup={<ButtonGroup path={props.path} />}
        >
          {props.children}
        </Carousel>
      )}
    </Box>
  );
};

export default CustomCarousel;
