import { ICameraRequestAdd } from "./IRequestCameraAdd";

export interface ICameraRequestReplace extends ICameraRequestAdd{
    DateToDelete?: Date,
    CameraToDeleteGuid?: string,
    VideoUnitToDeleteGuid?: string
}