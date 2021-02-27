import React, { useEffect, useState } from "react";
import { Grid, CircularProgress } from "@material-ui/core";

import OrderCard from "./OrderCard";

import { useSnackbar } from "notistack";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import EmptyState from "../../components/empty-state";
import { useAuth } from "../../contexts/auth-context";
import CustomPagination from "../../components/pagination";

import NoOrdersImage from "../../assets/images/no-orders.svg";

const RefundOrders = (props) => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useUser();
  const getOrdersApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { logout } = useAuth();

  const getOrders = async (apiBody) => {
    try {
      // eslint-disable-next-line
      const res = await getOrdersApiStatus.run(
        apiClient("POST", "stripe", "fetchalltransactions", {
          body: { ...apiBody },
          enableLogging: true,
          cancelToken: apiSource.token,
        })
      );

      const {
        content: { data },
      } = res;

      setOrders(data);
      setTotalPages(Math.ceil(res.content.totalPages));
    } catch (error) {
      if (error.code === 401) {
        logout();
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
      getOrders({
        learner_id: user.id,
        page_size: 12,
        page_number: 1,
        status: "refunded",
      });
    }
    // eslint-disable-next-line
  }, [user]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    getOrders({
      learner_id: user.id,
      page_size: 12,
      page_number: newPage,
    });
  };

  if (getOrdersApiStatus.isPending) {
    return (
      <Grid item container xs={12} justify="center">
        <CircularProgress color="primary" size={28} />
      </Grid>
    );
  }

  if (!getOrdersApiStatus.isPending && orders.length === 0) {
    return (
      <Grid item container xs={12} justify="center">
        <EmptyState image={NoOrdersImage} text="Nothing Purchased Yet!" />
      </Grid>
    );
  }

  return (
    <>
      {orders.map((order) => {
        return (
          <Grid key={order.id} item xs={12} md={6} lg={4}>
            <OrderCard order={order} />
          </Grid>
        );
      })}

      <Grid container item xs={12} justify="center">
        <CustomPagination
          page={page}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      </Grid>
    </>
  );
};

export default RefundOrders;
