import { useEffect, useState } from "react";
import { CameraManagerApiClient } from "../../../Utils/CameraManagerClientApi";
import { set } from "react-hook-form";

interface IProp{
    plateform:string,
    guid:string,
}
export default function CameraSnapshot(prop:IProp){
    const [image, setImage] = useState<string>("")
    useEffect(() => {
        CameraManagerApiClient.camera_getSnapshot(prop.guid,prop.plateform)
        .then((response) => {
            setImage(response);
        })
    }, []);
    return (
        <img className="camera-snapshot" src={`data:image/png;base64,${image}`} alt="Base64 Image" /> 
    );
}
                 