import React, { useState, useEffect } from "react";
import Chat from "./components/Chat";
import { appSync } from "./GraphQL/schema";
import store from "../../store";
import { setUserData } from "./chatContainer/actions";
import _ from "lodash";
import { useSelector } from "react-redux";
import { gqlClient } from "./config/request-client";
import { useAuth } from "../../contexts/auth-context";
import SEO from "../../components/seo";
// import Header from "../../components/Layout/Header";
// const GET_USER = gql(appSync.queries.getUser());

function ChatClient(props) {
  const [loading, setLoading] = useState(true);
  const authData = useAuth();
  const { chatUserData } = useSelector((state) => {
    return {
      chatUserData: state.chatContainer.userData,
    };
  });

  // useEffect(() => {
  //   if (_.isEmpty(chatUserData)) setLoading(false);
  // }, [chatUserData]);

  useEffect(() => {
    store.dispatch(setUserData({ id: authData.getUserId() }));

    // gqlClient
    //   .query(GET_USER, { email: "mukul@yopmail.com" })
    //   .then(({ data: { getUser }, loading }) => {
    //     store.dispatch(setUserData(getUser));
    //   })
    //   .catch((er) => {
    //     setLoading(true);
    //   });
    setLoading(false);
  }, []);

  return (
    <>
      <SEO
        title="Midigiworld - Messages"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      {/* <Header pageTitle="Messages" /> */}
      {loading ? "loading..." : <Chat userData={chatUserData} />}
    </>
  );
}

export default ChatClient;
