import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import gql from "graphql-tag";
const attendances = [
    {
        studentId: "1",
        date: "2020-01-01",
    },
    {
        studentId: "1",
        date: "2020-01-02",
    },
    {
        studentId: "1",
        date: "2020-01-03",
    },
    {
        studentId: "1",
        date: "2020-01-04",
    },
    {
        studentId: "2",
        date: "2020-01-01",
    },
    {
        studentId: "2",
        date: "2020-01-02",
    },
    {
        studentId: "2",
        date: "2020-01-03",
    },
    {
        studentId: "3",
        date: "2020-01-02",
    },
    {
        studentId: "3",
        date: "2020-01-03",
    },
];
const typeDefs = gql `
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

  type Query {
    attendances: [Attendance]
  }

  type Attendance {
    studentId: ID!
    date: String
  }

  type Student @key(fields: "id") {
    id: ID!
    attendance: [Attendance]
  }
`;
const resolvers = {
    Query: {
        attendances() {
            return attendances;
        },
    },
    Student: {
        attendance: (student) => {
            return attendances.filter(({ studentId }) => studentId === student.id);
        },
    },
};
const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
const { url } = await startStandaloneServer(server, {
    listen: {
        port: 4001,
    },
});
console.log(`🚀  Server ready at ${url}`);
