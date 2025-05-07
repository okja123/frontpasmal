export interface IUserGroup {
  Name: string,
  RoleCode: string,
  SiteCodes: string[],
  asChanged?:boolean,
  isNew?:boolean,
}