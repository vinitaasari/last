import React, { useEffect, useState } from "react";
import { CircularProgress, Grid } from "@material-ui/core";

import SubscriptionCard from "./SubscriptionCard";

import { useSnackbar } from "notistack";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import EmptyState from "../../components/empty-state";
import NoOrdersImage from "../../assets/images/no-orders.svg";
import { useAuth } from "../../contexts/auth-context";


const ActiveSubscriptions = (props) => {
  const [subscriptions, setSubscriptions] = useState([]);

  const { user } = useUser();
  const getSubscriptionsApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { logout } = useAuth();


  const getSubscriptions = async (apiBody) => {
    try {
      // eslint-disable-next-line
      const res = await getSubscriptionsApiStatus.run(
        apiClient("POST", "subscription", "fetchallsubscriptiontransactions", {
          body: { ...apiBody },
          enableLogging: true,
          cancelToken: apiSource.token,
        })
      );

      const {
        content: { data },
      } = res;
      console.log(data)

      setSubscriptions(data);
    } catch (error) {
      if (error.code === 401) {
        logout()
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  useEffect(() => {
    // because it requires user to be logged in
    if (user && user.authenticated === true) {
      getSubscriptions({
        learner_id: user.id,
        page_size: 20,
        status: 'expired',
        page_number: 1,
      });
    }
    // eslint-disable-next-line
  }, [user]);

  if (getSubscriptionsApiStatus.isPending) {
    return (
      <Grid item container xs={12} justify="center">
        <CircularProgress color="primary" size={28} />
      </Grid>
    );
  }

  // if (!getSubscriptionsApiStatus.isPending && subscriptions.length === 0) {
  //   return (
  //     <Grid item container xs={12} justify="center">
  //       <EmptyState image={NoOrdersImage} text="Nothing Purchased Yet!" />
  //     </Grid>
  //   );
  // }

  return (
    <>

      {subscriptions.map((subscription) => {
        return (
          <Grid key={subscription.id} item xs={12} md={6} lg={5}>
            <SubscriptionCard subs={subscription} />
          </Grid>
        );
      })}
    </>
  );
};

export default ActiveSubscriptions;
