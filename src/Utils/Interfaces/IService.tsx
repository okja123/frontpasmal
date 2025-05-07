export interface IService { 
   Type?:string,  
   Code : string;
   SiteName : string;
   Name : string;
   ParentServiceCode : string;
   Administrator : string;
   Children : []
 }