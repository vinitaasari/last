import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      // main: "#d9dfe5",
      main: "#03579c",
      text: "#334856",
      contrastText: "#ffffff",
      background: "#fff",
    },
    secondary: {
      main: "#F05E23",
      text: "#717171",
    },
    custom: {
      primaryBackground: "#fff",
      contrastText: "#334856",
      mainText: "#334856",
      border: "#c8ccd0",
    },
  },
  typography: {
    fontFamily: [
      "Encode Sans",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  overrides: {
    MuiAppBar: {
      root: {
        boxShadow: "0px 4px 14px #00000017",
      },
    },
    MuiButton: {
      contained: {
        padding: "6px 32px",
        boxShadow: "none",
      },
      label: {
        fontWeight: 600,
      },
    },
    MuiCard: {
      root: {
        borderRadius: "5px",
        boxShadow: "0px 4px 14px #00000017",
      },
    },
    MuiChip: {
      outlined: {
        backgroundColor: "#FAFCFD",
        border: "1px solid #D9DFE5",
        padding: "12px",
      },
      label: {
        color: "#A6A6B2",
        fontSize: "14px",
        fontWeight: 500,
        textTransform: "capitalize",
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: "5px",
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: "36px",
      },
    },
    MuiTabs: {
      indicator: {
        backgroundColor: "#05589C",
      },
    },
    MuiTab: {
      root: {
        textDecoration: "none",
        textTransform: "none",
        color: "#7E7E7E",
        fontSize: "16px",
        "&$selected": {
          color: "#05589C",
        },
      },
    },
    MuiSelect: {
      selectMenu: {
        backgroundColor: "#fff",
      },
    },
    // MuiSvgIcon: {
    //   root: {
    //     color: "#c3c3c3",
    //   },
    // },
    MuiTextField: {
      root: {
        backgroundColor: "#fff",
      },
    },
  },
});

export function MaterialProvider({ children }) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
