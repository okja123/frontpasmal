import { INumberOfRequestCameraByStates } from "./INumberOfRequestCameraByStates";

export interface IRequestCameraLight { 
 Type?:string,  
    Id: number,
    SiteName: string,
    RequestTitle: string,
    RequestId: number,
    RequestStateCode: string,
    RequestTypeCode: string,
    IPAddress: string,
    LogicalId: number,
    NameCamera: string,
    RequestCameraStateCode: INumberOfRequestCameraByStates[]
   }