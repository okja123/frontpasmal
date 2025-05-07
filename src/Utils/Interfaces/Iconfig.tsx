import { IRole } from "./IRole";

export interface IConfiguration { 
 Type?:string,  
    baseURL:string,
    role:IRole[],
 }