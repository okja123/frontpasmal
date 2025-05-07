import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { CameraManagerApiClient } from "../../Utils/CameraManagerClientApi";
import TableRequestCameraDeleteLight from "../../Components/Table/TableRequestCameraDelete/TableRequestCameraDeleteLight";
import { IRequestCameraDeleteLight } from "../../Utils/Interfaces/IRequestCameraDeleteLight";

interface IProp{
    platform : string
}
export default function RequestCameraDeletes(prop:IProp){
    const [RequestCameraDeletes, setRequestCameraDeletes] = useState<IRequestCameraDeleteLight[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);
    useEffect(() => {
        loadData()
    }, []);
    function loadData(){
        setLoading(true)
        CameraManagerApiClient.site_getRequestCameraDelete(prop.platform)
        .then(requestCameraDeletes=>{
            setRequestCameraDeletes(
                requestCameraDeletes.map(
                    (requestCameraDelete)=>{
                        return{
                            ...requestCameraDelete,
                            RequestDate:new Date(requestCameraDelete.RequestDate),
                            DeleteDate:requestCameraDelete.DeleteDate?new Date(requestCameraDelete.DeleteDate):null
                        }
                    }
                )
            )
            setLoading(false)
        }); 
    }
    function deleteRequestCameraDelete(requestCameraDelete:IRequestCameraDeleteLight){
        CameraManagerApiClient.requestCameraDelete_Delete(prop.platform,requestCameraDelete.CameraGuidCamera)
        .then((result:boolean)=>{
            console.log(result)
            if(result){
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Demende de suppression envoyer', life: 3000 });
            }
            else{
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'La demende de suppression existe deja', life: 3000 });
            }
            loadData()
        })
        .catch(error=>{
            if(error.status===400)
            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'La demende de suppression existe deja', life: 3000 });
            loadData()
        })
    }
    return(
        <div className='request-camera-deletes'>
            <Toast ref={toast} />
            <TableRequestCameraDeleteLight requestCameraDeletes={RequestCameraDeletes} selectionMode={undefined} loading={loading} onDelete={deleteRequestCameraDelete}></TableRequestCameraDeleteLight>
        </div>
    )
}