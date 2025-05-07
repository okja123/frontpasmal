import { DataTableRowExpansionTemplate } from "primereact/datatable";
import { useState, useEffect, useRef } from "react";
import { CameraManagerApiClient } from "../../../Utils/CameraManagerClientApi";
import { IRequestCameraLight } from "../../../Utils/Interfaces/IRequestCameraLight";
import { IRequestLight } from "../../../Utils/Interfaces/IRequestLight";
import TableRequestCameraLight from "../../Table/TableRequestCameraLight/TableRequestCameraLight";
import { ColumnBodyOptions } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { IRequest } from "../../../Utils/Interfaces/IRequest";
import { ICameraRequestAdd } from "../../../Utils/Interfaces/IRequestCameraAdd";
import FormRequestCamera from "../../Form/FormRequestCameraAdd/FormRequestCameraAdd";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { ICameraRequestReplace } from "../../../Utils/Interfaces/IRequestCameraReplace";
import { DEFAULT_VALUES } from "../../../Utils/DefaultValue";
import FormRequestCameraReplace from "../../Form/FormRequestCameraReplace/FormRequestCameraReplace";

interface IProp{
    data: IRequestLight,
    options: DataTableRowExpansionTemplate
}
export default function RequestExpended(prop:IProp){
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(true);
    const [formAddvisible, setformAddvisible] = useState(false);
    const [formReplaceVisible, setformReplaceVisible] = useState(false);
    const [formLoading, setformLoading] = useState(false);
    const [RequestCameraLights, setRequestCameraLights] = useState<IRequestCameraLight[]>([]);

    const [selectedRequest, setSelectedRequest] = useState<IRequest>();
    const [selectedRequestCamera, setSelectedRequestCamera] = useState<ICameraRequestAdd|ICameraRequestReplace|null>(null);
    useEffect(() => {
        loadData()
    }, []);
    useEffect(() => {
        if(!selectedRequestCamera?.asChanged){
            return
        }
        let requestTemp = selectedRequest
        if(selectedRequestCamera?.index!=-1){
            requestTemp.Cameras[selectedRequestCamera.index] = selectedRequestCamera
        }
        else{
            requestTemp.Cameras.push(selectedRequestCamera)
        }
        if(requestTemp?.RequestTypeCode==="ADD"){
            CameraManagerApiClient.addRequest_put(requestTemp.Id,requestTemp)
            .then((result)=>{
                if(result){
                    toast.current?.show({ severity: 'info', summary: 'Confirmation', detail: 'Requête modifiée', life: 3000 });
                }
                else{
                    toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la modification', life: 3000 });
                }
                loadData()
            })
        }
        if(requestTemp?.RequestTypeCode==="REP"){
            console.log(requestTemp)
            CameraManagerApiClient.replaceRequest_put(requestTemp.Id,requestTemp)
            .then((result)=>{
                if(result){
                    toast.current?.show({ severity: 'info', summary: 'Confirmation', detail: 'Requête modifiée avec succès', life: 3000 });
                }
                else{
                    toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la modification', life: 3000 });
                }
                loadData()
            })
        }

    }, [selectedRequestCamera]);
    function loadData(){  
        setLoading(true)
        CameraManagerApiClient.site_getRequestCameraLights(prop.data.SiteName)
        .then(requests=>{
            let requestTemp = requests.filter((requestCamera:IRequestCameraLight)=>{
                return requestCamera.RequestId===prop.data.Id
            })
            setRequestCameraLights(requestTemp)
            setLoading(false)
        });
    }
    
    function formAddTemplate(){
        let hide = ()=>{
            setformAddvisible(false)
        }
        return(
            <>
                {
                    formLoading?
                    <>
                        <Card>
                            <ProgressSpinner></ProgressSpinner>
                        </Card>
                    </>
                    :
                    <FormRequestCamera hide={hide} requestCamera={selectedRequestCamera} setRequestCamera={setSelectedRequestCamera}></FormRequestCamera>
                }
            </>
        )
    }
    function formReplaceTemplate(){
        let hide = ()=>{
            setformReplaceVisible(false)
        }
        return(
            <>
                {
                    formLoading?
                    <>
                        <Card>
                            <ProgressSpinner></ProgressSpinner>
                        </Card>
                    </>
                    :
                    <FormRequestCameraReplace  hide={hide} requestCamera={selectedRequestCamera} setRequestCamera={setSelectedRequestCamera}/>
                }
            </>
        )
    }
    function edit(requestselected: IRequestCameraLight, option?: ColumnBodyOptions){
        if(requestselected.RequestTypeCode==="ADD"){
            setformAddvisible(true)
            setformLoading(true)
            CameraManagerApiClient.addRequest_get(requestselected.RequestId)
            .then(request=>{
                setSelectedRequest(request)
                let index  = request.Cameras.findIndex((requestCamera)=>{
                    return requestCamera.Id===requestselected.Id
                })
                setSelectedRequestCamera({
                    ...request.Cameras[index],
                    index:index
                })
                setformLoading(false)
            })
        }
        if(requestselected.RequestTypeCode==="REP"){
            setformReplaceVisible(true)
            setformLoading(true)
            CameraManagerApiClient.replaceRequest_get(requestselected.RequestId)
            .then(request=>{
                setSelectedRequest(request)
                let index  = request.Cameras.findIndex((requestCamera)=>{
                    return requestCamera.Id===requestselected.Id
                })
                setSelectedRequestCamera({
                    ...request.Cameras[index],
                    index:index
                })
                setformLoading(false)
            })
        }
    }
    function add(){
        setformAddvisible(true)
        setformLoading(true)
        CameraManagerApiClient.addRequest_get(prop.data.Id)
        .then(request=>{
            setSelectedRequest(request)
            setSelectedRequestCamera({
                ...DEFAULT_VALUES.requestCameraAdd,
                SiteName:prop.data.SiteName,
                index:-1,
            })
            setformLoading(false)
        })
    }
    function addreplcae(){
        setformReplaceVisible(true)
        setformLoading(true)
        CameraManagerApiClient.replaceRequest_get(prop.data.Id)
        .then(request=>{
            setSelectedRequest(request)
            setSelectedRequestCamera({
                ...DEFAULT_VALUES.requestCameraAdd,
                SiteName:prop.data.SiteName,
                index:-1,
            })
            setformLoading(false)
        })
    }
    function deleteitem(request: IRequestCameraLight, option?: ColumnBodyOptions){
        if(request.RequestTypeCode==="ADD"){
            CameraManagerApiClient.addRequest_get(prop.data.Id)
            .then(request=>{
                let requestTemp = request
                requestTemp?.Cameras.splice(option?.rowIndex, 1);
                if(requestTemp?.RequestTypeCode==="ADD"){
                    CameraManagerApiClient.addRequest_put(requestTemp.Id,requestTemp)
                    .then((result)=>{
                        if(result){
                            toast.current?.show({ severity: 'info', summary: 'Confirmation', detail: 'Requête modifiée avec succès', life: 3000 });
                        }
                        else{
                            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la modification', life: 3000 });
                        }
                        loadData()
                    })
                }
            })
        }
        if(request.RequestTypeCode==="REP"){
            CameraManagerApiClient.replaceRequest_get(prop.data.Id)
            .then(request=>{
                let requestTemp = request
                requestTemp?.Cameras.splice(option?.rowIndex, 1);
                if(requestTemp?.RequestTypeCode==="REP"){
                    CameraManagerApiClient.replaceRequest_put(requestTemp.Id,requestTemp)
                    .then((result)=>{
                        if(result){
                            toast.current?.show({ severity: 'info', summary: 'Confirmation', detail: 'Requête modifiée avec succès', life: 3000 });
                        }
                        else{
                            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la modification', life: 3000 });
                        }
                        loadData()
                    })
                }
            })
        }
    }
    return(
        <div className="request-expended">
            <Toast ref={toast} />
            <Dialog
                visible={formAddvisible}
                modal
                onHide={() => {if (!formAddvisible) return; setformAddvisible(false); }}
                content={formAddTemplate}
            />
             <Dialog
                visible={formReplaceVisible}
                modal
                onHide={() => {if (!formReplaceVisible) return; setformReplaceVisible(false); }}
                content={formReplaceTemplate}
            />
            <TableRequestCameraLight requests={RequestCameraLights} selectionMode={undefined} onEdit={edit} onAdd={prop.data.RequestType==="Add"?add:addreplcae} onDelete={deleteitem}/>
        </div>
       
    )
}