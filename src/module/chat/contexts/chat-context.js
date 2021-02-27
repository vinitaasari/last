import React, { createContext, useContext } from "react";

const ChatCtx = createContext({
    loading:()=>{},
    activeConversationId:null,
    refreshConversation:()=>{},
    updateLastEditedMessageConversationList:()=>{},
    deleteMessageConversationList:()=>{}
});


const ChatRootCtx = createContext();

function ChatContextProvider(props) {
  return (
    <div>
      <ChatCtx.Provider>{props.children}</ChatCtx.Provider>
    </div>
  );
}


function ChatRootContextProvider(props) {
  return (
    <div>
      <ChatRootCtx.Provider>{props.children}</ChatRootCtx.Provider>
    </div>
  );
}

const useChatContext = () => {
  const context = useContext(ChatCtx);

  if (context === undefined) {
    throw new Error(`useChatContext must be used within a ChatContextProvider`);
  }

  return context;
};


const useChatRootContext = () => {
  const context = useContext(ChatRootCtx);

  if (context === undefined) {
    throw new Error(`useChatContext must be used within a ChatContextProvider`);
  }

  return context;
};

export { ChatContextProvider, useChatContext,useChatRootContext,ChatRootContextProvider};
