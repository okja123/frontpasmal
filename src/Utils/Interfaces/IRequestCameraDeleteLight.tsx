export interface IRequestCameraDeleteLight { 
 Type?:string,  
    CameraSiteName: string,
    CameraGuidCamera: string,
    CameraLogicalId: number,
    CameraName: string,
    CameraGuidUnit: string,
    UnitName: string,
    IsDelete: true,
    RequestDate: Date,
    Applicant: string,
    ArchiverGuid: string,
    ArchiverName: string,
    IPAddress: string,
    DeleteDate: Date
 }