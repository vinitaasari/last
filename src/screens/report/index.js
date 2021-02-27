import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  FormHelperText,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { reportIssueSchema } from "./schema";

import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import Loader from "../../components/loader";
import AppWrapper from "../../components/app-wrapper";
import { format } from "date-fns";
import { useAuth } from "../../contexts/auth-context";
import { useUser } from "../../contexts/user-context";
import SEO from "../../components/seo";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  heading: {
    color: "#2c516c",
    fontSize: "34px",
    fontWeight: 600,
    marginBottom: "20px",
  },
  card: {
    width: "50%",
  },
  subHeading: {
    color: theme.palette.custom.title,
    fontSize: "17px",
    fontWeight: 400,
  },
  paragraph: {
    color: "#676767",
    fontSize: "16px",
    fontWeight: 400,
    marginBottom: 0,
  },
}));
const PrivacyPolicy = (props) => {
  const classes = useStyles();

  const { getUserId } = useAuth();
  const learner_id = getUserId();
  const { logout } = useAuth();
  const reportIssueApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const [subError, setSubjectError] = useState("");
  const [desError, setDesError] = useState("");

  const formik = useFormik({
    initialValues: {
      subject: "",
      description: "",
    },
    validationSchema: reportIssueSchema,
    onSubmit: (values) => {
      if (values.subject) {
        if (values.subject.replace(/\s+/g, " ").trim().length < 5) {
          setSubjectError("Subject must be more than 5 characters")
        }
        else {
          setSubjectError("");
          if (values.description) {
            if (values.description.replace(/\s+/g, " ").trim().length < 10 || values.description.replace(/\s+/g, " ").trim().length > 500) {
              setDesError("Description must be between 10 to 500 characters");
            }
            else {
              setDesError("")
              reportIssue({
                user_id: learner_id,
                entity_type: "learner",
                subject: values.subject.replace(/\s+/g, " ").trim(),
                description: values.description.replace(/\s+/g, " ").trim(),
              });
            }
          }
        }
      }

    },
  });

  const {
    touched,
    errors,
    handleSubmit,
    handleChange,
    values,
    resetForm,
  } = formik;

  const reportIssue = useCallback(async (apiBody) => {
    try {
      const res = await reportIssueApiStatus.run(
        apiClient("POST", "common", "raiseticket", {
          body: { ...apiBody },
          shouldUseDefaultToken: false,
          cancelToken: apiSource.token,
          enableLogging: true,
        })
      );

      const {
        content: { data },
      } = res;

      notification.enqueueSnackbar(res.message, {
        variant: "success",
        autoHideDuration: 2000,
      });
      resetForm();
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  }, []);
  return (
    <AppWrapper>
      <SEO
        title="Midigiworld - Report an Issue"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Container maxWidth="lg" classes={{ root: classes.container }}>
        <Typography
          variant="h4"
          component="h2"
          classes={{ root: classes.heading }}
        >
          Report An Issue
        </Typography>
        <Box mt={1}>
          <Card className={classes.card}>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Box>
                  <Typography variant="body2" className={classes.label}>
                    Subject
                  </Typography>
                  <TextField
                    name="subject"
                    onChange={handleChange}
                    value={values.subject}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    placeholder="Write here"
                    classes={{ root: classes.textInput }}
                    error={Boolean(touched.subject && errors.subject)}
                  />
                  {touched.subject && errors.subject && (
                    <FormHelperText error>{errors.subject}</FormHelperText>
                  )}
                  {
                    subError && (
                      <FormHelperText error>{subError}</FormHelperText>
                    )
                  }
                </Box>

                <Box mt={2}>
                  <Typography variant="body2" className={classes.label}>
                    Description
                  </Typography>
                  <TextField
                    name="description"
                    onChange={handleChange}
                    value={values.description}
                    variant="outlined"
                    margin="dense"
                    multiline
                    rows={6}
                    fullWidth
                    placeholder="Write here"
                    classes={{ root: classes.textInput }}
                    error={Boolean(touched.description && errors.description)}
                  />
                  {touched.description && errors.description && (
                    <FormHelperText error>{errors.description}</FormHelperText>
                  )}
                  {
                    desError && (
                      <FormHelperText error>{desError}</FormHelperText>
                    )
                  }
                </Box>

                <Box mt={2}>
                  <Button
                    disabled={reportIssueApiStatus.isPending}
                    type="submit"
                    variant="contained"
                    color="secondary"
                  >
                    {reportIssueApiStatus.isPending ? (
                      <CircularProgress size={20} color="secondary" />
                    ) : (
                        "Submit"
                      )}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </AppWrapper>
  );
};

export default PrivacyPolicy;
