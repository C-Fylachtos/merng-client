import React from "react";
import App from "./App";
import { onError } from "apollo-link-error";
import { setContext } from "apollo-link-context";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

const httpLink = createHttpLink({
  uri: "https://hidden-temple-99005.herokuapp.com/",
  onError: ({ networkError, graphQLErrors }) => {
    console.log("graphQLErrors", graphQLErrors);
    console.log("networkError", networkError);
  },
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
