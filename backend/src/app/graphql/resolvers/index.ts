import { GraphQLScalarType } from "graphql";
import { userResolvers } from "./resolvers.user.js";
import { roleResolvers } from "./resolver.role.js";
import { permissionResolvers } from "./resolver.permission.js";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...roleResolvers.Query,
    ...permissionResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...permissionResolvers.Mutation,
    ...roleResolvers.Mutation,
  },
};

const dateType = new GraphQLScalarType({
  name: "Date",
  description: "Used for date types",

  parseValue(value: any) {
    return new Date(value);
  },

  serialize(value: any) {
    return value.getTime();
  },
});
