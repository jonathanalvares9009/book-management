"use client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import BookTable from "@/components/BookTable";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <BookTable />
    </ApolloProvider>
  );
}
