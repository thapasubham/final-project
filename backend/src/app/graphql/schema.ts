import { gql } from "graphql-tag";

const typeDefs = gql`
  type User {
    firstname: String!
    lastname: String!
    id: Float
    email: String!
    phoneNumber: String!
    role: Role
  }

  scalar Date

  type AuthToken {
    bearerToken: String
    refreshToken: String
  }

  type Permission {
    id: Int!
    name: String!
  }
  type Role {
    id: Int!
    name: String!
    permission: [Permission]
  }

  type Query {
    users(
      search: String
      searchBy: String
      filter: String
      limit: Int!
      offset: Int!
      orderBy: String
    ): [User]
    getusers(id: ID!): User

    role(id: ID!): Role
    roles: [Role]
    permission(id: ID!): Permission
    permissions: [Permission]
  }

  input UserInput {
    firstname: String!
    lastname: String!
    id: Float
    email: String!
    phoneNumber: String!
    password: String
  }

  input RoleInput {
    id: Int
    name: String
    permission: Int
  }
  input PermissionInput {
    id: Int
    name: String!
  }
  input loginInput {
    email: String
    password: String
  }
  type Mutation {
    createUser(user: UserInput!): User
    updateUser(user: UserInput!): User
    deleteUser(id: ID!): Int
    loginUser(login: loginInput!): AuthToken

    createPermission(permission: PermissionInput!): Permission
    updatePermission(permission: PermissionInput!): Permission
    deletePermission(id: ID!): Int

    createRole(role: RoleInput!): Role
    updateRole(role: RoleInput!): Role
    deleteRole(id: ID!): Int
  }
`;

export default typeDefs;
