import React, { useEffect } from "react";
import { Container, Grid, Box, Typography } from "@material-ui/core";
import { Route, NavLink, useRouteMatch, Redirect } from "react-router-dom";
import AppWrapper from "../../components/app-wrapper";
import { useUser } from "../../contexts/user-context"
import AllOrders from "./AllOrders";
import PaidOrders from "./PaidOrders";
import RefundOrders from "./RefundOrders";
import FailedOrders from "./FailedOrders";
import OrderCard from "./orderView"
import { useHistory } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing(2),
    },
}));
function OrderHistory() {
    const match = useRouteMatch();
    const classes = useStyles();
    const { setNoti } = useUser();
    const history = useHistory();
    const [spacing, setSpacing] = React.useState(4);
    useEffect(() => {
        setNoti(Math.random())
        // eslint-disable-next-line
    }, []);
    return (
        <AppWrapper>
            <Container maxWidth="lg" classes={{ root: classes.container }}>
                {/* <Grid item xs={12}> */}
                <Grid container justify="center" style={{ marginTop: '50px' }} spacing={spacing}>
                    {history.location && history.location.state && history.location.state.sessions.map((order) => {
                        return (

                            <Grid key={order.id} item xs={4}>
                                <OrderCard order={order} transaction_id={history.location.state.transaction_id}
                                    transaction_time={history.location.state.transaction_time}
                                    status={history.location.state.status} />
                            </Grid>

                        );
                    })}
                    {/* </Grid> */}
                </Grid>
            </Container>
        </AppWrapper>
    );
}

export default OrderHistory;
