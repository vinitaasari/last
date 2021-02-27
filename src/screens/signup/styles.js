import { makeStyles } from "@material-ui/core/styles";

export const emailFormStyles = makeStyles((theme) => ({
  paperContainer: {
    backgroundColor: theme.palette.custom.primaryBackground,
    boxShadow: "0 0 30px 0 rgba(0, 0, 0, 0.1)",
    borderRadius: "5px",
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
  icon: {
    color: "#c3c3c3",
  },
  pageTitle: {
    width: "100%",
    fontSize: "20px",
    fontWeight: 600,
    textAlign: "center",
    color: "#494b47",
  },
  pageSubTitle: {
    marginTop: theme.spacing(0.8),
    color: theme.palette.custom.contrastText,
    fontSize: "14px",
    fontWeight: 400,
    textAlign: "center",
    color: "#334856",
  },
  externalLink: {
    color: theme.palette.secondary.main,
    fontWeight: 500,
  },
  forgotPasswordLink: {
    display: "inline-block",
    width: "100%",
    textAlign: "right",
  },
  signupLinkText: {
    marginTop: theme.spacing(1.5),
    color: "#334856",
    fontSize: "14px",
    fontWeight: 400,
  },
  signupLink: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
  },
  formInputGroup: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
  formInputLabel: {
    color: "#334856",
    fontSize: "14px",
    fontWeight: 500,
  },
  formInputField: {
    marginTop: theme.spacing(1),
    backgroundColor: "#fafcfd",
  },
  inputFieldIcon: {
    width: "20px",
    height: "20px",
    color: "#c3c3c3",
  },
  privacyText: {
    color: "#334856",
    fontSize: "12px",
    fontWeight: 400,
  },
  errorMessage: {
    display: "inline-block",
    marginBottom: theme.spacing(1),
    color: theme.palette.error.main,
  },
  submit: {
    alignSelf: "center",
    marginTop: theme.spacing(2),
    minWidth: "150px",
    backgroundColor: theme.palette.secondary.main,
    fontSize: "16px",
    fontWeight: 600,
    boxShadow: "none",
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  loader: {
    color: theme.palette.primary.contrastText,
  },
}));

export const otpFormStyles = makeStyles((theme) => ({
  icon: {
    color: "#c3c3c3",
  },
  paperContainer: {
    backgroundColor: theme.palette.custom.primaryBackground,
    boxShadow: "0 0 30px 0 rgba(0, 0, 0, 0.1)",
    borderRadius: "5px",
    maxWidth: "500px",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    margin: theme.spacing(0, 4),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: theme.palette.custom.primaryBackground,
  },
  pageTitle: {
    fontSize: "20px",
    fontWeight: 600,
    textAlign: "center",
    color: "#494b47",
  },
  pageSubTitle: {
    marginBottom: theme.spacing(4),
    fontSize: "14px",
    fontWeight: 400,
    color: "#334856",
    textAlign: "center",
  },
  formHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    position: "relative",
  },
  backIcon: {
    position: "absolute",
    top: -12,
    left: 0,
    zIndex: 2,
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
    boxShadow: "none",
  },
  validateOtp: {
    flexBasis: "47%",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    boxShadow: "none",
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  loader: {
    color: theme.palette.primary.contrastText,
  },
}));

export const profileStyles = makeStyles((theme) => ({
  icon: {
    color: "#c3c3c3",
  },
  paperContainer: {
    backgroundColor: theme.palette.custom.primaryBackground,
    boxShadow: "0 0 30px 0 rgba(0, 0, 0, 0.1)",
    borderRadius: "5px",
    maxWidth: "850px",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 4),
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
    padding: theme.spacing(0, 3),
  },
  pageTitle: {
    fontSize: "18px",
    fontWeight: 600,
    textAlign: "center",
    color: "#494b47",
    paddingLeft: theme.spacing(3),
  },
  formInputGroup: {
    marginBottom: theme.spacing(0),
  },
  formInputLabel: {
    color: theme.palette.primary.text,
    fontSize: "14px",
    fontWeight: 500,
  },
  formInputField: {
    marginTop: theme.spacing(1),
    backgroundColor: "#fafcfd",
  },
  helperText: {
    color: "#504A50",
    fontSize: "12px",
    fontWeight: 500,
  },
  errorMessage: {
    display: "inline-block",
    fontSize: "12px",
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
    boxShadow: "none",
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  icon: {
    color: "#C3C3C3",
    backgroundColor: "#fff",
  },
  colorPrimary: {
    backgroundColor: "#e7e8ea",
  },
  barColorPrimary: {
    backgroundColor: "#05589c",
  },
}));

export const locationStyles = makeStyles((theme) => ({
  icon: {
    color: "#c3c3c3",
  },
  paperContainer: {
    backgroundColor: theme.palette.custom.primaryBackground,
    boxShadow: "0 0 30px 0 rgba(0, 0, 0, 0.1)",
    borderRadius: "5px",
    maxWidth: "850px",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 4),
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
    padding: theme.spacing(0, 3),
  },
  pageTitle: {
    fontSize: "18px",
    fontWeight: 600,
    textAlign: "center",
    color: "#494b47",
    paddingLeft: theme.spacing(3),
  },
  formInputGroup: {
    marginBottom: theme.spacing(0),
  },
  formInputLabel: {
    color: theme.palette.primary.text,
    fontSize: "14px",
    fontWeight: 500,
  },
  formInputField: {
    marginTop: theme.spacing(1),
    backgroundColor: "#fafcfd",
  },
  languageInputGroup: {
    height: "100%",
    display: "flex",
    flexDirection: "column",

    "& .MuiAutocomplete-root": {
      marginTop: "8px",
    },
  },
  languageChip: {
    marginRight: theme.spacing(1),
    backgroundColor: "#e2eafa",
    border: "1px solid #03579c",
    "&:hover": {
      backgroundColor: "#e2eafa",
      border: "1px solid #03579c",
    },

    "& .MuiChip-label": {
      color: "#03579c",
      fontWeight: 600,
    },
  },
  errorMessage: {
    display: "inline-block",
    fontSize: "12px",
    marginLeft: theme.spacing(0),
    color: theme.palette.error.main,
  },
  updateProfileDetails: {
    alignSelf: "flex-end",
    marginTop: theme.spacing(4),
    minWidth: "160px",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    boxShadow: "none",
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  icon: {
    color: "#C3C3C3",
  },
  colorPrimary: {
    backgroundColor: "#e7e8ea",
  },
  barColorPrimary: {
    backgroundColor: "#05589c",
  },
}));

export const interestStyles = makeStyles((theme) => ({
  icon: {
    color: "#c3c3c3",
  },
  paperContainer: {
    backgroundColor: theme.palette.custom.primaryBackground,
    boxShadow: "0 0 30px 0 rgba(0, 0, 0, 0.1)",
    borderRadius: "5px",
    maxWidth: "700px",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 4),
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
    paddingLeft: theme.spacing(3),
  },
  referralBox: {
    "& .MuiDialog-paper": {
      width: "500px",
    },
  },
  referralBoxTitle: {
    marginTop: theme.spacing(1),
    fontWeight: 600,
    textAlign: "center",
    color: "#494b47",
    fontSize: "18px",
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
    marginBottom: theme.spacing(4),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelReferralBtn: {
    minWidth: "160px",
    borderColor: "#747572",
    color: "#747572",
    fontWeight: 500,
    boxShadow: "none",
  },
  addReferralBtn: {
    minWidth: "160px",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 500,
    boxShadow: "none",
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  pageTitle: {
    fontSize: "18px",
    fontWeight: 600,
    textAlign: "center",
    color: "#494b47",
    marginLeft: theme.spacing(3),
  },
  interestsText: {
    fontSize: "15px",
    fontWeight: 400,
    color: "#777777",
  },
  interestsLoader: {
    color: theme.palette.secondary.text,
  },
  interestChip: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  interestChipSelected: {
    backgroundColor: "#e2eafa",
    border: "1px solid #03579c",
    "&:hover": {
      backgroundColor: "#e2eafa",
      border: "1px solid #03579c",
    },

    "& .MuiChip-label": {
      color: "#03579c",
      fontWeight: 600,
    },
  },
  formInputGroup: {
    marginBottom: theme.spacing(1),
  },
  formInputLabel: {
    color: theme.palette.primary.text,
    fontSize: "14px",
    fontWeight: 500,
  },
  formInputField: {
    marginTop: theme.spacing(0),
    backgroundColor: "#fafcfd",
  },
  updateProfileDetails: {
    alignSelf: "flex-end",
    marginTop: theme.spacing(4),
    minWidth: "160px",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    boxShadow: "none",
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  loader: {
    color: theme.palette.primary.contrastText,
  },
  registrationSuccessBox: {
    "& .MuiDialogContent-root": {
      padding: 0,
    },
  },
  colorPrimary: {
    backgroundColor: "#e7e8ea",
  },
  barColorPrimary: {
    backgroundColor: "#05589c",
  },
}));
