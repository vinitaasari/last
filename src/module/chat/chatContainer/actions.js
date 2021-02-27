import _ from 'lodash';

export const updateMessageStatus=()=>{
    return {
        type:"UPDATE_MESSAGE_STATUS"
    }
}

export const addOnlineUser=(data)=>{
    return {
        type:"ADD_ONLINE_USER",
        data
    }
}

export const hardReloadStaredComponent=()=>{
    return { 
        type:"HARD_RELOAD"
    }
}

export const replayMessageDisable=(data)=>{
    return {
        type:"REPLAY_MESSAGE_STATUS",
        data 
    }
}

export const replayMessageObject=(data)=>{
    return {
        type:"REPLAY_MESSAGE_ID",
        data
    }
}

export const retrieveConversation=({retrieveConversation,listMessages})=>{
    listMessages.items.reverse()
    // console.log('listMessages DATA',_.isNull(listMessages.next_token)) 
    if(_.isNull(listMessages.next_token))
    {
        listMessages.next_token={
            id:null,
            created_date:null
        }
    }

    return {
        type:"RETRIEVE_CONVERSATION",
        data:{retrieveConversation,listMessages}
    }
}

export const deleteMessageFromConversation=(message_id)=>{
    return {
        type:"DELETE_MESSAGE",
        data:message_id
    }
}

export const loadOldConversation=(data)=>{
    // let oldConversation={
    //     items:data.items.reverse(),
    //     next_token:data.next_token,
    //     __typename: data.__typename
    // }
    console.log('previous conversation action DAta',data)
    // console.log('previous conversation',oldConversation)
    return {
        type:"LOAD_OLD_CONVERSATION",
        data
    }   
}

export const addMessageToConversation=(data)=>{
    console.log('addMessageToConversation',data)

    return {
        type:"ADD_MESSAGE_TO_CONVERSATION",
        data
    }
}

export const setUserData=(data)=>{
    return {
        type:"SET_USER",
        data
    }
}

export const setChatToken=(data)=>{
    return {
        type:"SET_TOKEN",
        data
    }
}

export const setConversationList=(data)=>{
    return {
        type:"SET_CONVERSATION_LIST",
        data
    }
}