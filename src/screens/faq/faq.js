import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  CircularProgress,
  Card,
  Paper,
  Typography,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Search } from "@material-ui/icons";
import CustomCarousel from "../../components/carousel";

import { useSnackbar } from "notistack";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import AppWrapper from "../../components/app-wrapper";
import { useAuth } from "../../contexts/auth-context";
import { useUser } from "../../contexts/user-context";
import SEO from "../../components/seo";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  heading: {
    color: "#2c516c",
    fontSize: "32px",
    fontWeight: 600,
  },
  searchField: {
    marginTop: theme.spacing(3),
    maxWidth: "562px",

    "& .MuiOutlinedInput-root": {
      background: "#fff",
    },
  },
  notchedOutline: {
    borderColor: `${theme.palette.custom.inputBorder} !important`,
  },
  icon: {
    color: theme.palette.custom.icon,
  },
  sectionHeading: {
    color: "#3F3F3F",
    fontSize: "20px",
    fontWeight: 600,
  },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: theme.spacing(1),
    height: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    cursor: "pointer",
  },
  categoryTitle: {
    fontSize: "18px",
    fontWeight: 600,
  },
  faqContainer: {
    padding: theme.spacing(4),
    borderBottom: "1px solid #C9C9C9",

    "&:last-of-type": {
      borderBottom: "none",
    },
  },
  faqQuestion: {
    color: "#2D2F39",
    fontSize: "18px",
    fontWeight: 600,
  },
  faqAnswer: {
    color: "#797474",
    fontSize: "16px",
    fontWeight: 400,
  },
}));

const Faq = (props) => {
  const classes = useStyles();
  const [searchString, setSearchString] = useState("");
  const [faqCategories, setFaqCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [faqs, setFaqs] = useState([]);

  const faqApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { logout } = useAuth();
  const { setNoti } = useUser();

  const getFaqCategories = async (apiBody) => {
    try {
      const res = await faqApiStatus.run(
        apiClient("POST", "cms", "getfaqcategories", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      const {
        content: { data },
      } = res;

      setFaqCategories(data);
      // setTotalPages(Math.floor(totalPages))
      if (data.length > 0) {
        setActiveCategory(data[0]);
        getFaqsOfCategory({
          page_size: 10,
          page_number: 1,
          faq_category_id: data[0].id,
          user_type: "learner",
        });
      }
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

  const getFaqsOfCategory = async (apiBody) => {
    try {
      const res = await faqApiStatus.run(
        apiClient("POST", "cms", "getfaq", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
          enableLogging: true,
        })
      );

      const {
        content: { data },
      } = res;

      setFaqs(data);
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
    setNoti(Math.random());

    getFaqCategories({ page_size: 10, page_number: 1, entity_type: "learner" });
    // eslint-disable-next-line
  }, []);

  const changeActiveCategory = (category) => {
    setSearchString("");
    if (activeCategory.id !== category.id) {
      setActiveCategory(category);
      getFaqsOfCategory({
        page_size: 10,
        page_number: 1,
        faq_category_id: category.id,
        user_type: "learner",
      });
    }
  };
  const searchFaqs = (event) => {
    setSearchString(event.target.value);

    if (event.target.value) {
      getFaqsOfCategory({
        page_size: 10,
        page_number: 1,
        faq_category_id: activeCategory.id,
        user_type: "learner",
        search_string: event.target.value,
      });
    } else {
      getFaqsOfCategory({
        page_size: 10,
        page_number: 1,
        faq_category_id: activeCategory.id,
        user_type: "learner",
      });
    }
  };

  return (
    <AppWrapper>
      <SEO
        title="Midigiworld - FAQs"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Container maxWidth="lg" classes={{ root: classes.container }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography
            variant="h4"
            component="h2"
            classes={{ root: classes.heading }}
          >
            How can we help you?
          </Typography>

          <TextField
            value={searchString}
            onChange={searchFaqs}
            variant="outlined"
            margin="dense"
            fullWidth
            placeholder="Type keyword to find answers"
            className={classes.searchField}
            InputProps={{
              classes: { notchedOutline: classes.notchedOutline },
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" className={classes.icon} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box mt={6}>
          <CustomCarousel
            noPadding={true}
            heading={
              <Typography
                variant="body1"
                classes={{ root: classes.sectionHeading }}
              >
                By Categories
              </Typography>
            }
            itemsToDisplay={5}
          >
            {faqCategories.map((category) => {
              return (
                <Box key={category.id} pr={1}>
                  <Paper
                    variant="outlined"
                    classes={{ root: classes.categoryCard }}
                    onClick={() => changeActiveCategory(category)}
                    style={{
                      borderColor:
                        category.id === activeCategory.id
                          ? "#05589C"
                          : "#ADADAD",
                      borderWidth:
                        category.id === activeCategory.id ? "2px" : "1px",
                    }}
                  >
                    <Typography
                      classes={{ root: classes.categoryTitle }}
                      style={{
                        color:
                          category.id === activeCategory.id
                            ? "#05589C"
                            : "#727272",
                      }}
                    >
                      {category.name}
                    </Typography>
                  </Paper>
                </Box>
              );
            })}
          </CustomCarousel>
        </Box>

        <Box mt={4} mb={6}>
          <Card>
            {faqApiStatus.isPending ? (
              <Box textAlign="center" className={classes.faqContainer}>
                <CircularProgress color="primary" size={24} />
              </Box>
            ) : faqs.length > 0 ? (
              faqs.map((faq) => {
                return (
                  <Box key={faq.id} className={classes.faqContainer}>
                    <Typography classes={{ root: classes.faqQuestion }}>
                      {faq.question}
                    </Typography>
                    <Typography classes={{ root: classes.faqAnswer }}>
                      {faq.answer}
                    </Typography>
                  </Box>
                );
              })
            ) : (
              <Box textAlign="center" className={classes.faqContainer}>
                <Typography classes={{ root: classes.faqAnswer }}>
                  No FAQs are present for this category
                </Typography>
              </Box>
            )}
          </Card>
        </Box>
      </Container>
    </AppWrapper>
  );
};

export default Faq;
