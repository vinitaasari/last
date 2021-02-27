import client from "./client";

export const gqlClient = {
  query: (query, variables, ...args) => {
    return client.query({
      query: query,
      fetchPolicy: "network-only",
      variables: variables,
      ...args[0],
    });
  },
  mutate: (query, variables, ...args) => {
    return client.mutate({ mutation: query, variables: variables, ...args[0] });
  },
  subscribe: (query, ...args) => {
    return client.subscribe({
      query: query,
      ...args[0],
    });
  },
};
