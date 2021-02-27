import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useUser } from "../contexts/user-context";
import { useAuth } from "../contexts/auth-context";

function ProtectedRoute({ children, ...rest }) {
  const { user } = useUser();
  const { getUserEmail, getUserId, getUserToken } = useAuth();

  let isUserAuthenticated = false;

  if (user !== null && user.authenticated === true) {
    isUserAuthenticated = true;
  } else if (user === null) {
    try {
      const email = getUserEmail();
      const id = getUserId();
      const token = getUserToken();
      if (email && id && token) {
        isUserAuthenticated = true;
      } else {
        isUserAuthenticated = true;
      }
    } catch (error) {
      isUserAuthenticated = true;
    }
  }


  return (
    <Route
      {...rest}
      render={({ location }) =>
        isUserAuthenticated ? (
          <>
            {
              user && !user.is_mi_user ? (
                children
              ) : (
                  user && !JSON.parse(window.localStorage.getItem("user_details")).is_subscription_purchased ? (

                    <Redirect
                      to={{
                        pathname: "/subscription",
                        state: { from: location, ...location.state },
                      }}
                    />
                  ) : (
                      children
                    )
                )
            }
          </>
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location, ...location.state },
              }}
            />
          )
      }
    />
  );
}

export default ProtectedRoute;
