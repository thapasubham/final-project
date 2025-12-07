export const userResolvers = {
  Query: {
    async users(
      _: any,
      { search, searchBy, limit, offset, filter, orderBy, isVerified }: any,
      { dataSource }: any
    ) {
      const result = await dataSource.userService.ReadUsers(
        search,
        searchBy,
        filter,
        limit,
        offset,
        orderBy,
        isVerified
      );

      return result;
    },
    async getusers(_: any, { id }: any, { dataSource }: any) {
      const getUser = await dataSource.userService.ReadUser(parseInt(id));

      return getUser;
    },
  },

  Mutation: {
    async createUser(_: any, { user }: any, { dataSource }: any) {
      const createdUser = await dataSource.userService.CreateUser(user);
      return createdUser;
    },

    async updateUser(_: any, { user }: any, { dataSource }: any) {
      const updatedUser = await dataSource.userService.Update(user);
      return updatedUser;
    },
    async loginUser(_: any, { login }: any, { dataSource }: any) {
      const tokens = await dataSource.userService.Login(login);
      return tokens;
    },
    async deleteUser(_: any, { id }: any, { dataSource }: any) {
      const user = await dataSource.userService.DeleteUser(parseInt(id));

      return user;
    },
  },
};
