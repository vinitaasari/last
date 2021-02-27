/* eslint-disable */
import React, { useState, useEffect, createContext, useContext } from "react";

// import auth context
import { useAuth } from "./auth-context";
import { apiClient } from "../utils/api-client";
import { useSnackbar } from "notistack";

// create context
const UserContext = createContext({
  user: null,
  setUser: () => { },
  profile_image: null,
  setProfileImage: () => { },
  setFilter: () => { },
  noti: null,
  setNoti: () => { },
});

// Context Provider
function UserProvider(props) {
  const [userData, setUserData] = useState(null);
  const [profile_image, setProfileImage] = useState(null);
  const [filters, setFilters] = useState(null)
  const notification = useSnackbar();

  const [noti, setNoti] = useState(null)
  // use location hook and get current url path
  // const location = useLocation();
  // const history = useHistory();

  // grab get user details api
  const {
    getUserEmail,
    getUserId,
    getUserToken,
    getUserDetails,
    setUserDetails,
  } = useAuth();

  const createCustomer = async (apiBody) => {
    try {
      const res = await apiClient("POST", "stripe", "createcustomer", {
        body: apiBody,
        shouldUseDefaultToken: true,
      });

      const details = getUserDetails();

      setUserData({ ...details, customer_id: res.content.data.id, authenticated: true });
      setUserDetails({ ...details, customer_id: res.content.data.id });
      notification.enqueueSnackbar(res.message, {
        variant: "success",
        autoHideDuration: 2000,
      });
    } catch (error) {
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
      console.error(error);
    }
  };

  // grab user on page refresh
  useEffect(() => {
    // run the getUserDetails function

    try {
      const email = getUserEmail();
      const id = getUserId();
      const token = getUserToken();
      const details = getUserDetails();

      if (email && id && token && details) {
        setUserData({
          // email,
          // id,
          // token,
          ...details,
          authenticated: true,
        });
      } else {
        setUserData({
          authenticated: false,
        });
      }
    } catch (error) {

      // handle error
      setUserData({
        authenticated: false,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData && !userData.customer_id && userData.id) {
      createCustomer({ learner_id: userData.id });
    }
  }, [userData]);

  return (
    <UserContext.Provider
      value={{
        user: userData,
        setUser: setUserData,
        profile_image: profile_image,
        setProfileImage: setProfileImage,
        filters: filters,
        setFilters: setFilters,
        noti: noti,
        setNoti: setNoti
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

// custom hook
function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`);
  }

  return context;
}

export { UserProvider, useUser };
