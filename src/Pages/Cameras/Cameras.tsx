import { useEffect, useRef, useState } from 'react';
import TableCamera from '../../Components/Table/TableCamera/TableCamera';
import { ICamera } from '../../Utils/Interfaces/ICamera';
import './Cameras.css';
import { CameraManagerApiClient } from '../../Utils/CameraManagerClientApi';
import { IRequestCameraLight } from '../../Utils/Interfaces/IRequestCameraLight';
import { IRequestLight } from '../../Utils/Interfaces/IRequestLight';
import { Toast } from 'primereact/toast';
import { IRequestCameraDelete } from '../../Utils/Interfaces/IRequestCameraDelete';
import Mapper from '../../Utils/Mapper';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { IRenameCamera } from '../../Utils/Interfaces/IRenameCamera';
import FormRenameCamera from '../../Components/Form/FormRenameCamera/FormRenameCamera';
interface IProp{
    platform : string
}
export default function Cameras(prop:IProp){
    const [Cameras, setCameras] = useState<ICamera[]>([]);
    const [loading, setLoading] = useState(true);
    const [formvisible, setformVisible] = useState(false);
    const [RenameCameraSelected, setRenameCameraSelected] = useState<IRenameCamera|null>(null);
    const [CameraSelected, setCameraSelected] = useState<ICamera|null>(null);
    const toast = useRef<Toast>(null);
    useEffect(() => {
       if(!RenameCameraSelected?.asChanged)return
        CameraManagerApiClient.renameCamera_post(RenameCameraSelected)
        .then((result:boolean)=>{
            console.log(result)
            if(result){
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Demende de renommage envoyer', life: 3000 });
            }
            else{
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'La demende de renommage existe deja', life: 3000 });
            }
        })
    }, [RenameCameraSelected]);
    useEffect(() => {
        loadData()
    }, []);
    function loadData(){
        setLoading(true)
        Promise.all([
            CameraManagerApiClient.site_getRequestCameraLights(prop.platform),
            CameraManagerApiClient.site_getCameras(prop.platform),
            CameraManagerApiClient.site_getRequestLights(prop.platform),
        ])
        .then(values=>{
            
            let dictionnaryRequestCamera = Object.assign({}, ...values[0].map(({NameCamera, ...rest}) => ({[NameCamera]: rest}))) as Record<string,IRequestCameraLight>;
            let dictionnaryRequest = Object.assign({}, ...values[2].map(({Id, ...rest}) => ({[Id]: rest})))as Record<string,IRequestLight>;
            let camerasTemp : ICamera[] = []
            let requestTemp :IRequestLight;
            let requestCameraTemp :IRequestCameraLight;
            let serviceName: string;
            let idSecurityCenter: number;

            values[1].forEach(camera => {
                if(camera.NameCamera in dictionnaryRequestCamera){
                    requestCameraTemp = dictionnaryRequestCamera[camera.NameCamera];
                    idSecurityCenter = requestCameraTemp.LogicalId
                }
                if(requestCameraTemp!==undefined && requestCameraTemp.RequestId in dictionnaryRequest){
                    requestTemp = dictionnaryRequest[requestCameraTemp.RequestId];
                    serviceName =  requestTemp.ServiceName
                }
                camerasTemp.push({
                    ...camera,
                    ServiceName:serviceName,
                    SecurityCenterId:idSecurityCenter,
                })
            });
            setCameras(camerasTemp)
            setLoading(false)
        }); 
    }
    function deleteCamera(camera:ICamera){
        let requestCameraDelete:IRequestCameraDelete = Mapper.mapToRequestCameraDelete(camera)
        CameraManagerApiClient.requestCameraDelete_post(requestCameraDelete)
        .then((result:boolean)=>{
            console.log(result)
            if(result){
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Demende de suppression envoyer', life: 3000 });
            }
            else{
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'La demende de suppression existe deja', life: 3000 });
            }
        })
        .catch(error=>{
            if(error.status===500)
            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'La demende de suppression existe deja', life: 3000 });
        })
    }
    function edit(camera:ICamera){
        setCameraSelected(camera)
        setformVisible(true)
    }
    function formTemplate(){
        let hide = ()=>{
            setformVisible(false)
        }
        return(
            <FormRenameCamera hide={hide} item={RenameCameraSelected} setitem={setRenameCameraSelected} camera={CameraSelected}></FormRenameCamera>
        )
    }
    return(
        <div className='cameras'>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Dialog
                visible={formvisible}
                modal
                onHide={() => {if (!formvisible) return; setformVisible(false); }}
                content={formTemplate}
            />
            <TableCamera onDelete={deleteCamera}loading={loading}cameras={Cameras} selectionMode="single" onEdit={edit}></TableCamera>
        </div>
    )
}