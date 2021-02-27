import { Grid } from '@material-ui/core'
import React from 'react'
import Header from '../../components/Layout/Header'

function Chat() {
    return (
        <>
            <Header pageTitle="Messages" />
            
            <Grid container style={{padding:"10px",bottom:"0px",width:"89%",position:"absolute",height:"85%"}}>
                <Grid sm={3} style={{backgroundColor:"red"}}>
                    Chat List
                </Grid>
                <Grid sm={9} style={{backgroundColor:"green"}}>
                    Conversaiton
                </Grid>
            </Grid>
        </>
    )
}

export default Chat
