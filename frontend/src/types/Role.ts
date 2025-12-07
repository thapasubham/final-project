export interface  Role {
    id: number,
    name: string,
    permissions?: Permissions[],
}

export interface Permissions {
    id:number,
    name: string,
}