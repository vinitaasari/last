import React from "react";
import { Box, CircularProgress, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ChevronLeftRounded, ChevronRightRounded } from "@material-ui/icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import _, { ceil } from "lodash";
import courseEmptyState from '../../assets/images/Group 19761.svg'

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
}));

const ButtonGroup = ({ next, previous, goToSlide, dataLength,...rest }) => {
  const classes = useStyles();
  const {
    carouselState: { currentSlide },
  } = rest;
  return (
    <Box className={classes.buttonGroup}>
      {/* <Typography classes={{ root: classes.currentSlidesText }}>
      {ceil((currentSlide/2)+1)}/{dataLength}
      </Typography> */}
      <IconButton
        size="small"
        classes={{ sizeSmall: classes.arrowIconContainer }}
        onClick={() => previous()}
      >
        <ChevronLeftRounded />
      </IconButton>
      <IconButton
        size="small"
        classes={{ sizeSmall: classes.arrowIconContainer }}
        onClick={() => next()}
      >
        <ChevronRightRounded />
      </IconButton>
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

  const renderState=()=>{
    if(props.chatConversationLoader){
      return (
        <Box style={{textAlign:"center"}}>
          <CircularProgress/>
        </Box>
      )
    }else
      return (
        props.dataLength === 0 ? (
        <Box style={{textAlign:"center"}} className={classes.carouselNoDataContainer}>
          <img src={courseEmptyState}/>
          <Typography className={classes.carouselNoDataMsg}>
            {props.noDataMsg}
          </Typography>
        </Box>
      ):<Carousel
      arrows={false}
      swipeable={false}
      draggable={false}
      showDots={false}
      responsive={responsive}
      ssr={false} // means to render carousel on server-side.
      infinite={true}
      autoPlay={false}
      autoPlaySpeed={1000}
      keyBoardControl={true}
      customTransition="all 1s"
      transitionDuration={500}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      deviceType={props.deviceType}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
      renderButtonGroupOutside={true}
      customButtonGroup={<ButtonGroup dataLength={props.dataLength} />}
    >
      {props.children}
    </Carousel>)
  }

  return (
    <Box position="relative">
      <Box mb={2}>{props.heading}</Box>
      {renderState()}
    </Box>
  );
};

export default CustomCarousel;
