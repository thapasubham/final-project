export const permissionResolvers = {
  Query: {
    async permissions(_: any, {}: any, { dataSource }: any) {
      return dataSource.permissionService.ReadPermissions();
    },

    async permission(_: any, { id }: any, { dataSource }: any) {
      return dataSource.permissionService.ReadPermission(id);
    },
  },

  Mutation: {
    async createPermission(_: any, { permission }: any, { dataSource }: any) {
      return dataSource.permissionService.CreatePermission(permission);
    },
    async updatePermission(_: any, { permission }: any, { dataSource }: any) {
      return dataSource.permissionService.UpdatePermission(permission);
    },
    async deletePermission(_: any, { id }: any, { dataSource }: any) {
      return dataSource.permissionService.DeletePermission(id);
    },
  },
};
