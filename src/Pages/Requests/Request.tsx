import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { CameraManagerApiClient } from "../../Utils/CameraManagerClientApi";
import { IRequestLight } from "../../Utils/Interfaces/IRequestLight";
import TableRequestLight from "../../Components/Table/TableRequestLight/TableRequestLight";

import RequestExpended from "../../Components/Request/RequestExpended/RequestExpended";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";

import { ColumnBodyOptions } from "primereact/column";
import FormRequest from "../../Components/Form/FormRequest/FormRequest";
import { IRequest } from "../../Utils/Interfaces/IRequest";

interface IProp{
    platform : string
}
export default function RequestLights(prop:IProp){

    const [RequestLights, setRequestLights] = useState<IRequestLight[]>([]);
    const [loading, setLoading] = useState(true);

    const [formAddvisible, setformAddVisible] = useState(false);
    const [formReplaceVisible, setformReplaceVisible] = useState(false);
    const [formLoading, setformLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<IRequest>();
    const toast = useRef<Toast>(null);

    useEffect(() => {
        if(!selectedRequest?.asChanged)return
        if(selectedRequest?.RequestTypeCode==="ADD"){
            CameraManagerApiClient.addRequest_put(selectedRequest.Id,selectedRequest)
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
        if(selectedRequest?.RequestTypeCode==="REP"){
            console.log(selectedRequest)
            CameraManagerApiClient.replaceRequest_put(selectedRequest.Id,selectedRequest)
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
    }, [selectedRequest]);
    useEffect(() => {
        loadData()
    }, []);
    function loadData(){
        setLoading(true)
        CameraManagerApiClient.site_getRequestLights(prop.platform)
        .then(requests=>{
            setRequestLights(requests.map((request)=>{
                return {
                    ...request,
                    LastUpdate:request.LastUpdate?new Date(request.LastUpdate):undefined
                }
            }))
            setLoading(false)
        });
    }
    function formAddTemplate(){
        let hide = ()=>{
            setformAddVisible(false)
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
                    <FormRequest hide={hide} request={selectedRequest} setitem={setSelectedRequest} asHeader={true}></FormRequest>
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
                    <FormRequest hide={hide} request={selectedRequest} setitem={setSelectedRequest} asHeader={true}></FormRequest>
                }
            </>
        )
    }
    function edit(request: IRequestLight, option?: ColumnBodyOptions){

        if(request.RequestType ==="Add"){
            setformAddVisible(true)
            setformLoading(true)
            CameraManagerApiClient.addRequest_get(request.Id)
            .then(request=>{
                setSelectedRequest(request)
                setformLoading(false)
                loadData()
            })
        }
        if(request.RequestType ==="Replace"){
            setformReplaceVisible(true)
            setformLoading(true)
            CameraManagerApiClient.replaceRequest_get(request.Id)
            .then(request=>{
                setSelectedRequest(request)
                setformLoading(false)
                loadData()
            })
        }
    }
    function deleteItem(request: IRequestLight, option?: ColumnBodyOptions){
        if(request.RequestType ==="Add"){
            CameraManagerApiClient.addRequest_delete(request.Id)
            .then((result)=>{
                if(result){
                    toast.current?.show({ severity: 'info', summary: 'Confirmation', detail: 'Requete supprimer', life: 3000 });
                }
                else{
                    toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppresion', life: 3000 });
                }
                loadData()
            })
        }
        if(request.RequestType ==="Replace"){
            CameraManagerApiClient.replaceRequest_delete(request.Id)
            .then((result)=>{
                if(result){
                    toast.current?.show({ severity: 'info', summary: 'Confirmation', detail: 'Requete supprimer', life: 3000 });
                }
                else{
                    toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppresion', life: 3000 });
                }
                loadData()
            })
        }
    }
    return(
        <div className='request-camera-deletes'>
            <Toast ref={toast} />
            <Dialog
                visible={formAddvisible}
                modal
                onHide={() => {if (!formAddvisible) return; setformAddVisible(false); }}
                content={formAddTemplate}
            />
            <Dialog
                visible={formReplaceVisible}
                modal
                onHide={() => {if (!formReplaceVisible) return; setformReplaceVisible(false); }}
                content={formReplaceTemplate}
            />
            <Toast ref={toast} />
            <TableRequestLight onDelete={deleteItem} onEdit={edit} requests={RequestLights} selectionMode={undefined} onExpend={(rowData,option) => <RequestExpended data={rowData} options={option} />}/>
        </div>
    )
}