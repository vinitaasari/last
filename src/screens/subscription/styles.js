import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#F8F8F8",
    height: "100%",
    marginTop: '18px'
  },
  root: {
    paddingTop: theme.spacing(4),
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
  },
  pageTitle: {
    color: "#494B47",
    fontSize: "26px",
    fontWeight: 600,
    textAlign: "center",
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  subscriptionCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    border: "1px solid #D9DFE5",
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
  },
  planTitle: {
    color: "#7C7C7C",
    fontSize: "18px",
    fontWeight: 500,
    textAlign: "center",
  },
  currencySymbol: {
    fontSize: "24px",
    color: "#9B9B9B",
  },
  planAmount: {
    marginBottom: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    borderBottom: "1px solid #E7E7EA",
    width: "100%",
    color: "#334856",
    fontSize: "34px",
    fontWeight: 500,
    textAlign: "center",

    "& span:last-of-type": {
      color: "#747572",
      fontSize: "14px",
    },
  },
  buyBtn: {
    marginTop: theme.spacing(4),
    border: `1px solid ${theme.palette.secondary.main}`,
    width: "90%",
    color: theme.palette.secondary.main,
    fontSize: "16px",
    textAlign: "center",
    textTransform: "uppercase",

    "&:hover": {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.secondary.main,
    },
  },
  btnHighlight: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  },
  overlay: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: 'black',
    backgroundColor: 'white'
  },
  separaterText: {
    width: "100%",
    fontWeight: 600,
    textAlign: "center",
    textTransform: "uppercase",
  },
  promoCodeContainer: {
    display: "flex",
    justifyContent: "center",
  },
  promoCodeBox: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    border: "1px solid #D9DFE5",
    borderRadius: "4px",

    "& svg": {
      fill: "#D9DFE5",
    },
  },
  formInputField: {
    marginLeft: theme.spacing(1),
    width: "300px",
    fontWeight: 500,
    "& .MuiInputBase-root": {
      fontSize: "16px",
    },

    "& .MuiOutlinedInput-input": {
      padding: theme.spacing(1.5),
    },
  },
}));
