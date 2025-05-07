import { ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Steps } from "primereact/steps";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormRequest from "../../Components/Form/FormRequest/FormRequest";
import FormRequestCameraAdd from "../../Components/Form/FormRequestCameraAdd/FormRequestCameraAdd";
import FormRequestCameraReplace from "../../Components/Form/FormRequestCameraReplace/FormRequestCameraReplace";
import TableCamera from "../../Components/Table/TableCamera/TableCamera";
import TableRequestCameraAdd from "../../Components/Table/TableRequestCameraAdd/TableRequestCameraAdd";
import { CameraManagerApiClient } from "../../Utils/CameraManagerClientApi";
import { DEFAULT_VALUES } from "../../Utils/DefaultValue";
import { ICamera } from "../../Utils/Interfaces/ICamera";
import { IRequest } from "../../Utils/Interfaces/IRequest";
import { ICameraRequestAdd } from "../../Utils/Interfaces/IRequestCameraAdd";
import { ICameraRequestReplace } from "../../Utils/Interfaces/IRequestCameraReplace";
import Mapper from "../../Utils/Mapper";
import { ColumnBodyOptions } from "primereact/column";
import { Button } from "primereact/button";
import "./CreateRequest.css"


interface IProp{
    platform:string,
}

export default function CreationRequest(prop:IProp){
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [request, setRequest] = useState<IRequest|null>(null);
    const [cameras, setCameras] = useState<ICamera[]>([]);
    const [requestCameras, setRequestCameras] = useState<ICameraRequestAdd[]|ICameraRequestReplace[]>([]);
    const [isFormRequestCameraAddVisible, setIsFormRequestCameraAddVisible] = useState<boolean>(false);
    const [isFormRequestCameraReplaceVisible, setIsFormRequestCameraReplaceVisible] = useState<boolean>(false);
    const [selectedRequestCamera, setSelectedRequestCamera] = useState<ICameraRequestAdd|ICameraRequestReplace|null>(null);
    const [indexRequest, setIndexRequest] = useState<number>(-1);
    const [formLoading, setFormLoading] = useState<boolean>(false);

    const items = [
        {
            label: 'Requete',
        },
        {
            label: request?"Selectionner les cameras à "+request.RequestType:"Valider d'abort la requete",
        },
        {
            label: request?"Validation ":"Valider d'abort la requete",
        }
    ];
    useEffect(() => {
        setLoading(true)
        CameraManagerApiClient.site_getCameras(prop.platform)
        .then(camera=>{
            setCameras(camera)
            setLoading(false)
        })
    }, []);
    useEffect(() => {
        if(!request?.asChanged)return
        setActiveIndex(1)
    }, [request]);
    useEffect(() => {
        if(!selectedRequestCamera?.asChanged)return
        let requestsTemp = requestCameras
        if(indexRequest===-1){
            requestsTemp.push(selectedRequestCamera)
        }
        else{
            requestsTemp[indexRequest] = selectedRequestCamera
        }
        setRequestCameras([...requestsTemp])
    }, [selectedRequestCamera]);
    function formSend(){
        //setFormLoading(true)
        let requestTemp = request
        let requestCamerasTemp = requestCameras
        CameraManagerApiClient.service_getLicencePools(requestTemp?.ServiceCode)
        .then(licencePools=>{
            let licencepool = licencePools.find(licencePool=>{
                //take licencepool linked to our licence selected
                return licencePool.Licenses.map(licence=>{return licence.Id}).includes(requestTemp?.LicenseId)
            })
            if(!typeof requestTemp.LastUpdate==="string"){
                requestTemp.LastUpdate = requestTemp.LastUpdate.toISOString()
            }
            if(requestTemp?.RequestTypeCode==="ADD"){
                let requestfinished:IRequest = {
                    ...requestTemp,
                    LicensePoolId:licencepool?.Id,
                    Cameras:requestCamerasTemp
                }
                console.log(requestfinished)
                CameraManagerApiClient.addRequest_post(requestfinished)
                .then((response)=>{
                    if(response){
                        navigate("/requests")
                    }
                    else{
                        toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'envoi de la requete', life: 3000 });
                    }
                })
                //setFormLoading(false)
                return
            }
            if(requestTemp?.RequestTypeCode=="REP"){
                requestCamerasTemp.forEach((requestCameraTemp:ICameraRequestReplace)=>{
                    if(!typeof requestCameraTemp.DateToDelete==="string"){
                        requestTemp.LastUpdate = requestTemp.LastUpdate.toISOString()
                    }
                    
                })
                let requestfinished:IRequest = {
                    ...requestTemp,
                    LicensePoolId:licencepool?.Id,
                    Cameras:requestCamerasTemp
                }
                console.log(requestfinished)
                CameraManagerApiClient.replaceRequest_post(requestfinished)
                .then((response)=>{
                    if(response){
                        navigate("/requests")
                    }
                    else{
                        toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'envoi de la requete', life: 3000 });
                    }
                })
                //setFormLoading(false)
                return
            }
            //setFormLoading(false)
        })
        
    }
    function formRequestCameraAddTemplate(){
        let hide = ()=>{
            setIsFormRequestCameraAddVisible(false)
        }
        return(
            <FormRequestCameraAdd hide={hide} requestCamera={selectedRequestCamera} setRequestCamera={setSelectedRequestCamera}/>
        )
    }
    function formRequestCameraReplaceTemplate(){
        let hide = ()=>{
            setIsFormRequestCameraReplaceVisible(false)
        }
        return(
            <FormRequestCameraReplace hide={hide} requestCamera={selectedRequestCamera} setRequestCamera={setSelectedRequestCamera}/>
        )
    }
    function add(){
        setIsFormRequestCameraAddVisible(true)
        setIndexRequest(-1)
        setSelectedRequestCamera({
            ...DEFAULT_VALUES.requestCameraAdd,
            SiteName:request?.SiteName
        })
    }
    function select(event: any){
        if(event.value===null)return
        setIndexRequest(-1)
        setIsFormRequestCameraReplaceVisible(true)
        setSelectedRequestCamera(Mapper.mapToRequestCameraReplace(event.value))
    }
    function editCameraRequestAdd(request: ICameraRequestAdd, option: ColumnBodyOptions){
        setSelectedRequestCamera(request)
        setIndexRequest(option.rowIndex)
        setIsFormRequestCameraAddVisible(true)
    }
    function editCameraRequestReplace(request: ICameraRequestAdd, option: ColumnBodyOptions){
        setSelectedRequestCamera(request)
        setIndexRequest(option.rowIndex)
        setIsFormRequestCameraReplaceVisible(true)
    }
    function deleteCameraRequest(request: ICameraRequestAdd, option: ColumnBodyOptions){
        let requestsTemp = requestCameras
        requestsTemp.splice(option.rowIndex,1)
        setRequestCameras([...requestsTemp])
    }
    return(
        <div className="creation-request">
            <Toast ref={toast}></Toast>
            <ConfirmDialog />
            <Dialog
                visible={isFormRequestCameraAddVisible}
                onHide={() => {if (!isFormRequestCameraAddVisible) return; setIsFormRequestCameraAddVisible(isFormRequestCameraAddVisible); }}
                content={formRequestCameraAddTemplate}
            />
            <Dialog
                visible={isFormRequestCameraReplaceVisible}
                onHide={() => {if (!isFormRequestCameraReplaceVisible) return; setIsFormRequestCameraReplaceVisible(isFormRequestCameraReplaceVisible); }}
                content={formRequestCameraReplaceTemplate}
            />
            <Steps model={items} activeIndex={activeIndex} onSelect={(e) => {request?setActiveIndex(e.index):null;}} readOnly={false} style={{marginTop:"10px"}} />
            {
                activeIndex===0&&
                <FormRequest hide={()=>setIsFormRequestCameraAddVisible(false)} request={request} setitem={setRequest}/>
            }
            {
                activeIndex===1&&
                <TableRequestCameraAdd 
                    requests={requestCameras} 
                    selectionMode={undefined} 
                    validation={false} 
                    onAdd={request?.RequestTypeCode==="ADD"?add:undefined}
                    onEdit={request?.RequestTypeCode==="ADD"?editCameraRequestAdd:editCameraRequestReplace}
                    onDelete={deleteCameraRequest}
                />
            }
            {
                activeIndex===1&&request?.RequestTypeCode==="REP"&&
                <TableCamera cameras={cameras} selectionMode={"single"} loading={false} onSelect={select} />
            }
            {
                activeIndex===2&&
                <>
                    <div style={{display:"flex", alignItems: "center"}}>
                        Êtes-vous sûr d'envoyer le formulaire ?
                        <Button icon="pi pi-send" loading={formLoading}  rounded onClick={formSend}></Button>
                    </div>
                </>
            }
        </div>
    )
}