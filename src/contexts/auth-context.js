import React, { createContext, useContext } from "react";
import { useHistory } from "react-router-dom";

import { USER_EMAIL, USER_TOKEN, USER_ID, USER_DETAILS, USER_NAME } from "../constants/";

import { apiClient } from "../utils/api-client";

const AuthContext = createContext({
  getUserEmail: () => { },
  getUserToken: () => { },
  setUserDetails: () => { },
  getUserDetails: () => { },
  logout: () => { },
});

// Declare Auth provider
function AuthProvider(props) {
  // get user email
  function getUserEmail() {
    return window.localStorage.getItem(USER_EMAIL);
  }
  const history = useHistory()
  // get user token
  function getUserToken() {
    return window.localStorage.getItem(USER_TOKEN);
  }

  function getUserId() {
    return window.localStorage.getItem(USER_ID);
  }

  function getUserName() {
    return window.localStorage.getItem(USER_NAME);
  }

  function getUserDetails() {
    const details = window.localStorage.getItem(USER_DETAILS);

    if (details) {
      return JSON.parse(details);
    }
    return null;
  }

  // const getUserDetails = () => window.localStorage.getItem(USER_DETAILS);
  const setUserDetails = (obj) => {
    window.localStorage.setItem(USER_ID, obj.id);
    window.localStorage.setItem(USER_NAME, obj.name);
    window.localStorage.setItem(USER_EMAIL, obj.email);
    window.localStorage.setItem(USER_TOKEN, obj.secret);
    window.localStorage.setItem(USER_DETAILS, JSON.stringify(obj));
  };

  const logout = () => {
    try {
      const apiBody = {}
      const res = (
        apiClient("POST", "learner", "logout", {
          body: { ...apiBody },
          // enableLogging: true,
          shouldUseDefaultToken: false,
          // cancelToken: searchApiSource.token,
        })
      );
      window.localStorage.clear();
      window.location.pathname = "/login";

    } catch (error) {
      if (error.code === 401) {
        window.localStorage.clear();
        window.location.pathname = "/login";
      }
    }

  };

  return (
    <AuthContext.Provider
      value={{
        getUserEmail,
        getUserToken,
        getUserId,
        getUserDetails,
        setUserDetails,
        getUserName,
        logout,
        // login,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// custom hook
function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }

  return context;
}

export { AuthProvider, useAuth };
