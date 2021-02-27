import { makeStyles } from "@material-ui/core/styles";

export const otpFormStyles = makeStyles((theme) => ({
  paperContainer: {
    backgroundColor: theme.palette.custom.primaryBackground,
    boxShadow: "0px 0px 30px #00000019",
    borderRadius: "10px",
    width: "400px",
    maxWidth: "500px",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    margin: theme.spacing(0, 5),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: theme.palette.custom.primaryBackground,
  },
  formHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  pageTitle: {
    paddingRight: theme.spacing(3),
    width: "100%",
    fontSize: "20px",
    fontWeight: 600,
    textAlign: "center",
  },
  pageSubTitle: {
    alignSelf: "center",
    marginBottom: theme.spacing(4),
    width: "80%",
    color: theme.palette.custom.mainText,
    fontSize: "14px",
    fontWeight: 500,
    textAlign: "center",
  },
  otpInputContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  otpInputBox: {
    // marginRight: theme.spacing(2),
  },
  errorMessage: {
    display: "inline-block",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(4),
    color: theme.palette.error.main,
  },
  actionBtnContainer: {
    marginTop: theme.spacing(4),
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resendOtp: {
    flexBasis: "47%",
  },
  validateOtp: {
    flexBasis: "47%",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    fontSize: "16px",
    fontWeight: 600,

    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  loader: {
    color: theme.palette.primary.contrastText,
  },
}));
