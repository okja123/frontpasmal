export interface IRenameCamera { 
 Type?:string,  
    Id?: number,
    NewName: string,
    OldName: string,
    CameraGuidCamera: string,
    CameraSiteName: string,
    CameraLogicalId: number,
    IsRename?: boolean,
    RequestDate?: Date,
    RenameDate?: Date,
    Applicant: string
 }