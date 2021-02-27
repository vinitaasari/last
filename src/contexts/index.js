import React from "react";

import { AuthProvider } from "./auth-context";
import { UserProvider } from "./user-context";
import { MaterialProvider } from "./material-ui-context";
import { NotificationProvider } from "./notification-context";
import { StripeProvider } from "./stripe-context";
import { Provider } from "react-redux";
import store from "../store";

function AppProviders({ children }) {
  return (
    <Provider  store={store}>
    <AuthProvider>
      <UserProvider>
        <MaterialProvider>
          <NotificationProvider>
            <StripeProvider>{children}</StripeProvider>
          </NotificationProvider>
        </MaterialProvider>
      </UserProvider>
    </AuthProvider>
    </Provider>
  );
}

export default AppProviders;
