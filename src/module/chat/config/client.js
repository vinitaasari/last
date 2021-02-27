import AWSAppSyncClient, { createAppSyncLink } from "aws-appsync";
import appSyncConfig from "./aws-exports";
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
// import { useUser } from "../../../contexts/user-context";

// const userData =useUser();

const Config = {
  url: appSyncConfig.aws_appsync_graphqlEndpoint,
  region: appSyncConfig.aws_appsync_region,
  auth: {
    type: appSyncConfig.aws_appsync_authenticationType,
    apiKey: appSyncConfig.aws_appsync_apiKey,
  },
};
const client = new AWSAppSyncClient(Config, {
  link: createAppSyncLink({
    ...Config,
    disableOffline: true,
    resultsFetcherLink: ApolloLink.from([
      setContext((request, previousContext) => ({
        headers: {
          ...previousContext.headers,
          "channel":"web",
          "user_id":localStorage.getItem('user_id')
          // "app_id": process.env.REACT_APP_APP_API_ID,
          // "api_key": process.env.REACT_APP_APP_API_KEY
        },
      })),
      createHttpLink({
        uri: Config.url,
      }),
    ]),
  }),
});

export default client;
