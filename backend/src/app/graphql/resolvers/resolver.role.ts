export const roleResolvers = {
  Query: {
    async roles(_: any, {}: any, { dataSource }: any) {
      return dataSource.roleService.ReadRoles();
    },
    async role(_: any, { id }: any, { dataSource }: any) {
      return dataSource.roleService.ReadRole(id);
    },
  },
  Mutation: {
    async createRole(_: any, { role }: any, { dataSource }: any) {
      return dataSource.roleService.CreateRole(role);
    },
    async updateRole(_: any, { role }: any, { dataSource }: any) {
      return dataSource.roleService.UpdateRole(role.id, role.permission);
    },
    async deleteRole(_: any, { id }: any, { dataSource }: any) {
      return dataSource.roleService.DeleteRole(id);
    },
  },
};
