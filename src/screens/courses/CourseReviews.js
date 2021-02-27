import React from "react";
import { Box, Typography } from "@material-ui/core";
import { Star } from "@material-ui/icons";

import CustomCarousel from "../../components/carousel";
import EmptyState from "../../components/empty-state";
import ReviewCard from "./ReviewCard";
import { courseDetail as useStyles } from "./styles";
import NoReviewsImage from "../../assets/images/no-reviews.svg";

const CourseReviews = ({
  reviews,
  courseRating,
  totalCourseRating,
  itemsToDisplay = 2,
}) => {
  const classes = useStyles();

  return (
    <Box mt={2}>
      {reviews && reviews.length > 0 ? (
        <CustomCarousel
          noPadding
          heading={
            <Box display="flex" alignItems="center">
              <Star style={{ fontSize: 20, color: "#FFB833" }} />
              <Typography
                varaint="caption"
                classes={{ root: classes.ratingText }}
              >
                {courseRating <= 0
                  ? "New"
                  : `${courseRating} (${totalCourseRating} Reviews)`}
              </Typography>
            </Box>
          }
          itemsToDisplay={itemsToDisplay}
        >
          {reviews.map((review) => {
            return <ReviewCard key={review.id} review={review} />;
          })}
        </CustomCarousel>
      ) : (
          <Box display="flex" alignItems="center" justifyContent="center">
            <EmptyState image={NoReviewsImage} text="No reviews yet" />
          </Box>
        )}
    </Box>
  );
};

export default CourseReviews;
