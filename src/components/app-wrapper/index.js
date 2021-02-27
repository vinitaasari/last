import React from "react";

import Header from "../header";
import Footer from "../footer";
import { useStyles } from "./styles";

function AppWrapper({ children, hideFooter }) {
  const classes = useStyles();
  return (
    <main className={classes.main}>
      <header className={classes.header}>
        <Header />
      </header>
      <div className={classes.content}>
        {children}
        {!hideFooter && <Footer />}
      </div>
    </main>
  );
}

export default AppWrapper;
