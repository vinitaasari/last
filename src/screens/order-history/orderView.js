import React from "react";
import { Link } from "react-router-dom";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Truncate from "react-truncate";
import Pluralize from "react-pluralize";
import { useHistory } from "react-router-dom"
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
    media: {
        height: 86,
        width: 86,
        borderRadius: "5px",
    },
    cardContent: {
        display: "flex",
        alignItems: "center",
    },
    courseName: {
        color: "#393A45",
        fontSize: "16px",
        fontWeight: 600,
    },
    courseDescription: {
        color: "#393A45",
        fontSize: "14px",
        fontWeight: 500,
    },
    date: {
        color: "#393A45",
        fontSize: "14px",
        fontWeight: 400,
    },
    orderId: {
        color: "#393A45",
        fontSize: "14px",
        fontWeight: 400,
    },
    ctaContainer: {
        padding: "10px 16px",
        borderTop: "1px solid #E7E7EA",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headingContainer: {
        padding: "10px 16px",
        borderBottom: "1px solid #E7E7EA",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ctaText: {
        color: "#F05E23",
        fontSize: "14px",
        fontWeight: 500,
    },
    slotsText: {
        color: "#393A45",
        fontSize: "14px",
        fontWeight: 400,
    },
    discountedPriceContainer: {
        display: "inline-block",
        backgroundColor: "#E2EAFA",
        padding: theme.spacing(0.5, 2),
        borderRadius: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    discountedPrice: {
        color: "#03579C",
        fontSize: "16px",
        fontWeight: 600,
    },
    statusText: {
        color: "#479b00",
        fontSize: "16px",
        fontWeight: 600,
        textTransform: "capitalize",
    },
}));

const OrderCard = ({ order, transaction_time, transaction_id, id, status }) => {
    const classes = useStyles();
    const history = useHistory();
    var dateAndTime;
    var transaction_id;
    var id;
    var status;
    dateAndTime = transaction_time
        ? format(new Date(transaction_time * 1000), "MMM dd, yyyy hh:mm a")
        : "";
    transaction_id = history.location.state.transaction_id;
    id = history.location.state.id;
    status = history.location.state.status;


    return (
        <Card>
            <CardActionArea>
                <CardContent classes={{ root: classes.headingContainer }}>
                    <Typography classes={{ root: classes.date }}>
                        {dateAndTime}
                    </Typography>

                </CardContent>
                <CardContent classes={{ root: classes.cardContent }}>
                    <Box>
                        <img
                            src={order.slot_course.image_url}
                            alt="Course Thumbnail"
                            className={classes.media}
                        />
                    </Box>
                    <Box ml={2} width="100%">
                        <Typography classes={{ root: classes.courseName }}>
                            <Truncate lines={1} ellipsis={<span>...</span>}>
                                {order.slot_course.title}
                            </Truncate>
                        </Typography>
                        <Typography classes={{ root: classes.courseDescription }}>
                            <Truncate lines={1} ellipsis={<span>...</span>}>
                                {order.slot_course.tag_line}
                            </Truncate>
                        </Typography>
                        <Box
                            mt={1}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box className={classes.discountedPriceContainer}>
                                <Typography
                                    varaint="body2"
                                    classes={{ root: classes.discountedPrice }}
                                >
                                    <span>&#x20B9; {order.slot_course.purchasing_amount || ""}</span>
                                </Typography>
                            </Box>
                            <Typography className={classes.statusText}>
                                {status || ""}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
                <CardContent classes={{ root: classes.ctaContainer }}>
                    <Typography classes={{ root: classes.orderId }}>
                        {id || ""}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default OrderCard;
