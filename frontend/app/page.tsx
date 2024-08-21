"use client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import PaginatedTable from "@/components/PaginatedTable";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <PaginatedTable />
    </ApolloProvider>
  );
}
