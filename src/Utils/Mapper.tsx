import { TreeNode } from "primereact/treenode";
import { ITreeStructure } from "./Interfaces/ITreeStructure";
import { ICamera } from "./Interfaces/ICamera";
import { IRequestCameraDelete } from "./Interfaces/IRequestCameraDelete";
import { ICameraRequestReplace } from "./Interfaces/IRequestCameraReplace";
import { DEFAULT_VALUES } from "./DefaultValue";

export default class Mapper{
    public static mapToTreeNodes(treeStructures :ITreeStructure[],path:string):TreeNode[]
    {
        return treeStructures.map((treeStructure)=>{
            return{
                key:treeStructure.Guid,
                id:treeStructure.Guid,
                label:treeStructure.Name,
                data:{
                    SiteName: treeStructure.SiteName,
                    Description: treeStructure.Description,
                    CompleteTree: treeStructure.CompleteTree,
                    CompleteTreeGuid:treeStructure.CompleteTreeGuid,
                    ParentGuid: treeStructure.ParentGuid,
                    path:path+"/"+treeStructure.Name
                },
                children:treeStructure.Children?Mapper.mapToTreeNodes(treeStructure.Children,path+"/"+treeStructure.Name):[]
            }
        })
    }
    public static mapToTreeStructure(treeNode:TreeNode):ITreeStructure
    {
        return{
            Guid: treeNode.id?treeNode.id:"",
            SiteName: treeNode.data.SiteName,
            Name: treeNode.label?treeNode.label:"",
            Description: treeNode.data.Description,
            CompleteTree: treeNode.data.CompleteTree,
            CompleteTreeGuid:treeNode.data.CompleteTreeGuid,
            ParentGuid: treeNode.data.ParentGuid,
            Children: []
        }
    }
    public static mapToRequestCameraDelete(camera:ICamera):IRequestCameraDelete
    {
        let applicant = localStorage.getItem("userName")
        return{
            CameraSiteName: camera.SiteName,
            CameraGuidCamera: camera.GuidCamera,
            CameraLogicalId: camera.LogicalId,
            CameraGuidUnit: camera.GuidUnit,
            RequestDate: new Date(),
            Applicant: applicant?applicant:"Unconnue",
            ArchiverGuid: camera.ArchiverGuid,
            IPAddress: camera.IPAddress,
        }
    }
    public static mapToRequestCameraReplace(camera:ICamera):ICameraRequestReplace
    {
        return{
            ...DEFAULT_VALUES.requestCameraAdd,
            ...camera,
            CameraToDeleteGuid:camera.GuidCamera,
            VideoUnitToDeleteGuid:camera.GuidUnit,
        }
    }
    public static mapToCameraExel(cameras:ICamera[]):ICameraExel[]
  {
    return cameras.map((camera) => {
        return{
            Etas: camera.IsGeneralStateOk?"OK":"KO",
            Uo:camera.ServiceName,
            IdSecurityCenter:camera.SecurityCenterId,
            NomCamera:camera.NameCamera,
            NomArchiver:camera.Archiver,
            NomEncodeur:camera.NameUnit,
            AdresseIp:camera.IPAddress,
            ArborecenceSecurityCenter:camera.TreeStructures.join("|"),
            DureeArchivage:camera.RetentionPeriod,
        }
    })
  }
}