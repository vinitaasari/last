import React from "react";
import { Grid, Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import * as dateFns from "date-fns";
import DateWiseDetails from "./DateWiseDetails";
import { courseDetail as useStyles } from "./styles";
import { useHistory } from "react-router-dom";
import NotFound from "../../assets/images/NotFound.png";

const CurriculumInfo = ({
  cadenceDetails = [],
  sessions = [],
  onCadenceSelect = () => {},
  sessionsApi,
}) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <>
      {history.location &&
      history.location.state &&
      history.location.state.details ? (
        <Grid item xs={12} alignItems="center" style={{ marginTop: "16px" }}>
          {cadenceDetails.map((item) => (
            <Box
              mr={2}
              style={{ display: item.isSelected ? null : "none" }}
              className={` ${
                item.isSelected
                  ? classes.activeSlotContainer
                  : classes.slotContainer
              }`}
              key={item.id}
              onClick={() => {
                onCadenceSelect(item.id);
              }}
            >
              <Typography varaint="body2" classes={{ root: classes.slotName }}>
                {item.title}
              </Typography>
              <Typography
                varaint="body2"
                classes={{ root: classes.slotDuration }}
              >
                {`${dateFns.format(
                  item.cadenceStartDateObj,
                  "dd MMM"
                )} - ${dateFns.format(item.cadenceEndDateObj, "dd MMM")}`}
              </Typography>
            </Box>
          ))}
        </Grid>
      ) : (
        <Grid item xs={12} alignItems="center" style={{ marginTop: "16px" }}>
          {cadenceDetails.map((item) => (
            <Box
              mr={2}
              className={` ${
                item.isSelected
                  ? classes.activeSlotContainer
                  : classes.slotContainer
              }`}
              key={item.id}
              onClick={() => {
                onCadenceSelect(item.id);
              }}
            >
              <Typography varaint="body2" classes={{ root: classes.slotName }}>
                {item.title}
              </Typography>
              <Typography
                varaint="body2"
                classes={{ root: classes.slotDuration }}
              >
                {`${dateFns.format(
                  item.cadenceStartDateObj,
                  "dd MMM"
                )} - ${dateFns.format(item.cadenceEndDateObj, "dd MMM")}`}
              </Typography>
            </Box>
          ))}
        </Grid>
      )}

      <Grid item xs={12}>
        {sessionsApi.isPending ? (
          <Box mt={2} mb={2}>
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="50%" />
          </Box>
        ) : (
          sessions.map((item) => (
            <DateWiseDetails
              key={item.id}
              sessionDetails={item}
              history={history}
            />
          ))
        )}
      </Grid>
      {cadenceDetails.length === 0 && (
        <div style={{ marginLeft: "40%", marginBottom: "10%" }}>
          <img src={NotFound}></img>
          <Typography>No Curriculum Yet!</Typography>
        </div>
      )}
    </>
  );
};

export default CurriculumInfo;
