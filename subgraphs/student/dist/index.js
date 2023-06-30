import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import gql from "graphql-tag";
const students = [
    { id: "1", username: "@ava1" },
    { id: "2", username: "@ava2" },
    { id: "3", username: "@ava3" },
];
const typeDefs = gql `
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

  type Query {
    students: [Student]
  }

  type Student @key(fields: "id") {
    id: ID!
    username: String
  }
`;
const resolvers = {
    Query: {
        students() {
            return students;
        },
    },
    Student: {
        __resolveReference(student) {
            return students.find(({ id }) => id === student.id);
        },
    },
};
const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
// Note the top-level await!
const { url } = await startStandaloneServer(server, { listen: { port: 4002 } });
console.log(`🚀  Server ready at ${url}`);
