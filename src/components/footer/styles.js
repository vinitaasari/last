import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  rootContainer: {
    // height: "100%",
    marginTop: theme.spacing(5),
    backgroundColor: "#f7f7f7",
  },
  container: {
    paddingTop: "50px",
    paddingBottom: "50px",
    backgroundColor: "transparent",
  },
  footerLogo: {
    marginBottom: theme.spacing(2),
  },
  footerNote: {
    width: "80%",
    color: "#535353",
    fontSize: "16px",

    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  cmsPagesLinksContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",

    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(2, 0),
    },
  },
  cmsPagesLinksContainerr: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // height: "100%",

    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(2, 0),
    },
  },
  cmsPageLink: {
    marginBottom: theme.spacing(1),
    color: "#1c1a1a",
    fontSize: "15px",
    fontWeight: 500,
    textTransform: "uppercase",

    "&:hover": {
      color: "#1c1a1a",
    },

    "&:last-of-type": {
      marginBottom: 0,
    },
  },
  extraLinksContainer: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderTop: "1px solid #5f5f5f",
    display: "flex",
    alignItems: "center",
  },
  additionalLink: {
    marginRight: theme.spacing(2),
    color: "#1c1a1a",
    fontSize: "14px",
    fontWeight: 400,

    "&:hover": {
      color: "#1c1a1a",
    },
  },
}));
