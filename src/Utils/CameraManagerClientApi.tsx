import { API_ENDPOINTS } from "./Constants"
import { ICamera } from "./Interfaces/ICamera"
import {  IRequestCameraDelete, IRequestCameraDeleteLight } from "./Interfaces/IDeleteRequest"
import { IService } from "./Interfaces/IService"
import { IUser } from "./Interfaces/IUser"
import { IRequestLight } from "./Interfaces/IRequestLight"
import { IRequestCameraLight } from "./Interfaces/IRequestCameraLight"
import { IVideoStream } from "./Interfaces/IVideoStream"
import { IRenameCamera } from "./Interfaces/IRenameCamera"
import { IRequest } from "./Interfaces/IRequest"
import { IUserRole } from "./Interfaces/IUserRole"
import { ICameraModel } from "./Interfaces/ICameraModel"
import { IUserGroup } from "./Interfaces/IUserGroup"
import { IArchiver } from "./Interfaces/IArchiver"
import { ITreeStructure } from "./Interfaces/ITreeStructure"
import { ILicencePool } from "./Interfaces/ILicencePool"
import { ILicence } from "./Interfaces/ILicence"

export class CameraManagerApiClient
{
    private static fetchparam: RequestInit = 
    {
        mode: "cors", // no-cors, *cors, same-origin
        credentials: "include", // include, *same-origin, omit
    }
    private static requestHandler<T>(ApiRoute:string,method:CameraManagerApiClient.Methode,body:any=null,jwt:boolean=true):Promise<T>
    {
        let headers = new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
        })
        if(jwt){
            const myjwt = localStorage.getItem('jwtToken');
            headers.set('Authorization', `Bearer ${myjwt}`)
        }
        let request = {
            ...CameraManagerApiClient.fetchparam,
            method:method,
            headers:headers
        }
        if(body!=null){
            request.body = JSON.stringify(body)
        }
        return fetch(ApiRoute, request)
        .then(async response => {
            if (!response.ok) {
                return false;
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            }
            return true;
        })
        .catch(error => {
            console.error('Error:', error);
            return false
        });
    } 
    public static token_get() : Promise<string>
    {
        return CameraManagerApiClient.requestHandler<string>(localStorage.getItem("BaseURL")+API_ENDPOINTS.TOKEN_GET, CameraManagerApiClient.Methode.GET);
    }
    //user
    public static user_current() : Promise<IUser>
    {
        return CameraManagerApiClient.requestHandler<IUser>(localStorage.getItem("BaseURL")+API_ENDPOINTS.USER_CURRENT, CameraManagerApiClient.Methode.GET,null,false);
    }
    public static user_roles() : Promise<string[]>
    {
        return CameraManagerApiClient.requestHandler<string[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.USER_ROLES, CameraManagerApiClient.Methode.GET,null,false);
    }
    //stats
    public static site_nbrCamera(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SITE_NBR_CAMERA.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_nbrCameraOK(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SITE_NBR_CAMERA_OK.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_nbrCameraKO(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SITE_NBR_CAMERA_KO.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_nbrArchiver(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SITE_NBR_ARCHIVER.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_nbrCameraRequestIntegration(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SITE_NBR_CAMERA_REQUEST_INTEGRATION.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_nbrCameraIntegration(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SITE_NBR_CAMERA_INTEGRATION.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_nbrLicence(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SITE_NBR_LICENCE.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_nbrLicenceUsed(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SITE_NBR_LICENCE_USED.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_nbrLicencePool(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SITE_NBR_LICENCE_POOL.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_nbrLicencePoolOpen(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SITE_NBR_LICENCE_POOL_OPEN.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_nbrLicenceCommand(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SITE_NBR_LICENCE_COMMAND.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_nbrLicenceCommandInvoiced(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SITE_NBR_LICENCE_COMMAND_INVOICED.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static service_nbrCamera(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SERVICE_NBR_CAMERA.replace("#id_service#",id), CameraManagerApiClient.Methode.GET);
    }
    public static service_nbrLicence(id:string) : Promise<number>
    {
        return CameraManagerApiClient.requestHandler<number>(localStorage.getItem("BaseURL")+API_ENDPOINTS.STATS_SERVICE_NBR_LICENCE.replace("#id_service#",id), CameraManagerApiClient.Methode.GET);
    }
    //site
    public static site_getServices(id:string) : Promise<IService[]>
    {
        return CameraManagerApiClient.requestHandler<IService[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.SITE_GET_SERVICES.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_getArchivers(id:string) : Promise<IArchiver[]>
    {
        return CameraManagerApiClient.requestHandler<IArchiver[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.SITE_GET_ARCHIVERS.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_getRequestLights(id:string) : Promise<IRequestLight[]>
    {
        return CameraManagerApiClient.requestHandler<IRequestLight[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.SITE_GET_REQUEST_LIGHTS.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_getRequestCameraLights(id:string) : Promise<IRequestCameraLight[]>
    {
        return CameraManagerApiClient.requestHandler<IRequestCameraLight[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.SITE_GET_REQUEST_CAMERA_LIGHT.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_getRequestCameraDelete(id:string) : Promise<IRequestCameraDeleteLight[]>
    {
        return CameraManagerApiClient.requestHandler<IRequestCameraDeleteLight[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.SITE_GET_DELETE_REQUESTS.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_getCameras(id:string) : Promise<ICamera[]>
    {
        return CameraManagerApiClient.requestHandler<ICamera[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.SITE_GET_CAMERAS.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_getTreeStructures(id:string) : Promise<ITreeStructure>
    {
        return CameraManagerApiClient.requestHandler<ITreeStructure>(localStorage.getItem("BaseURL")+API_ENDPOINTS.SITE_GET_TREE_STRUCTURES.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static site_getLicnencePools(id:string) : Promise<ILicencePool[]>
    {
        return CameraManagerApiClient.requestHandler<ILicencePool[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.SITE_GET_LICENCE_POOL.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    //camera
    public static camera_getAll() : Promise<ICamera[]>
    {
        return CameraManagerApiClient.requestHandler<ICamera[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.CAMERA_GET_ALL, CameraManagerApiClient.Methode.GET);
    }
    public static camera_getVideoStreams(id:string) : Promise<IVideoStream[]>
    {
        return CameraManagerApiClient.requestHandler<IVideoStream[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.CAMERA_GET_VIDEO_STREAMS.replace("#id_site#",id), CameraManagerApiClient.Methode.GET);
    }
    public static camera_getSnapshot(guidCamera:string,idSite:string) : Promise<string>
    {
        return CameraManagerApiClient.requestHandler<string>(localStorage.getItem("BaseURL")+API_ENDPOINTS.CAMERA_GET_SNAPSHOT.replace("#id_site#",idSite).replace("#guid_camera#",guidCamera), CameraManagerApiClient.Methode.GET);
    }
    //deleterequest
    public static requestCameraDelete_post(deleteRequest:IRequestCameraDelete) : Promise<boolean>
    {
        return CameraManagerApiClient.requestHandler<boolean>(localStorage.getItem("BaseURL")+API_ENDPOINTS.DELETE_REQUEST_POST, CameraManagerApiClient.Methode.POST,deleteRequest);
    }
    public static requestCameraDelete_Delete(idSite:string,idrequestCameraDelete:string) : Promise<boolean>
    {
        return CameraManagerApiClient.requestHandler<boolean>(localStorage.getItem("BaseURL")+API_ENDPOINTS.DELETE_REQUEST_DELETE.replace("#id_site#",idSite).replace("#id_deleteRequest#",idrequestCameraDelete), CameraManagerApiClient.Methode.DELETE)
    }
    //rename camera
    public static renameCamera_getAll() : Promise<IRenameCamera[]>
    {
        return CameraManagerApiClient.requestHandler<IRenameCamera[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.RENAME_CAMERA_GET_ALL, CameraManagerApiClient.Methode.GET)
    }
    public static renameCamera_post(renameCamera:IRenameCamera) : Promise<boolean>
    {
        return CameraManagerApiClient.requestHandler<boolean>(localStorage.getItem("BaseURL")+API_ENDPOINTS.RENAME_CAMERA_POST, CameraManagerApiClient.Methode.POST,renameCamera)
    }
    //usergroup
    public static userGroup_getAll() : Promise<IUserGroup[]>
    {
        return CameraManagerApiClient.requestHandler<IUserGroup[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.USER_GROUP_GET_ALL, CameraManagerApiClient.Methode.GET)
    }
    public static userGroup_post(usergroup:IUserGroup) : Promise<boolean>
    {
        return CameraManagerApiClient.requestHandler<boolean>(localStorage.getItem("BaseURL")+API_ENDPOINTS.USER_GROUP_POST, CameraManagerApiClient.Methode.POST,usergroup)
    }
    public static userGroup_put(idUserGroup:string,usergroup:IUserGroup) : Promise<boolean>
    {
        return CameraManagerApiClient.requestHandler<boolean>(localStorage.getItem("BaseURL")+API_ENDPOINTS.USER_GROUP_PUT.replace("#id_user_group#",idUserGroup), CameraManagerApiClient.Methode.PUT,usergroup)
    }
    public static userGroup_delete(idUserGroup:string) : Promise<boolean>
    {
        return CameraManagerApiClient.requestHandler<boolean>(localStorage.getItem("BaseURL")+API_ENDPOINTS.USER_GROUP_DELETE.replace("#id_user_group#",idUserGroup), CameraManagerApiClient.Methode.DELETE)
    }
    //request
    public static addRequest_get(idRequest:number) : Promise<IRequest>
    {
        return CameraManagerApiClient.requestHandler<IRequest>(localStorage.getItem("BaseURL")+API_ENDPOINTS.ADD_REQUEST_GET.replace("#id_request#",idRequest), CameraManagerApiClient.Methode.GET)
    }
    public static addRequest_post(request:IRequest) : Promise<IRequest>
    {
        return CameraManagerApiClient.requestHandler<IRequest>(localStorage.getItem("BaseURL")+API_ENDPOINTS.ADD_REQUEST_POST, CameraManagerApiClient.Methode.POST,request)
    }
    public static addRequest_put(idRequest:number,request:IRequest) : Promise<IRequest>
    {
        return CameraManagerApiClient.requestHandler<IRequest>(localStorage.getItem("BaseURL")+API_ENDPOINTS.ADD_REQUEST_PUT.replace("#id_request#",idRequest), CameraManagerApiClient.Methode.PUT,request)
    }
    public static addRequest_delete(idRequest:number) : Promise<IRequest>
    {
        return CameraManagerApiClient.requestHandler<IRequest>(localStorage.getItem("BaseURL")+API_ENDPOINTS.ADD_REQUEST_DELETE.replace("#id_request#",idRequest), CameraManagerApiClient.Methode.DELETE)
    }
    public static replaceRequest_get(idRequest:number) : Promise<IRequest>
    {
        return CameraManagerApiClient.requestHandler<IRequest>(localStorage.getItem("BaseURL")+API_ENDPOINTS.REPLACE_REQUEST_GET.replace("#id_request#",idRequest), CameraManagerApiClient.Methode.GET)
    }
    public static replaceRequest_post(request:IRequest) : Promise<IRequest>
    {
        return CameraManagerApiClient.requestHandler<IRequest>(localStorage.getItem("BaseURL")+API_ENDPOINTS.REPLACE_REQUEST_POST, CameraManagerApiClient.Methode.POST,request)
    }
    public static replaceRequest_put(idRequest:number,request:IRequest) : Promise<IRequest>
    {
        return CameraManagerApiClient.requestHandler<IRequest>(localStorage.getItem("BaseURL")+API_ENDPOINTS.REPLACE_REQUEST_PUT.replace("#id_request#",idRequest), CameraManagerApiClient.Methode.PUT,request)
    }
    public static replaceRequest_delete(idRequest:number) : Promise<IRequest>
    {
        return CameraManagerApiClient.requestHandler<IRequest>(localStorage.getItem("BaseURL")+API_ENDPOINTS.REPLACE_REQUEST_DELETE.replace("#id_request#",idRequest), CameraManagerApiClient.Methode.DELETE)
    }
    //userrole
    public static userRole_getAll() : Promise<IUserRole[]>
    {
        return CameraManagerApiClient.requestHandler<IUserRole[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.USER_ROLE_GET_ALL, CameraManagerApiClient.Methode.GET)
    }
    //site
    public static site_getAll() : Promise<string[]>
    {
        return CameraManagerApiClient.requestHandler<string[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.SITE_GET_ALL, CameraManagerApiClient.Methode.GET)
    }
    //cameramodel
    public static cameraModel_getAll() : Promise<ICameraModel[]>
    {
        return CameraManagerApiClient.requestHandler<ICameraModel[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.CAMERA_MODEL_GET_ALL, CameraManagerApiClient.Methode.GET)
    }
    //camerausage
    public static cameraUsage_getAll() : Promise<string[]>
    {
        return CameraManagerApiClient.requestHandler<string[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.CAMERA_USAGE_GET_ALL, CameraManagerApiClient.Methode.GET)
    }
    //camerausage
    public static dureeEnregistrement_getAll() : Promise<string[]>
    {
        return fetch("./config.json")
        .then(response => response.json())
        .then(data =>{return data.dureeEnregistrements})
        .catch(error => console.error('Error:', error));
    }
    //service
    public static service_getLicencePools(idService : string) : Promise<ILicencePool[]>
    {
        return CameraManagerApiClient.requestHandler<ILicencePool[]>(localStorage.getItem("BaseURL")+API_ENDPOINTS.SERVICE_GET_LICENCE_POOLS.replace("#id_service#",idService), CameraManagerApiClient.Methode.GET)
    }
    //licencepool
    public static licencePool_get(idLicencePool:number) : Promise<ILicencePool>
    {
        return CameraManagerApiClient.requestHandler<ILicencePool>(localStorage.getItem("BaseURL")+API_ENDPOINTS.LICENCE_POOL_GET.replace("#id_licence_pool#",idLicencePool), CameraManagerApiClient.Methode.GET)
    }
    public static licencePool_post(licencePool:ILicencePool) : Promise<boolean>
    {
        return CameraManagerApiClient.requestHandler<boolean>(localStorage.getItem("BaseURL")+API_ENDPOINTS.LICENCE_POOL_POST, CameraManagerApiClient.Methode.POST,licencePool)
    }
    public static licencePool_put(idLicencePool:number,licencePool:ILicencePool) : Promise<boolean>
    {
        return CameraManagerApiClient.requestHandler<boolean>(localStorage.getItem("BaseURL")+API_ENDPOINTS.LICENCE_POOL_PUT.replace("#id_licence_pool#",idLicencePool), CameraManagerApiClient.Methode.PUT,licencePool)
    }
    public static licencePool_delete(idLicencePool:number) : Promise<IRequest>
    {
        return CameraManagerApiClient.requestHandler<IRequest>(localStorage.getItem("BaseURL")+API_ENDPOINTS.LICENCE_POOL_DELETE.replace("#id_licence_pool#",idLicencePool), CameraManagerApiClient.Methode.DELETE)
    }
    public static licencePool_addLicence(idLicencePool:number,licence:ILicence) : Promise<IRequest>
    {
        return CameraManagerApiClient.requestHandler<IRequest>(localStorage.getItem("BaseURL")+API_ENDPOINTS.LICENCE_POOL_POST_LICENCE.replace("#id_licence_pool#",idLicencePool), CameraManagerApiClient.Methode.POST,licence)
    }
    //licence
    public static licence_put(idLicence:number,licence:ILicence) : Promise<IRequest>
    {
        return CameraManagerApiClient.requestHandler<IRequest>(localStorage.getItem("BaseURL")+API_ENDPOINTS.LICENCE_PUT.replace("#id_licence#",idLicence), CameraManagerApiClient.Methode.PUT,licence)
    }
}
export namespace CameraManagerApiClient
{
    export enum Methode
    {
        PUT = "PUT",
        GET = "GET",
        DELETE = "DELETE",
        POST = "POST"
    }
}