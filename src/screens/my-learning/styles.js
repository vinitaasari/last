import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(10),
    minHeight: "calc(90vh - 100px)",
    height: "100%",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  mainPageTitle: {
    color: theme.palette.primary.text,
    fontSize: "36px",
    fontWeight: 600,
  },
  mainPageDescription: {
    color: theme.palette.primary.text,
    fontSize: "22px",
  },
  navLinksContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    borderBottom: "2px solid rgba(95,95,95,0.16)",
  },
  navLink: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    border: "2px solid transparent",
    color: "#7e7e7e",
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: "20px",
    textDecoration: "none",
    position: "relative",

    "&:first-of-type": {
      marginLeft: "0",
    },
  },
  navLinkActive: {
    // borderBottom: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    textDecoration: "none",

    "&::after": {
      content: '""',
      display: "block",
      width: "100%",
      height: "3px",
      backgroundColor: theme.palette.primary.main,
      position: "absolute",
      bottom: "-19px",
    },
  },
}));
