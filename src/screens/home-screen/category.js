import React, { useState, useEffect, useCallback } from "react";
import { Box, Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Forum } from "@material-ui/icons";
import CustomCarousel from "../../components/carousel";
import CategoryCard from "./category-card";

import { useSnackbar } from "notistack";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import { useAuth } from "../../contexts/auth-context"
import Loader from "../../components/loader";

const useStyles = makeStyles((theme) => ({
  sectionHeading: {
    color: "#3F3F3F",
    fontSize: "26px",
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "22px",
    },
  },
}));

const Category = (props) => {
  const classes = useStyles();

  const [categories, setCategories] = useState([]);
  const categoryApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { logout } = useAuth()

  const getCategories = useCallback(async () => {
    try {
      const res = await categoryApiStatus.run(
        apiClient("POST", "course_setting", "getcoursecategory", {
          body: { is_admin: false, page_size: 100, page_number: 1 },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      const {
        content: { data },
      } = res;

      setCategories(data.response);
    } catch (error) {
      if (error.code === 401) {
        logout()
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <CustomCarousel
      heading={
        <Typography variant="body1" classes={{ root: classes.sectionHeading }}>
          Explore Categories
        </Typography>
      }
      itemsToDisplay={5}
    >
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </CustomCarousel>
  );
};

export default Category;
