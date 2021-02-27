import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import store from "../../../store";
import { setChatToken } from "../chatContainer/actions";
import { encryptor } from "../../../utils/encryption-decryption";
import { useAuth } from "../../../contexts/auth-context";
import { ChatContextProvider, ChatRootContextProvider } from "../contexts/chat-context";
import AppWrapper from "../../../components/app-wrapper";

// const CREATE_TOKEN = gql(appSync.mutations.createToken());

function Chat(props) {
  const [start, setStart] = useState(false);
  const authData = useAuth();

  // encrypt the request
  const createBuffer = (apiBody) => {
    const encodeBuffer = Buffer.from(JSON.stringify(apiBody));
    return encodeBuffer + "";
  };

  // generate SHA2
  const generateSHA2 = (encodeBuffer) => {
    return encryptor(authData.getUserToken(), encodeBuffer);
  };

  const getToken = () => {
    const buffer = createBuffer({
      channel: "web",
      user_id: localStorage.getItem("user_id"),
    });

    const signature = generateSHA2(buffer);
    console.log(signature);
    store.dispatch(setChatToken({ token: signature }));
    setStart(true);
  };

  useEffect(()=>{
    getToken()
  },[])

  return (
      <AppWrapper>
      {start ? (
        <ChatRootContextProvider>
          <ChatBox />
        </ChatRootContextProvider>
      ) : (""
      )}
      </AppWrapper>
  );
}

export default Chat;
