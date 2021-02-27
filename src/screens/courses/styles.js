import { makeStyles } from "@material-ui/core/styles";

export const courseDetail = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(10),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  closeButton: {
    position: "absolute",
    zIndex: theme.zIndex.drawer + 1,
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#fff",
  },
  sectionHeading: {
    color: "#3F3F3F",
    fontSize: "24px",
    fontWeight: 600,
    marginLeft: "20px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "20px",
    },
  },
  heroImage: {
    height: "400px",
    width: "100%",
    borderRadius: theme.spacing(0.5),
  },
  courseName: {
    color: "#211919",
    fontSize: "26px",
    fontWeight: 600,
  },
  courseTagline: {
    color: "#1C1A1A",
    fontSize: "20px",
    fontWeight: 400,
  },
  ratingText: {
    marginLeft: theme.spacing(0.5),
    color: "#1C1A1A",
    fontSize: "18px",
    fontWeight: 500,
  },
  favoriteIconContainer: {
    marginRight: theme.spacing(0.5),
  },
  favouriteText: {
    color: "#1C1A1A",
    fontSize: "16px",
    fontWeight: 400,
    textDecoration: "underline",
  },
  instructorAvatar: {
    borderRadius: theme.spacing(1.5),
    height: theme.spacing(9),
    width: theme.spacing(9),
  },
  instructorName: {
    color: "#1C1A1A",
    fontSize: "18px",
    fontWeight: 600,
  },
  instructorDomain: {
    color: "#6E6C6C",
    fontSize: "16px",
    fontWeight: 500,
  },
  instructorRatingText: {
    marginLeft: theme.spacing(0.5),
    color: "#6E6C6C",
    fontSize: "16px",
    fontWeight: 500,
  },
  priceContainer: {
    borderBottom: "1px solid #E7E7EA",
  },
  discountedPrice: {
    color: "#05589C",
    fontSize: "32px",
    fontWeight: 600,
  },
  oldPrice: {
    marginLeft: theme.spacing(1),
    color: "#707070",
    fontSize: "18px",
    fontWeight: 400,
    textDecoration: "line-through",
  },
  mainPrice: {
    color: "#05589C",
    fontSize: "32px",
    fontWeight: 600,
    textDecoration: "none",
  },
  tabContainer: {
    borderBottom: "1px solid rgba(95,95,95, 0.16)",
  },
  activeSlotContainer: {
    backgroundColor: "#E2EAFA",
    padding: theme.spacing(1, 2),
    border: "1px solid #03579C",
    borderRadius: "8px",
    display: "inline-block",
    cursor: "pointer",
  },
  slotContainer: {
    backgroundColor: "#FAFAFA",
    padding: theme.spacing(1, 2),
    border: "1px solid #D9DFE5",
    borderRadius: "8px",
    display: "inline-block",
    cursor: "pointer",
  },
  slotName: {
    color: "#03579C",
    fontSize: "16px",
    fontWeight: 600,
  },
  slotDuration: {
    color: "#3C3B3B",
    fontSize: "14px",
    fontWeight: 500,
  },
  dateText: {
    color: "#03579C",
    fontSize: "34px",
    fontWeight: 500,
    textAlign: "center",
  },
  monthText: {
    color: "#3C3B3B",
    fontSize: "18px",
    fontWeight: 500,
    textAlign: "center",
  },
  eventDetailsContainer: {
    width: "100%",
    borderBottom: "1px solid #E7E7EA",
    paddingBottom: theme.spacing(3),
  },
  eventHeading: {
    color: "#1C1A1A",
    fontSize: "18px",
    fontWeight: 600,
  },
  eventDescription: {
    color: "#484747",
    fontSize: "16px",
    fontWeight: 400,
  },
  eventStats: {
    color: "#898989",
    fontSize: "14px",
    fontWeight: 400,
  },
  aboutHeading: {
    color: "#1C1A1A",
    fontSize: "20px",
    fontWeight: 500,
  },
  aboutStatsTitle: {
    color: "#1C1A1A",
    fontSize: "16px",
    fontWeight: 500,
  },
  aboutStatsSubTitle: {
    color: "#6E6C6C",
    fontSize: "16px",
    fontWeight: 400,
    textTransform: "capitalize",
  },
  aboutContainer: {
    borderBottom: "1px solid #E7E7EA",
    paddingBottom: theme.spacing(4),
  },
  shortDescriptionContainer: {
    borderBottom: "1px solid #E7E7EA",
    paddingBottom: theme.spacing(4),
  },
  shortDescriptionText: {
    color: "#6E6C6C",
    fontSize: "16px",
    fontWeight: 400,
  },
  knowMoreText: {
    color: theme.palette.secondary.main,
    textTransform: "uppercase",
    fontWeight: 600,
    cursor: "pointer",
  },
  reviewCardContainer: {
    border: "1px solid #E7E7EA",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  reviewerName: {
    color: "#1C1A1A",
    fontSize: "16px",
    fontWeight: 600,
  },
  reviewDate: {
    color: "#6E6C6C",
    fontSize: "16px",
    fontWeight: 400,
  },
  reviewDescription: {
    color: "#6E6C6C",
    fontSize: "16px",
    fontWeight: 400,
  },
  availableSlotsText: {
    color: "#6E6C6C",
    fontSize: "14px",
    fontWeight: 400,
    textAlign: "center",
  },
  slotsViewContainer: {
    maxHeight: "450px",
    overflowY: "scroll",
  },
  ctaText: (props) => ({
    marginLeft: theme.spacing(1),
    color: props.isJoinDisabled ? "#9b9b9b" : "#F05E23",
    fontSize: "16px",
    fontWeight: 500,
  }),

  // course join view
  courseSessionTimingContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(4),
    borderTop: "1px solid rgba(95,95,95, 0.16)",
  },
  courseSessionTitle: {
    color: "#1c1a1a",
    fontSize: "18px",
    fontWeight: 600,
  },
  courseSessionValue: {
    color: "#6e6c6c",
    fontSize: "18px",
  },
  gridItemContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    borderTop: "1px solid #e7e7ea",
  },
  dateContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  date: {
    color: "#03579c",
    fontSize: "36px",
    fontWeight: 500,
    lineHeight: 1,
  },
  month: {
    color: "#3c3b3b",
    fontSize: "16px",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  sessionNumber: {
    color: "#2c516c",
    fontSize: "14px",
    fontWeight: 500,
  },
  sessionName: {
    color: "#1c1a1a",
    fontSize: "18px",
    fontWeight: 600,
  },
  sessionDescription: {
    color: "#484747",
    fontSize: "16px",
    fontWeight: 400,
  },
  joinNowButton: {
    paddingLeft: 0,
    textTransform: "none",
  },
  timing: {
    color: "#1c1a1a",
    fontSize: "16px",
    fontWeight: 400,
    textTransform: "uppercase",
  },
  courseCompletionContainer: {
    marginRight: theme.spacing(2),
  },
  completedStatusText: {
    color: "#479b00",
    fontSize: "20px",
    fontWeight: 500,
  },
  cancelledStatusText: {
    color: "#ef250b",
    fontSize: "20px",
    fontWeight: 500,
  },
  certificateDownloadContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2, 0),
    borderTop: "1px solid #e7e7ea",
    borderBottom: "1px solid #e7e7ea",
  },
  downloadCertificateButton: {
    color: "#52534f",
    fontWeight: 500,
    textTransform: "none",
    textDecoration: "underline",

    "&:hover": {
      textDecoration: "underline",
    },
  },
}));
