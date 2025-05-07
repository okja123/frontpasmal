import { ILicence } from "./ILicence";
import { IStatus } from "./IStatus";

export interface ILicencePool{
    Id: number,
    SiteName: string,
    ServiceCode: string,
    Name: string,
    ExpectedEndDate: Date,
    IsProject: boolean,
    Quantity: number,
    CameraQuantity: number,
    CloseDate: Date,
    IsClose: boolean,
    CreationDate: Date,
    Licenses: ILicence[],
    Status:IStatus[],
}