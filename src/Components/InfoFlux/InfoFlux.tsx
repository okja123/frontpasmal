import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";
import './InfoFlux.css'

import { CameraManagerApiClient } from "../../Utils/CameraManagerClientApi";
import { IVideoStream } from "../../Utils/Interfaces/IVideoStreamLight";

interface IProp{
    cameraId : string
}
export default function InfoFlux(prop :IProp){
    const [Fluxs, setFluxs] = useState<IVideoStream[]|null>(null);
        useEffect(() => {
            CameraManagerApiClient.camera_getVideoStreams(prop.cameraId)
            .then(fluxs=>{
                setFluxs(fluxs);
            });
        }, []);
    return(
        <TabView scrollable className="infoflux" >
            {Fluxs!==null && Fluxs.map((flux) => {
                return (
                    <TabPanel key={flux.Guid} header={flux.Name}>
                        <div className="grid">
                            <div className="cell">
                                <strong>Nom Flux :</strong>
                                {" "+flux.Name}
                            </div>
                            <div className="cell">
                                <strong>Adresse MultiCast :</strong>
                                {" "+flux.MulticastAdress}
                            </div>
                            <div className="cell">
                                <strong>Guid Flux :</strong>
                                {" "+flux.Guid}
                            </div>
                            <div className="cell">
                                <strong>Bits par seconde :</strong>
                                {" "+flux.BitRate}
                            </div>
                            <div className="cell">
                                <strong>Qualité :</strong>
                                {" "+flux.ImageQuality}
                            </div>
                            <div className="cell">
                                <strong>Images par seconde :</strong>
                                {" "+flux.FrameRate}
                            </div>
                            <div className="cell">
                                <strong>Intervalle Images Clés :</strong>
                                {" "+flux.KeyFrameInterval}
                            </div>
                            <div className="cell">
                                <strong>Image rognée ? :</strong>
                                {" "+flux.IsImageCropped?"oui":"non"}
                            </div>
                            <div className="cell">
                                <strong>Intervalle Enregistrement d'image :</strong>
                                {" "+flux.RecordingFrameInterval}
                            </div>
                            <div className="cell">
                                <strong>Résolution X :</strong>
                                {" "+flux.ResolutionX}
                            </div>
                            <div className="cell">
                                <strong>Résolution Y :</strong>
                                {" "+flux.ResolutionY}
                            </div>
                            <div className="cell">
                                <strong>Usage(s) du flux :</strong> 
                                {" "+flux.Usages.map(usage=>usage+",")}
                            </div>
                        </div>
                    </TabPanel>
                );
            })}
        </TabView> 
    )
}