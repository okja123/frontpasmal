import { INumberOfRequestCameraByStates } from "./INumberOfRequestCameraByStates";

export interface IRequestLight { 
 Type?:string,  
    Id: number,
    SiteName: string,
    Title: string,
    MasaiCaseNumber: string,
    NumberOfCamerasRequested: number,
    Comment: string,
    LastUpdate: Date|undefined,
    RequestType: string,
    ServiceName: string,
    RequestState: string,
    NumberOfCameras: number,
    NumberOfRequestCameraByStates: INumberOfRequestCameraByStates[]
 }