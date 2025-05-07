
import { Card } from "primereact/card";
import { ScrollPanel } from "primereact/scrollpanel";
import './InfoCamera.css'
import { ICamera } from "../../Utils/Interfaces/ICamera";
import InfoFlux from "../InfoFlux/InfoFlux";


interface IProp{
    camera : ICamera|null,
}
export default function InfoCamera(prop:IProp){
    if(prop.camera!==null)
    return(
        <div className="infocamera">
            <ScrollPanel style={{ width: '100%',height : '100%'}} >
                <div className="grid">
                    <Card title="Site :" className="site">
                        <p className="m-0">
                            {prop.camera.SiteName}
                        </p>
                    </Card>
                    <Card title="Nom Caméra:" className="nom">
                        <p className="m-0">
                            {prop.camera.NameCamera}
                        </p>
                    </Card>
                    <Card title="ID Security Center:" className="idSecurityCenter">
                        <p className="m-0">
                            {prop.camera.SecurityCenterId}
                        </p>
                    </Card>
                    <Card title="Adresse IP:" className="ip">
                        <p className="m-0">
                            {prop.camera.IPAddress}
                        </p>
                    </Card>
                    <Card title="Mac Address:">
                        <p className="m-0">
                            {prop.camera.MacAddress}
                        </p>
                    </Card>
                    <Card title="Guid Caméra:">
                        <p className="m-0">
                            {prop.camera.GuidCamera}
                        </p>
                    </Card>
                    <Card title="Fabricant:">
                        <p className="m-0">
                            {prop.camera.Manufacturer}
                        </p>
                    </Card>
                    <Card title="Modèle:">
                        <p className="m-0">
                            {prop.camera.Model}
                        </p>
                    </Card>
                    <Card title="Derrnier Ping OK:">
                        <p className="m-0">
                            {prop.camera.LastPingOk?.toString()}
                        </p>
                    </Card>
                    <Card title="Description:">
                        <p className="m-0">
                            {prop.camera.DescriptionCamera}
                        </p>
                    </Card>
                    <Card title="Description Unité / Encodeur :">
                        <p className="m-0">
                            {prop.camera.DescriptionUnit}
                        </p>
                    </Card>
                    <Card title="Enregistrement Audio :">
                        <p className="m-0">
                            {prop.camera.AudioRecording?"Oui":"Non"}
                        </p>
                    </Card>
                    <Card title="Arborescence Security Center:" className="Arborecence">
                        <p className="m-0">
                            {prop.camera.TreeStructures}
                        </p>
                    </Card>
                    <Card title="Nom Unité / Encodeur :" className="nomencdeur">
                        <p className="m-0">
                            {prop.camera.NameUnit}
                        </p>
                    </Card>
                    <Card title="Guid Unité / Encodeur :" className="guidencodeur">
                        <p className="m-0">
                            {prop.camera.GuidUnit}
                        </p>
                    </Card>
                    <Card title="Nom Archiver:">
                        <p className="m-0">
                            {prop.camera.Archiver}
                        </p>
                    </Card>
                    <Card title="Guid Archiver:">
                        <p className="m-0">
                            {prop.camera.ArchiverGuid}
                        </p>
                    </Card>
                    <Card title="Durée de rétention d'images :">
                        <p className="m-0">
                            {prop.camera.RetentionPeriod} Jours
                        </p>
                    </Card>
                    <Card title="Archivage redondant :">
                        <p className="m-0">
                            {prop.camera.RedundantArchiving?'Oui':'Non'}
                        </p>
                    </Card>
                </div>
                <h2>Ses Flux</h2>
                <Card>
                    <InfoFlux cameraId={prop.camera.GuidCamera}></InfoFlux>
                </Card>           
            </ScrollPanel>
        </div>
    )
}