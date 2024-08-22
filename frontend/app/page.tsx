"use client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import TableSwitcher from "@/components/TableSwitcher";

const { BACKEND_URL } = process.env;

const client = new ApolloClient({
  uri: `http://localhost:4000/graphql`,
  cache: new InMemoryCache(),
});

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <TableSwitcher />
    </ApolloProvider>
  );
}
