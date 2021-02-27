import { makeStyles } from "@material-ui/core/styles";

export const emailFormStyles = makeStyles((theme) => ({
  paperContainer: {
    backgroundColor: theme.palette.custom.primaryBackground,
    boxShadow: "0px 0px 30px #00000019",
    borderRadius: "10px",
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
  pageTitle: {
    width: "100%",
    fontSize: "20px",
    fontWeight: 600,
    textAlign: "center",
  },
  pageSubTitle: {
    color: theme.palette.custom.contrastText,
    fontSize: "14px",
    fontWeight: 500,
    textAlign: "center",
  },
  forgotPasswordLink: {
    display: "inline-block",
    width: "100%",
    textAlign: "right",
  },
  signupLinkText: {
    marginTop: theme.spacing(2),
  },
  signupLink: {
    color: theme.palette.secondary.main,
    fontWeight: 500,
    textTransform: "uppercase",
  },
  formInputGroup: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
  },
  formInputLabel: {
    color: theme.palette.primary.text,
    fontSize: "16px",
    fontWeight: 500,
  },
  formInputField: {
    marginTop: theme.spacing(1),
    "& .MuiInputBase-root": {
      fontSize: "16px",
    },

    "& .MuiOutlinedInput-input": {
      padding: theme.spacing(1.7),
    },
  },
  inputFieldIcon: {
    width: "20px",
    height: "20px",
    color: "#c3c3c3",
  },
  errorMessage: {
    display: "inline-block",
    marginBottom: theme.spacing(2),
    color: theme.palette.error.main,
  },
  submit: {
    alignSelf: "center",
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.2, 3),
    minWidth: "150px",
    backgroundColor: theme.palette.secondary.main,
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

export const otpFormStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "100px",

    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2),
    },
  },
  paperContainer: {
    backgroundColor: theme.palette.custom.primaryBackground,
    boxShadow: "0px 0px 30px #00000019",
    borderRadius: "10px",
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

export const profileStyles = makeStyles((theme) => ({
  paperContainer: {
    backgroundColor: theme.palette.custom.primaryBackground,
    boxShadow: "0px 0px 30px #00000019",
    borderRadius: "10px",
    maxWidth: "850px",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 8),
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
    paddingLeft: theme.spacing(3),
    width: "100%",
    fontSize: "20px",
    fontWeight: 600,
  },
  formInputGroup: {
    marginBottom: theme.spacing(1),
  },
  formInputLabel: {
    color: theme.palette.primary.text,
    fontSize: "16px",
    fontWeight: 500,
  },
  formInputField: {
    marginTop: theme.spacing(1),
    backgroundColor: "#fff",
    "& .MuiInputBase-root": {
      fontSize: "16px",
    },
    "& .MuiOutlinedInput-input": {
      padding: theme.spacing(1.7),
    },
  },
  errorMessage: {
    display: "inline-block",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(0),
    color: theme.palette.error.main,
  },
  updateProfileDetails: {
    alignSelf: "flex-end",
    marginTop: theme.spacing(4),
    minWidth: "160px",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    fontSize: "16px",
    fontWeight: 600,

    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  icon: {
    color: "#C3C3C3",
    backgroundColor: "#fff",
  },
}));

export const locationStyles = makeStyles((theme) => ({
  paperContainer: {
    backgroundColor: theme.palette.custom.primaryBackground,
    boxShadow: "0px 0px 30px #00000019",
    borderRadius: "10px",
    maxWidth: "850px",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 8),
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
    paddingLeft: theme.spacing(3),
    width: "100%",
    fontSize: "20px",
    fontWeight: 600,
  },
  formInputGroup: {
    marginBottom: theme.spacing(1),
  },
  formInputLabel: {
    color: theme.palette.primary.text,
    fontSize: "16px",
    fontWeight: 500,
  },
  formInputField: {
    marginTop: theme.spacing(1),
    backgroundColor: "#fff",
    "& .MuiInputBase-root": {
      fontSize: "16px",
    },
    "& .MuiOutlinedInput-input": {
      padding: theme.spacing(1.7),
    },
  },
  errorMessage: {
    display: "inline-block",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(0),
    color: theme.palette.error.main,
  },
  updateProfileDetails: {
    alignSelf: "flex-end",
    marginTop: theme.spacing(4),
    minWidth: "160px",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    fontSize: "16px",
    fontWeight: 600,

    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  icon: {
    color: "#C3C3C3",
    backgroundColor: "#fff",
  },
}));

export const interestStyles = makeStyles((theme) => ({
  paperContainer: {
    backgroundColor: theme.palette.custom.primaryBackground,
    boxShadow: "0px 0px 30px #00000019",
    borderRadius: "10px",
    maxWidth: "700px",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 8),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: theme.palette.custom.primaryBackground,
  },
  referralBox: {
    // width: "500px",

    "& .MuiDialog-paper": {
      width: "500px",
    },
  },
  referralBoxTitle: {
    marginTop: theme.spacing(1),
    fontWeight: 600,
    textAlign: "center",
  },
  referralBoxContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  referralInput: {
    width: "80%",
  },
  referralBoxBtnContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelReferralBtn: {
    minWidth: "160px",
    borderColor: "#747572",
    color: "#747572",
    fontSize: "16px",
    fontWeight: 500,
  },
  addReferralBtn: {
    minWidth: "160px",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    fontSize: "16px",
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  formHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  pageTitle: {
    paddingLeft: theme.spacing(3),
    width: "100%",
    fontSize: "20px",
    fontWeight: 600,
  },
  interestsLoader: {
    color: theme.palette.secondary.text,
  },
  interestChip: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  interestChipSelected: {
    color: "#fff",

    "& .MuiChip-label": {
      color: "#fff",
    },
  },
  formInputGroup: {
    marginBottom: theme.spacing(1),
  },
  formInputLabel: {
    color: theme.palette.primary.text,
    fontSize: "16px",
    fontWeight: 500,
  },
  formInputField: {
    marginTop: theme.spacing(1),
    "& .MuiInputBase-root": {
      fontSize: "16px",
    },
    "& .MuiOutlinedInput-input": {
      padding: theme.spacing(1.7),
    },
  },
  updateProfileDetails: {
    alignSelf: "flex-end",
    marginTop: theme.spacing(4),
    minWidth: "160px",
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
