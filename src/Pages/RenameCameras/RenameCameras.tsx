import { Toast } from "primereact/toast";
import { useState, useRef, useEffect } from "react";
import { CameraManagerApiClient } from "../../Utils/CameraManagerClientApi";
import { IRenameCamera } from "../../Utils/Interfaces/IRenameCamera";
import TableRenameCamera from "../../Components/Table/TableRenameCamera/TableRenameCamera";

interface IProp{
    platform : string
}
export default function RenameCameras(prop:IProp){
    const [RenameCameras, setRenameCameras] = useState<IRenameCamera[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);
    useEffect(() => {
        loadData()
    }, []);
    function loadData(){
        setLoading(true)
        CameraManagerApiClient.renameCamera_getAll()
        .then(renameCameras=>{
            setRenameCameras(
                renameCameras.map(
                    (renameCamera)=>{
                        return{
                            ...renameCamera,
                            RequestDate:renameCamera.RequestDate?new Date(renameCamera.RequestDate):undefined,
                            RenameDate:renameCamera.RenameDate?new Date(renameCamera.RenameDate):undefined,
                        }
                    }
                )
            )
            setLoading(false)
        }); 
    }
    return(
        <div className='request-camera-deletes'>
            <Toast ref={toast} />
            <TableRenameCamera requestCameraDeletes={RenameCameras} selectionMode={undefined} loading={false}/>
        </div>
    )
}