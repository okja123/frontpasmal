import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import FormRequest from "../../Components/Form/FormRequest/FormRequest";
import { Card } from "primereact/card";
import { Column, ColumnBodyOptions } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { useState, useRef, useEffect } from "react";
import TableRequest from "../../Components/Table/TableRequest/TableRequest";
import { IRequest } from "../../Utils/Interfaces/IRequest";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ScrollPanel } from "primereact/scrollpanel";
import { Importer, ImporterField, trTR } from "react-csv-importer";
import { IImportError } from "../../Utils/Interfaces/IImportError";
import { CameraManagerApiClient } from "../../Utils/CameraManagerClientApi";
import { ITreeStructure } from "../../Utils/Interfaces/ITreeStructure";
import { DataTableExpandedRows, DataTableRowExpansionTemplate, DataTableValueArray } from "primereact/datatable";
import { useNavigate } from "react-router-dom";
import RequestLights from "../Requests/Request";
import { DEFAULT_VALUES } from "../../Utils/DefaultValue";
import TableRequestCameraAdd from "../../Components/Table/TableRequestCameraAdd/TableRequestCameraAdd";
import { ICameraRequestAdd } from "../../Utils/Interfaces/IRequestCameraAdd";
import FormRequestCamera from "../../Components/Form/FormRequestCameraAdd/FormRequestCameraAdd";
import { confirmDialog } from "primereact/confirmdialog";

interface IProp{
    platform : string
}
export default function ImportRequest(prop:IProp){
    const headerElements = [
        <Button label="Importer des cameras" onClick={()=>{setIsImportVisible(true)}}></Button>,
        <Button label="Valider les requetes et envoyer" onClick={()=>{sendRequest()}}></Button>,
    ]
    const columns = [
        <Column
            key="isMissingInfo"
            field="isMissingInfo"
            header="Erreur"
            body={(data:IRequest) => {
                return(
                    <Tag
                        value={data.isMissingInfo?"Erreur":"OK"}
                        severity={data.isMissingInfo?"danger":"success"}
                        icon={data.isMissingInfo?"pi pi-times":"pi pi-check"}
                    ></Tag>
                )   
            }}
        />
    ]
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [myRequests, setMyRequests] = useState<IRequest[]>([]);
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isImportVisible, setIsImportVisible] = useState<boolean>(false);
    const [importError, setImportError] = useState<IImportError[]>([]);
    const [isFormRequestVisible, setIsFormRequestVisible] = useState<boolean>(false);
    const [isFormRequestCameraVisible, setIsFormRequestCameraVisible] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<IRequest>(null);
    const [selectedRequestCamera, setSelectedRequestCamera] = useState<ICameraRequestAdd>(null);
    const [index, setIndex] = useState([-1,-1]);
    useEffect(() => {
        if(!selectedRequest?.asChanged)return
        let myRequestTemp = myRequests 
        validateRequest(selectedRequest)
        myRequestTemp[index[0]] = selectedRequest
        setMyRequests([...myRequestTemp])
        
    }, [selectedRequest]);
    useEffect(() => {
        if(!selectedRequestCamera?.asChanged)return
        console.log(selectedRequestCamera)
        let myRequestTemp = myRequests 
        if(index[1]===-1){
            myRequestTemp[index[0]].Cameras.push(selectedRequestCamera)
        }else{
            myRequestTemp[index[0]].Cameras[index[1]] = selectedRequestCamera
        }
        validateRequest(myRequestTemp[index[0]])
        setMyRequests([...myRequestTemp])
    }, [selectedRequestCamera]);
    useEffect(() => {
        loadData()
    }, []);
    function loadData(){
    }
    function sendRequest(){
        if(myRequests.length===0){
            toast.current?.show({ severity: 'warn', summary: 'Erreur', detail: 'Aucune requete a envoyer', life: 3000 });
            return
        }
        if(!myRequests.every(request => request.isMissingInfo === false)){
            toast.current?.show({ severity: 'warn', summary: 'Erreur', detail: 'Veuillez corriger les erreurs avant de valider', life: 3000 });
            return
        }
        const accept = () => {
            let promises = myRequests.map(request=>{
                return CameraManagerApiClient.addRequest_post(request)
                    .then((response)=>{
                        console.log(response)
                        if(response){
                            toast.current?.show({ severity: 'success', summary: 'Demande envoyée', detail: 'Demande envoyée avec succès', life: 3000 });
                            return {result:true,name:request.MasaiCaseNumber}
                        }
                        else{
                            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la creation de la demande', life: 3000 });
                            return {result:false,name:request.MasaiCaseNumber}
                        }
                    })
            })
            Promise.all([...promises]).then((results)=>{
                console.log(results)
                if(results.every(result => result.result === true)){
                    setMyRequests([])
                    navigate("/requests")
                }
                results.forEach(result=>{
                    let myrequestsTemp = myRequests
                        let index = myrequestsTemp.findIndex(request=>request.MasaiCaseNumber == result.name)
                    if(result.result == true){
                        myrequestsTemp.splice(index,1)
                    }
                    else{
                        myrequestsTemp[index].isMissingInfo = true
                    }
                    setMyRequests([...myrequestsTemp])
                })
                
            })
        }
        const reject = () => {
            toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
        confirmDialog({
            message: "Êtes-vous sûr d'envoyer les demandes ?",
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept:()=>accept(),
            reject
        });
    }
    function formRequestTemplate(){
        let hide = ()=>{
            setIsFormRequestVisible(false)
        }
        return(
            <FormRequest hide={hide} request={selectedRequest} setitem={setSelectedRequest}></FormRequest>
        )
    }
    function formRequestCameraTemplate(){
        let hide = ()=>{
            setIsFormRequestCameraVisible(false)
        }
        return(
            <FormRequestCamera hide={hide} requestCamera={selectedRequestCamera} setRequestCamera={setSelectedRequestCamera}></FormRequestCamera>
        )
    }
    function editRequest(request: IRequest, option: ColumnBodyOptions){  
        setSelectedRequest(request)
        setIsFormRequestVisible(true)
        setIndex([option.rowIndex])
    }
    function deleteRequest(request: IRequest, option: ColumnBodyOptions){
        let myRequestTemp = myRequests 
        myRequestTemp.splice(option.rowIndex,1)
        setMyRequests([...myRequestTemp])
    }

    function dataTransformation(rows:[]){
        return Promise.all([
            CameraManagerApiClient.site_getTreeStructures("ORY"),
            CameraManagerApiClient.site_getTreeStructures("CDG"),
            CameraManagerApiClient.site_getTreeStructures("LBG"),
        ])
        .then(values=>{
            let errorsTemp:IImportError[] = []
            let dictRequestsTemp: Record<string, IRequest> = {}
            rows.forEach((row:any) => {
                if(row["DemendeMasail"] == "" || row["DemendeMasail"] == undefined){
                    return
                }
                let error:IImportError = null
                let demendeMasailrequest = row["DemendeMasail"].split("//")[0]
                let demendeMasailcamera = row["DemendeMasail"].split("//")[1]
                let retentionPeriod = null
                try{
                    // on match 10 ou 30  le plus a droite
                    retentionPeriod = Number(row["RetentionPeriod"].split("").reverse().join("").match(/(03)|(01)/g)[0].split("").reverse().join(""));
                }
                catch(e){
                    error = {
                        error: "Durée d'enregistrement non valide : " + row["RetentionPeriod"],
                        NameCamera: row["MasailCaseNumber"],
                    }
                    errorsTemp.push(error)
                }
                if(dictRequestsTemp[demendeMasailrequest]===undefined){
                    dictRequestsTemp[demendeMasailrequest] = {
                        Id: 0,
                        Title: "untitled-" + demendeMasailrequest,
                        SiteName:"",
                        MasaiCaseNumber: demendeMasailrequest,
                        Comment: "",
                        LastUpdate: new Date(),
                        NumberOfCamerasRequested: -1,
                        RequestType: "Add",
                        RequestTypeCode: "ADD",
                        RequestState:"In progress",
                        RequestStateCode:"PROG",
                        Cameras: [],
                        NumberOfCameras: 0,
                        NumberOfRequestCameraByStates: [],
                        ServiceCode: "",
                        LicenseName: "",
                        LicensePoolId: -1,
                        LicenseId: -1,
                        ServiceName: "",
                    }
                }
                dictRequestsTemp[demendeMasailrequest].NumberOfCameras=dictRequestsTemp[demendeMasailrequest].NumberOfCameras+1
                let treeStructures = (row["TreeStructures"]+"|"+row["TreeStructures2"]+"|"+row["TreeStructures3"]).split("|").map((path:string)=>{
                    if(path == ""||path =="undefined") return undefined
                    let treeStructure =  findTreeStructure([values[0],values[1],values[2]],path )
                    if (treeStructure == undefined){
                        error = {
                            error: "Arborescence introuvable : " + path,
                            NameCamera: row["MasailCaseNumber"],
                        }
                        errorsTemp.push(error)
                    }
                    else{
                        if(dictRequestsTemp[demendeMasailrequest].SiteName === ""){
                            dictRequestsTemp[demendeMasailrequest].SiteName = treeStructure.SiteName
                        }
                    }
                    return treeStructure
                })
                treeStructures = treeStructures.filter(treeStructure=>treeStructure != undefined)
                dictRequestsTemp[demendeMasailrequest].Cameras.push({
                    ...DEFAULT_VALUES.requestCameraAdd,
                    ...row,
                    MasaiCaseNumber: demendeMasailcamera,
                    IsPingOk: row["Ping"] == "OK" ? true : false,
                    RetentionPeriod: retentionPeriod,
                    TreeStructures: treeStructures,
                    NameCamera:row["libelle"],
                    isMissingInfo: error !== null,
                    ArchiverGuid:null,
                    SiteName:null
                })
            })
            setImportError(errorsTemp)
            let requestsTemp:IRequest[] = Object.keys(dictRequestsTemp).map((key:string) => {
                return dictRequestsTemp[key] as IRequest
            })
            requestsTemp.forEach(request=>{
                validateRequest(request)
            })
            setMyRequests((prevRequests) => {
                requestsTemp = requestsTemp.map(newRequest=>{
                    let oldRequest = prevRequests.find(oldRequest=>{
                        console.log(newRequest.MasaiCaseNumber,oldRequest.MasaiCaseNumber)
                        return newRequest.MasaiCaseNumber===oldRequest.MasaiCaseNumber
                    })
                    
                    if(oldRequest===undefined){
                        return newRequest
                    }
                    else{
                        oldRequest.Cameras.push(...newRequest.Cameras)
                        oldRequest.NumberOfCameras = oldRequest.Cameras.length
                        return null
                    }
                })
                requestsTemp = requestsTemp.filter(item => item !== null)
                console.log(requestsTemp)
                return [...prevRequests, ...requestsTemp]
            })
            setLoading(false)
        })
    }
    function validateRequest(request:IRequest){
        let isMissingInfo = false
        request.Cameras.forEach(camera=>{
            if(camera.isMissingInfo){
                isMissingInfo = true
            }
        })
        if(request.SiteName!==""){
            request.Cameras.forEach(camera=>{
                camera.SiteName=request.SiteName
            })
        }
        if(request.LicensePoolId == -1 || request.LicenseId == -1){
            isMissingInfo = true
        }
        if(request.NumberOfCamerasRequested == -1){
            isMissingInfo = true
        }
        request.isMissingInfo = isMissingInfo
    }
    function findTreeStructure(treeStructures:ITreeStructure[], path:string):ITreeStructure|undefined
    {
        let pathSplitted = path.split("\\")
        let treesttucture = treeStructures.find(treeStructure=>{
            let a = pathSplitted[0].normalize("NFD").replace(/[^\w\s]/g, '').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s/g, '')
            let b = treeStructure.Name.normalize("NFD").replace(/[^\w\s]/g, '').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s/g, '')
            return a == b
        })

        if(treesttucture == undefined){
            return undefined
        }
        if(treesttucture.Children.length == 0){
            return treesttucture
        }
        return findTreeStructure(treesttucture.Children, pathSplitted.slice(1).join("\\"))
    }
    function importTemplate(){
        return(
            <Card style={{width:"80vw"}}>
                <Button icon="pi pi-times" rounded severity="danger" onClick={()=>setIsImportVisible(false)}/>
                <ScrollPanel style={{ width: '100%', height: '60vh' }}>
                <Importer
                    skipEmptyLines={true}
                    dataHandler={async (rows) => {
                        await dataTransformation(rows)
                    }}
                    >
                    <ImporterField name="LogicalId" label="ID Security Center" optional/>
                    <ImporterField name="Building" label="BÂTIMENT" optional/>
                    <ImporterField name="Local" label="Local" optional/>
                    <ImporterField name="NameUnit" label="Nom DNS" />
                    <ImporterField name="IPAddress" label="Adresse Ip"/>
                    <ImporterField name="Bay" label="Baie" optional/>
                    <ImporterField name="Switch" label="Switch" optional/>
                    <ImporterField name="Ping" label="PING" />
                    <ImporterField name="DemendeMasail" label="Demande masai" />
                    <ImporterField name="libelle" label="Libellé de la Caméra"/>
                    <ImporterField name="TreeStructures" label="Arborescence Security Center" />
                    <ImporterField name="TreeStructures2" label="Arborescence Security Center 2" optional/>
                    <ImporterField name="TreeStructures3" label="Arborescence Security Center 3" optional/>
                    <ImporterField name="RetentionPeriod" label="Qualité et durée d'enregistrement" />
                    <ImporterField name="SecurityCenterOk" label="Security Center" />
                    <ImporterField name="ConfigurationItemNumber" label="CI Equipement" />
                    <ImporterField name="info" label="INFORMATION COMPLEMENTAIRE" />
                    
                </Importer>
                {
                    importErrorTemplate()
                }
                </ScrollPanel>
            </Card>
        )
    }
    function importErrorTemplate(){
        return(
            <>
                {
                    importError.map((error, index) => {
                        return(
                            <>
                            <div><span style={{color:"red"}}>Erreur</span>  Camera : {error.NameCamera} {error.error}</div><br/>
                            </>
                        )
                    })
                }
            </>
        )
    }
    function rowExpansionTemplate(data: IRequest, options: DataTableRowExpansionTemplate){
        function add(){
            setSelectedRequestCamera({
                ...DEFAULT_VALUES.requestCameraAdd,
                SiteName:data.SiteName,
            })
            setIsFormRequestCameraVisible(true)
            setIndex([options.index,-1])
        }
        function deleteRequestCamera(request: ICameraRequestAdd, option: ColumnBodyOptions){
            let myRequestTemp = myRequests 
            myRequestTemp[options.index].Cameras.splice(option.rowIndex,1)
            setMyRequests([...myRequestTemp])
        }
        function editRequestCamera(request: ICameraRequestAdd, option: ColumnBodyOptions){
            setSelectedRequestCamera(request)
            setIsFormRequestCameraVisible(true)
            setIndex([options.index,option.rowIndex])
        }
        return(
            <TableRequestCameraAdd requests={data.Cameras} selectionMode={undefined} validation={true} onAdd={add} onDelete={deleteRequestCamera} onEdit={editRequestCamera}/>
        )
    }
    return(
        <div className='request-camera-deletes'>
            <Toast ref={toast} />
            <Dialog
                visible={isImportVisible}
                onHide={() => {if (!isImportVisible) return; setIsImportVisible(isImportVisible); }}
                content={importTemplate}
            />
            <Dialog
                visible={isFormRequestVisible}
                onHide={() => {if (!isFormRequestVisible) return; setIsFormRequestVisible(isFormRequestVisible); }}
                content={formRequestTemplate}
            />
            <Dialog
                visible={isFormRequestCameraVisible}
                onHide={() => {if (!isFormRequestCameraVisible) return; setIsFormRequestCameraVisible(isFormRequestVisible); }}
                content={formRequestCameraTemplate}
            />
            <Toast ref={toast} />
            <TableRequest 
                onDelete={deleteRequest} 
                onEdit={editRequest} 
                requests={myRequests} 
                selectionMode={undefined} 
                headerElements={headerElements} 
                columns={columns} 
                onExpend={rowExpansionTemplate}
            />
        </div>
    )
}