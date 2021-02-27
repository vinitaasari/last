import { makeStyles } from "@material-ui/core/styles";

export const confirmPayStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    minHeight: "100%",
  },
  root: {
    display: "flex",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    marginTop: theme.spacing(15),
    padding: theme.spacing(2),
    borderRadius: "5px",
    maxWidth: "400px",
    backgroundColor: theme.palette.primary.background,
    boxShadow: "3px 4px 14px #00000017",
  },
  loadingMsg: {
    fontSize: "18px",
    fontWeight: 600,
    textAlign: "center",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    marginTop: theme.spacing(15),
    padding: theme.spacing(2),
    borderRadius: "5px",
    maxWidth: "400px",
    backgroundColor: theme.palette.primary.background,
    boxShadow: "3px 4px 14px #00000017",
  },
  errMsg: {
    fontSize: "18px",
    fontWeight: 600,
    textAlign: "center",
  },
  goBackBtn: {
    marginTop: theme.spacing(4),
    minWidth: "150px",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,

    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  pageTitle: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: "#2c516c",
    fontSize: "20px",
    fontWeight: 600,
  },
  courseInfoCard: {
    border: "1px solid transparent",
    borderRadius: "5px",
    backgroundColor: theme.palette.primary.background,
    boxShadow: "3px 4px 14px #00000017",
  },
  courseDetailsContainer: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "flex-start",
  },
  courseAmountContainer: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  planTitle: {
    color: "#393A45",
    fontSize: "18px",
    fontWeight: 600,
  },
  currencySymbol: {
    fontSize: "24px",
    color: "#03579c",
  },
  planAmount: {
    width: "100%",
    color: "#334856",
    fontSize: "34px",
    fontWeight: 500,
    textAlign: "right",

    "& span:last-of-type": {
      color: "#747572",
      fontSize: "14px",
    },
  },
  ratingText: {
    marginLeft: theme.spacing(0.5),
    color: "#393a45",
    fontSize: "14px",
    fontWeight: 400,
  },
  actualAmount: {
    marginLeft: theme.spacing(1),
    color: "#454242",
    fontSize: "14px",
    fontWeight: 400,
    textDecoration: "line-through",
  },
  courseMsg: {
    // marginTop: theme.spacing(5),
    padding: theme.spacing(2),
    borderTop: "1px solid #D9DFE5",
    color: "#393A45",
    fontSize: "16px",
    fontWeight: 600,
  },
  courseThumbnail: {
    height: "98px",
    width: "98px",
    borderRadius: "5px",
    marginRight: theme.spacing(1.5),
  },
  finalAmountContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing(5),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    border: "1px solid transparent",
    borderRadius: "5px",
    maxHeight: "200px",
    backgroundColor: "#fff",
    boxShadow: "3px 4px 14px #00000017",

    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(0),
    },
  },
  actualAmountContainer: {
    width: "100%",
    borderBottom: "1px solid #D9DFE5",
  },
  finalAmount: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: "#03579c",
    fontSize: "34px",
    fontWeight: 500,
    textAlign: "center",
  },
  totalAmount: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: "90%",
    color: "#393A45",
    fontSize: "18px",

    "& span:last-of-type": {
      fontWeight: 600,
    },
  },
  payNowBtn: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: "90%",
    boxShadow: "none",
  },
  cardSetupContainer: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    border: "1px solid transparent",
    borderRadius: "5px",
    backgroundColor: theme.palette.primary.background,
    boxShadow: "3px 4px 14px #00000017",
  },
  mainPriceContainer: {
    marginLeft: "auto",
    backgroundColor: "#E2EAFA",
    padding: theme.spacing(0.5, 2),
    borderRadius: theme.spacing(1),
    display: "inline-block",
  },
  mainPrice: {
    color: "#03579C",
    fontSize: "24px",
    fontWeight: 600,
  },
}));

export const cardSetupStyles = makeStyles((theme) => ({
  container: {},
  cardTitle: {
    color: "#393a45",
    fontSize: "18px",
    fontWeight: 600,
  },
  cardSubTitle: {
    display: "flex",
    alignItems: "center",
    color: "#52534F",
    fontSize: "14px",
    "& svg": {
      color: "#52534f",
      marginRight: theme.spacing(1),
    },
  },
  cardFormItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",

    "&:hover": {},

    "& > label": {
      flex: 1,
      cursor: "pointer",
      "user-select": "none",
    },
  },
  cardElementLabel: {
    color: "#6C6969",
    fontSize: "14px",
  },
  cardSaveBtn: {
    backgroundColor: theme.palette.primary.background,
    color: "#52534f",
    fontSize: "14px",
    fontWeight: 500,
    textTransform: "none",
  },
  formToggleBtn: {
    marginTop: theme.spacing(5),
    backgroundColor: theme.palette.primary.background,
    color: "#52534f",
    fontSize: "14px",
    fontWeight: 500,
    textTransform: "none",
  },
  closeFormBtn: {
    // padding: 0,
  },
  cardDisplaySectionHeading: {
    color: "#52534f",
    fontSize: "16px",
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  cardSetupContainer: {
    padding: theme.spacing(1, 1.5),
  },
  cardNumber: {
    color: "#454743",
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "3px",
  },
  radioBtn: {
    marginLeft: "auto",
  },
  addCardSection: {},
}));

export const modalStyles = makeStyles((theme) => ({
  cardBg: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.primary.background,
  },
  cardMsg: {
    fontSize: "20px",
    fontWeight: 600,
    textAlign: "center",
  },
  cardBtn: {
    marginTop: theme.spacing(4),
    minWidth: "150px",
    backgroundColor: theme.palette.secondary.main,

    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
}));
