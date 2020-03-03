import React from "react";
import App from "./App";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const WEB_LINK = "wetubevideos.herokuapp.com/";

const port = process.env.PORT || 5000;

const httpLink = new HttpLink({
  uri: "https://" + WEB_LINK + port
});

const wsLink = new WebSocketLink({
  uri: "wss://" + WEB_LINK + "graphql",
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: async () => {
      setContext(() => {
        const token = localStorage.getItem("jwtToken");
        return {
          headers: {
            Authorization: token ? `Bearer ${token}` : ""
          }
        };
      });
    }
  }
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: link,
  onError: e => {
    console.log(e);
  },
  cache: new InMemoryCache()
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
