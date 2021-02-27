import _ from 'lodash'

const initalState = {
  userData: {},
  chatToken: {},
  chatData: {
    retrieveConversation: { 
      name: "Welcome",
      profile_url: "www",
    },
    listMessages: {
      items: [],
      next_token: {
        id: null,
        created_date: null,
      },
    },
  },
  conversationList: {
    items: [],
  },
  chatDataloading: true,
  replayMessageObject: {
    message_id: null,
    replayStatus: false,
  },
  hardReloadStaredComponent:false,
  onlineUsers:[]
};

function chatHandler(state = initalState, action) {
  
  switch (action.type) {
    case "UPDATE_MESSAGE_STATUS":
      let updatedMessageStatus=state.chatData.listMessages.items.map((message) => {
        return {
          ...message,
          status: "seen",
        };
      });

      console.log('updated Message Status Action Called: ',state.chatData.listMessages)
      return {
        ...state,
        chatData:{
          ...state.chatData,
          listMessages:{
            ...state.chatData.listMessages,
            items:updatedMessageStatus
          }
        }
      }

    case "ADD_ONLINE_USER":
      console.log("action.data: ", action.data);
      return {
        ...state,
        onlineUsers:[
          ...state.onlineUsers,
          action.data
        ]
      }
    case "HARD_RELOAD":
      return {
        ...state,
        hardReloadStaredComponent:!state.hardReloadStaredComponent
      }
    case "REPLAY_MESSAGE_STATUS":
      return {
        ...state,
        replayMessageObject: {
          ...state.replayMessageObject,
          replayStatus: action.data,
        },
      };
    case "REPLAY_MESSAGE_ID":
      return {
        ...state,
        replayMessageObject: {
          message:action.data,
          replayStatus: true,
        },
      };
    case "LOAD_OLD_CONVERSATION":
      let nextToken=action.data.next_token;
      let messagesList=action.data.items;
      
      console.log('LOAD_OLD_CONVERSATION CHAT DATA NEXT TOKEN: ',action.data)
      if(_.isNull(action.data.next_token))
      {
        console.log('ASKDn NEXT TOKEN: ',action.data.next_token)
        nextToken={
          created_date:null,
          id:null
        }
      }

      if(_.isNull(action.data.items)){
        messagesList=[]
      }

      return {
        ...state,
        chatData: {
          ...state.chatData,
          listMessages: {
            items: [...messagesList, ...state.chatData.listMessages.items],
            next_token: {
              ...nextToken
            },
          },
        },
      };
    // return {
    //   ...state,
    //   chatData:{
    //     ...state.chatData,
    //     listMessages:{
    //       items:[
    //         action.data,
    //         ...state.chatData.listMessages.items
    //       ],
    //       next_token:{
    //         ...action.data.next_token
    //       }
    //     }
    //   }
    // }
    case "SET_CONVERSATION_LIST":
      return {
        ...state,
        conversationList: action.data,
      };

    case "SET_TOKEN":
      return {
        ...state,
        chatToken: action.data,
      };

    case "SET_USER":
      return {
        ...state,
        userData: action.data,
      };

    case "Loading":
      return {
        ...state
      }  

    case "RETRIEVE_CONVERSATION":
      return {
        ...state,
        chatData: action.data,
        chatDataloading: false,
      };

    case "ADD_MESSAGE_TO_CONVERSATION":
      return {
        ...state,
        chatData: { 
          retrieveConversation: {
            ...state.chatData.retrieveConversation,
          },
          listMessages: {
            items: [...state.chatData.listMessages.items, action.data],
            next_token: {
              ...state.chatData.listMessages.next_token,
            },
          },
        },
      };

    default:
      return state;
  }
}

export default chatHandler;
