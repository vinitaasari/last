import React, { useState, createContext, useContext } from "react";
import { SnackbarProvider } from "notistack";

const NotificationContext = createContext({
  maxSnack: 2,
  changeMaxSnack: () => {},
});

function NotificationProvider({ children }) {
  const [maxSnack, setMaxSnack] = useState(1);

  const changeMaxSnack = (number) => {
    setMaxSnack(number);
  };

  return (
    <NotificationContext.Provider value={{ maxSnack, changeMaxSnack }}>
      <SnackbarProvider maxSnack={maxSnack}>{children}</SnackbarProvider>
    </NotificationContext.Provider>
  );
}

function useNotification() {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(`useNotification must be used within a UserProvider`);
  }

  return context;
}

export { NotificationProvider, useNotification };
