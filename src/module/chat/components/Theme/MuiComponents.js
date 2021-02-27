import React from 'react';
import { Input, makeStyles } from "@material-ui/core";

const useStyles=makeStyles({
    root:{ 
        border: "2px solid #d9dfe5",
        backgroundColor: "#fafcfd", 
        borderRadius: "4px",
        width:"100%",
        fontSize: "13px",
        height: "34px"
    }, 
    
})

const ChatTextField=React.memo((props)=>{
    const classes=useStyles()
    
    return (
        <Input onChange={props.onChange} disableUnderline={true} className={classes.root} {...props}/>
    )
}) 

export {ChatTextField}
