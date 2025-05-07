import IConnexionToken from "./IConnexionToken";

export interface IUser { 
 Type?:string,  
    WindowsLogin : string;
    IsAuthenticated : Boolean;
    Name : string;
    WindowsGroup : string[];
    RoleCodes : string[];
    SiteCodes : string[];
    ConnexionToken:IConnexionToken,
 }