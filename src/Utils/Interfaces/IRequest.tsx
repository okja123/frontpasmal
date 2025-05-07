import { INumberOfRequestCameraByStates } from "./INumberOfRequestCameraByStates";
import { ICameraRequestAdd } from "./IRequestCameraAdd";

export interface IRequest { 
 Type?:string,  
  target: any;
  value(value: any): unknown;
  Id: number,
  SiteName: string,
  Title: string,
  MasaiCaseNumber: string,
  NumberOfCamerasRequested: number,
  Comment: string,
  LastUpdate: Date,
  RequestType: string,
  ServiceName: string,
  RequestState: string,
  NumberOfCameras: number,
  NumberOfRequestCameraByStates: INumberOfRequestCameraByStates[],
  RequestTypeCode: string,
  LicenseId: number,
  LicensePoolId: number,
  LicenseName: string,
  ServiceCode: string,
  RequestStateCode: string,
  Cameras:ICameraRequestAdd[]
  isMissingInfo?: boolean,
  asChanged?:boolean,
 }