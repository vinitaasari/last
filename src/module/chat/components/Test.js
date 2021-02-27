import React from 'react'
import { useSelector } from 'react-redux'

function Test() {
    const data=useSelector(state=>{
        console.log(state)
    })

    return (
        <div>
            TEST COMPONENT
        </div>
    )
}

export default React.memo(Test) 
