import { useEffect, useState } from "react";
import './Infotext.css'
import { CameraManagerApiClient } from "../../../Utils/CameraManagerClientApi";
import PieChart from "../PieChart/PieChart";

interface IProp{
    platform:string;
}
export default function InfoText(prop:IProp){
    const [totalCamera, setTotalCamera] = useState<number>(-1);
    const [actualRequests, setActualRequests] = useState<number>(-1);
    const [requestsMLI, setRequestsMLI] = useState<number>(-1);
    const [requestsDSIA, setRequestsDSIA] = useState<number>(-1);

    const [licenseTotal, setLicenseTotal] = useState<number>(-1);
    const [licenseUsed, setLicenseUsed] = useState<number>(-1);
    const [licenseCommand, setLicenseCommand] = useState<number>(-1);
    const [licenseCommandInvoiced, setLicenseCommandInvoiced] = useState<number>(-1);
    const [licensePool, setLicensePool] = useState<number>(-1);
    const [licensePoolOpen, setLicensePoolOpen] = useState<number>(-1);
    useEffect(() => {
        Promise.all([
            //attention l ordre importe!

            CameraManagerApiClient.site_nbrCamera(prop.platform),
            CameraManagerApiClient.site_nbrCameraIntegration(prop.platform),
            CameraManagerApiClient.site_nbrCameraRequestIntegration(prop.platform),

            CameraManagerApiClient.site_nbrLicence(prop.platform),
            CameraManagerApiClient.site_nbrLicenceUsed(prop.platform),
            CameraManagerApiClient.site_nbrLicencePool(prop.platform),
            CameraManagerApiClient.site_nbrLicencePoolOpen(prop.platform),
            CameraManagerApiClient.site_nbrLicenceCommand(prop.platform),
            CameraManagerApiClient.site_nbrLicenceCommandInvoiced(prop.platform),
        ])
        .then((values)=>{
            setTotalCamera(values[0]);
            setRequestsDSIA(values[1]);
            setRequestsMLI(values[2]);

            setLicenseTotal(values[3]);
            setLicenseUsed(values[4]);
            setLicensePool(values[5]);
            setLicensePoolOpen(values[6]);
            setLicenseCommand(values[7]);
            setLicenseCommandInvoiced(values[8]);
        })
      }, []);
      return(
        <div className="infotext">
            <div>
                <p> Il y a actuellement <strong> {totalCamera} caméras </strong> sur la plateforme de {prop.platform}. </p>
                <p> {actualRequests} demandes d'intégration de caméras sont actuellement en cours sur cet outil sur {localStorage.platform}, dont :</p>
                <ul>
                    <li> <strong> {requestsMLI} demandes </strong> sont en attente d'action du MLI/Déploiement </li>
                    <li> <strong> {requestsDSIA} demandes </strong> sont en attente d'action de DSIA </li>
                </ul>
                <p> Il y a actuellement <strong> {licenseTotal} licences </strong> sur la plateforme de {prop.platform}, dont {licenseUsed} utilisées </p>
                <ul>
                    <li> <strong> {licensePool} </strong> groupes de licence, dont {licensePoolOpen} encore ouverts</li>
                    <li> <strong> {licenseCommand} </strong> commandes de licences, dont {licenseCommandInvoiced} facturées </li>
                </ul>
            </div>
            <PieChart platform={prop.platform}/>
        </div>
      )
}