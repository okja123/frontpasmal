import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { InputMask } from "primereact/inputmask";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { ToggleButton } from "primereact/togglebutton";
import { TreeNode } from "primereact/treenode";
import { TreeSelect, TreeSelectEventNodeEvent } from "primereact/treeselect";
import { classNames } from "primereact/utils";
import { useRef, useState, useEffect } from "react";
import { useForm, FormProvider, Controller, set } from "react-hook-form";
import { CameraManagerApiClient } from "../../../Utils/CameraManagerClientApi";
import { DEFAULT_VALUES } from "../../../Utils/DefaultValue";
import { IArchiver } from "../../../Utils/Interfaces/IArchiver";
import { ICameraModel } from "../../../Utils/Interfaces/ICameraModel";
import { ICameraRequestReplace } from "../../../Utils/Interfaces/IRequestCameraReplace";
import { IRequestCameraState } from "../../../Utils/Interfaces/IRequestCameraState";
import { ITreeStructure } from "../../../Utils/Interfaces/ITreeStructure";
import Mapper from "../../../Utils/Mapper";
import FormFlux from "../FormFlux/FormFlux";
import { ICamera } from "../../../Utils/Interfaces/ICamera";

interface IProp{
    hide :()=>void,
    requestCamera:ICameraRequestReplace|null,
    setRequestCamera:(requestCamera:ICameraRequestReplace|ICameraRequestReplace|null)=>void
}
export default function FormRequestCameraReplace(prop:IProp){
    if(prop.requestCamera===null||prop.requestCamera.Type===null){
        return(
            <div>
                error
            </div>
        )
    }
    let methodes
    if(prop.requestCamera.Type === "ICameraRequestReplace"){
        const defaultValues:ICameraRequestReplace = DEFAULT_VALUES.requestCameraAdd
        methodes = useForm<ICameraRequestReplace>({defaultValues});
    }
    else{
        const defaultValues:ICameraRequestReplace = DEFAULT_VALUES.requestCameraAdd
        methodes = useForm<ICameraRequestReplace>({defaultValues});
    }
    const { control , formState: { errors }, handleSubmit, reset ,watch} = methodes

    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [formState, setFormState] = useState<number>(0);
    const [iploading, setipLoading] = useState<boolean>(false);
    const [macloading, setmacLoading] = useState<boolean>(false);
    const [archivers, setArchivers] = useState<IArchiver[]>([]);
    const [models, setModels] = useState<ICameraModel[]>([]);
    const [cameraRequestStates, setCameraRequestStates] = useState<IRequestCameraState[]>([]);
    const [dureeEnregistrements, setDureeEnregistrements] = useState<string[]>([]);
    const [treeStructures, setTreeStructures] = useState<ITreeStructure[]>([]);
    const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
    const [cameras, setCameras] = useState<ICamera[]>([]);
    const [selectedNodes, setSelectedNodes] = useState<any>({});
    const [selectedNodeKeys, setSelectedNodeKeys] = useState<any>({});
    const IsDefaultPassword = watch("IsDefaultPassword"); 
    const [filterValue, setFilterValue] = useState<string>('');
    const onSubmit = (data:any) => {
        let mytreestructure:ITreeStructure[]=[]
        Object.keys(data.TreeStructures).forEach(function(key) {
            mytreestructure.push({
                Guid:data.TreeStructures[key].id,
                SiteName:data.TreeStructures[key].data.SiteName,
                Name:data.TreeStructures[key].label,
                Description:data.TreeStructures[key].data.Description,
                CompleteTree:"",
                CompleteTreeGuid:[],
                ParentGuid:data.TreeStructures[key].data.ParentGuid,
                Children:[]
            })
        });
        let formateditem:ICameraRequestReplace = {
            ...data,
            ArchiverName:data.ArchiverGuid?.Name,
            DescriptionUnit:data.ArchiverGuid?.Description,
            Manufacturer:data.Model?.Manufacturer,
            Model:data.Model?.Product,
            TreeStructures:mytreestructure,
            ArchiverGuid:data.ArchiverGuid?.Guid,
            Login:data.IsDefaultPassword?"":data.Login,
            Password:data.IsDefaultPassword?"":data.Password,
            SiteName:prop.requestCamera?.SiteName,
            RetentionPeriod: Number(data.RetentionPeriod.split(" ")[0]),
            asChanged:true,
            isMissingInfo:false,
            CameraToDeleteGuid:data.CameraToDeleteGuid?.GuidCamera,
            VideoUnitToDeleteGuid:data.CameraToDeleteGuid?.GuidUnit,
        }
        prop.setRequestCamera(formateditem)
        prop.hide()
        reset()
    };
    useEffect(() => {
        Promise.all([
            CameraManagerApiClient.site_getArchivers(prop.requestCamera?.SiteName),
            CameraManagerApiClient.cameraModel_getAll(),
            CameraManagerApiClient.dureeEnregistrement_getAll(),
            CameraManagerApiClient.site_getTreeStructures(prop.requestCamera?.SiteName),
            CameraManagerApiClient.site_getCameras(prop.requestCamera?.SiteName),
        ])
        .then((results=>{
            setArchivers(results[0]);
            setModels(results[1]);
            setDureeEnregistrements(results[2]);
            setTreeNodes(Mapper.mapToTreeNodes([results[3]],""))
            setTreeStructures([results[3]]);
            setCameras(results[4]);
            setLoading(false)
        }))
    }, []);
    useEffect(() => {
        if(loading||prop.requestCamera===null)return
        let archiver = archivers.find(archiver=>{
            return archiver.Guid===prop.requestCamera?.ArchiverGuid
        })
        let model = models.find(model=>{
            return model.Product===prop.requestCamera?.Model
        })
        let cameraToReplace = cameras.find(camera=>{
            return camera.GuidCamera===prop.requestCamera?.CameraToDeleteGuid
        })
        if(prop.requestCamera.TreeStructures.length>0&&typeof prop.requestCamera.TreeStructures[0] === "string"){
            prop.requestCamera.TreeStructures.forEach((path:string)=>{
                let treestructure = findTreeStructure(treeStructures,path)
                if(treestructure!==undefined){
                    let treeNode:TreeNode = Mapper.mapToTreeNodes([treestructure],"")[0]
                    let treeNodeKeysTemp = selectedNodeKeys;
                    selectedNodeKeys[treeNode.key] = true;
                    setSelectedNodeKeys(treeNodeKeysTemp);
                    let treeNodesTemp = selectedNodes;
                    selectedNodes[treeNode.key] = treeNode;
                    setSelectedNodes(treeNodesTemp);
                }
            })
        }else{
            prop.requestCamera.TreeStructures.forEach((tree:ITreeStructure)=>{
                let treeNodeKeysTemp = selectedNodeKeys;
                selectedNodeKeys[tree.Guid] = true;
                setSelectedNodeKeys(treeNodeKeysTemp);
            })
            let selectedNodesTemp = Mapper.mapToTreeNodes(prop.requestCamera.TreeStructures,"")
            selectedNodesTemp.forEach((node:TreeNode)=>{
                let treeNodesTemp = selectedNodes;
                selectedNodes[node.key] = node;
                setSelectedNodes(treeNodesTemp);
            });
        }
        reset({
            ...prop.requestCamera,
            ArchiverGuid:(archiver?archiver:null),
            Model:(model?model:null),
            RetentionPeriod:prop.requestCamera.RetentionPeriod?String(prop.requestCamera.RetentionPeriod).split(" ")[0]+" jours":null,
            TreeStructures:selectedNodes,
            SiteName:prop.platform,
            CameraToDeleteGuid:cameraToReplace?cameraToReplace:null,
        });
    }, [loading]);
    function findTreeStructure(treeStructures:ITreeStructure[], path:string):ITreeStructure|undefined
    {
        //console.log(treeStructures,path)
        let pathSplitted = path.split("\\")
        let treesttucture = treeStructures.find(treeStructure=>{
            let a = pathSplitted[0].normalize("NFD").replace(/[^\w\s]/g, '').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s/g, '')
            let b = treeStructure.Name.normalize("NFD").replace(/[^\w\s]/g, '').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s/g, '')
            //console.log(a,b)
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
    const filterTemplate = (options) => {
        let { filterOptions } = options;
    
        return (
            <div style={{display:"flex",width:"100%"}}>
                <InputText onChange={(e) => myFilterFunction(e, filterOptions)} style={{width:"100%"}} />
                <div style={{margin:"10px"}}></div>
                <Button icon="pi pi-undo" rounded text  onClick={(e) => myResetFunction(filterOptions)}></Button>
            </div>
        );
    };
    function treeStructureValidator(value:ITreeStructure[]){
        if(Object.keys(value).length===0){
            return "Arborescence requise."
        }
        return true;
    }
    const myResetFunction = (options) => {
        setFilterValue('');
        options.reset();
    };
    
    const myFilterFunction = (event, options) => {
        let _filterValue = event.target.value;
        setFilterValue(_filterValue);
        options.filter(event);
    };

    const getFormErrorMessage = (name:string) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    function onSelectedNode(node:TreeNode)
    {
        if(node.children?.length===0){
            let treeNodeKeysTemp = selectedNodeKeys;
            selectedNodeKeys[node.key] = true;
            setSelectedNodeKeys(treeNodeKeysTemp);

            let treeNodesTemp = selectedNodes;
            selectedNodes[node.key] = node;
            setSelectedNodes(treeNodesTemp);

        }
    }
    function onUnSelectedNode(node:TreeNode)
    {
        if(node.children?.length===0){
            let treeNodeKeysTemp = selectedNodeKeys;
            delete selectedNodeKeys[node.key];
            setSelectedNodeKeys(treeNodeKeysTemp);

            let treeNodesTemp = selectedNodes;
            delete selectedNodes[node.key];
            setSelectedNodes(treeNodesTemp);
        }
    }
    function testAdressIp(ip:string)
    {
        if(ip===null||!ip.match(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/)){
            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Ip invalide' });
            return;
        }
        setipLoading(true)
        /*
        CameraManagerApiClient.addressLocator_fromIp(ip)
        .then((addresslocator)=>{
            if(addresslocator.IsOk){
                toast.current?.show({ severity: 'success', summary: ('Nom de Domaine '+addresslocator.DnsName), detail: ('commencer le '+addresslocator.StartDate) });
            }
            else{
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail:addresslocator.Error });
                setipLoading(false)
            }
        })
        */
    }
    function testAdressMac(mac:string)
    {
        if(mac===null||!mac.match(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)){
            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Adresse Mac invalide' });
            return;
        }
        setmacLoading(true)
        /*
        CameraManagerApiClient.addressLocator_fromMAC(mac) 
        .then((addresslocator)=>{
            if(addresslocator.IsOk){
                toast.current?.show({ severity: 'success', summary: ('Nom de Domaine '+addresslocator.DnsName), detail: ('commencer le '+addresslocator.StartDate) });
            }
            else{
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail:addresslocator.Error });
                setmacLoading(false)
            }            
        })   
        */
    }
    return (
       <div className="form-test form">
            <div className='form-header'>
                <h2>Formulaire de requete camera</h2>
                <div style={{margin:"auto"}}></div>
                <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={prop.hide}/>
            </div>
            <div className='form-body'>
                <FormProvider {...methodes}>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="grid-from-camera">
                        <div className="field span-4">
                            <span className="p-float-label">
                                <Controller name="CameraToDeleteGuid" control={control} rules={{ required: "Veuiller choisire une Camera a remplacer." }}  render={({ field, fieldState }) => (
                                    <Dropdown
                                        loading={loading}  
                                        optionLabel="NameCamera" 
                                        filter  
                                        invalid = {fieldState.invalid} 
                                        id={field.name} 
                                        value={field.value} 
                                        onChange={(e) => { field.onChange(e.value)}} 
                                        options={cameras}
                                        virtualScrollerOptions={{ itemSize: 38 }} 
                                    />
                                )} />
                                <label htmlFor="CameraToDeleteGuid" className={classNames({ 'p-error': errors.RetentionPeriod })}>Camera a remplacer <span style={{color:"red"}}>*</span></label>
                            </span>
                            {getFormErrorMessage('CameraToDeleteGuid')}
                        </div>
                        <div className="field grid-1">
                            <span className="p-float-label">
                                <Controller name="MasaiCaseNumber" control={control} rules={{ required: 'N° Demande MASAI incorrecte' }} render={({ field, fieldState }) => (
                                    <InputText {...field} name={field.name}  autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="MasaiCaseNumber" className={classNames({ 'p-error': errors.MasaiCaseNumber })}>N° Demande MASAI <span style={{color:"red"}}>*</span></label>
                            </span>
                        </div>

                        <div className="field span-2">
                            <span className="p-float-label">
                                <Controller name="NameCamera" control={control} rules={{ required: 'Nom requis.' }} render={({ field, fieldState }) => (
                                    <InputText  {...field} name={field.name}  autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="NameCamera" className={classNames({ 'p-error': errors.NameCamera })}>Nom Caméra<span style={{color:"red"}}>*</span></label>
                            </span>
                            {getFormErrorMessage('NameCamera')}
                        </div>

                        
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="RetentionPeriod" control={control} rules={{ required: "Veuiller choisire une Durée d'Enregistrement." }}  render={({ field, fieldState }) => (
                                    <Dropdown loading={loading}  optionLabel="Name" filter  invalid ={fieldState.invalid} id={field.name} value={field.value} onChange={(e) => { field.onChange(e.value)}} options={dureeEnregistrements}  />
                                )} />
                                <label htmlFor="RetentionPeriod" className={classNames({ 'p-error': errors.RetentionPeriod })}>Durée Enregistrement<span style={{color:"red"}}>*</span></label>
                            </span>
                            {getFormErrorMessage('RetentionPeriod')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                {
                                    <Controller name="NameUnit" control={control} rules={{ required: 'Encodeur requis.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                }
                                <label htmlFor="NameUnit" className={/*classNames({ 'p-error': errors.Nom })*/"a"}>DNS / Nom Encodeur<span style={{color:"red"}}>*</span></label>
                            </span>
                            {getFormErrorMessage('NameUnit')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="ArchiverGuid" control={control} rules={formState==1?{ required: 'Veuiller choisire un Archiveur.' }:{}}  render={({ field, fieldState }) => (
                                    <Dropdown loading={loading} optionLabel="Name" filter  invalid ={fieldState.invalid} id={field.name} value={field.value} onChange={(e) => { field.onChange(e.value)}} options={archivers}  />
                                )} />
                                <label htmlFor="ArchiverGuid" className={classNames({ 'p-error': errors.ArchiverGuid })}>Archiveur{formState==1&&<span style={{color:"red"}}>*</span>}</label>
                            </span>
                            {getFormErrorMessage('ArchiverGuid')}
                        </div>
                        
                        <div className="field ">
                            <span className="p-float-label">
                                <Controller name="LogicalId" control={control} rules={formState==1?{ required: 'ID Security Center requis' }:{}} render={({ field, fieldState }) => (
                                    <InputNumber id={field.name} {...field} onChange={(e) => field.onChange(e.value)} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="LogicalId" className={classNames({ 'p-error': errors.LogicalId })}>ID Security Center{formState==1&&<span style={{color:"red"}}>*</span>}</label>
                            </span>
                            {getFormErrorMessage('LogicalId')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="Model" control={control} rules={formState==1?{ required: 'Veuiller choisire un Model.' }:{}}  render={({ field, fieldState }) => (
                                    <Dropdown loading={loading}  optionLabel="Product" filter  invalid ={fieldState.invalid} id={field.name} value={field.value} onChange={(e) => { field.onChange(e.value)}} options={models}  />
                                )} />
                                <label htmlFor="Model" className={classNames({ 'p-error': errors.Model })}>Modèle{formState==1&&<span style={{color:"red"}}>*</span>}</label>
                            </span>
                            {getFormErrorMessage('Model')}
                        </div>
                        <div className="field span-4" >
                            <span className="p-float-label">
                                <Controller name="TreeStructures" control={control} rules={{ required: 'Arborescence requise.' ,validate :treeStructureValidator}} render={({ field }) => (
                                    <TreeSelect
                                    style={{width:"100%"}}
                                    value={selectedNodeKeys}
                                    onNodeSelect={(e:TreeSelectEventNodeEvent)=>{onSelectedNode(e.node)}}
                                    onNodeUnselect={(e:TreeSelectEventNodeEvent)=>onUnSelectedNode(e.node)}
                                    //for update dont remove it !
                                    onChange={(e) => {
                                        field.onChange(selectedNodes);
                                        setSelectedNodeKeys({...selectedNodeKeys})}
                                    } 
                                    filter 
                                    filterTemplate={filterTemplate}
                                    filterBy="label"
                                    //filterMode="lenient"
                                    options={treeNodes} 
                                    metaKeySelection={false}  
                                    selectionMode="multiple" 
                                    placeholder="Select Items"/>
                                )} />
                                <label htmlFor="TreeStructures" >Arborescence Security Center<span style={{color:"red"}}>*</span></label>
                            </span>
                            {getFormErrorMessage('TreeStructures')}
                        </div>
                        <div className="field span-2">
                            <Controller name="IPAddress" control={control} rules={{ pattern: {value:/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,message:"L'adresse IP doit être renseignée et valide."},required: "L'adresse IP doit être renseignée et valide." }} render={({ field, fieldState }) => (
                                <div style={{display:"flex"}}>
                                    <span className="p-float-label">
                                        <InputText  id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                        <label htmlFor="IPAddress" className={classNames({ 'p-error':errors.IPAddress })}>Addresse IP<span style={{color:"red"}}>*</span></label>
                                    </span>
                                    <Button type="button" onClick={()=>testAdressIp(field.value)} loading={iploading} >Tester L'IP</Button>
                                </div>                          
                            )} />
                            {getFormErrorMessage('IPAddress')}
                        </div>
                        <div className="field span-2">
                            <Controller name="MacAddress" control={control}render={({ field, fieldState }) => (
                                <div style={{display:"flex"}}>
                                    <span className="p-float-label">
                                        <InputMask value={field.value?field.value:"a"} onChange={e=>{field.onChange(e.value)}} mask="**:**:**:**:**:**" id={field.name}  autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                        <label htmlFor="MacAddress" className={classNames({ 'p-error':errors.IPAddress })}>Addresse Mac</label>
                                    </span>
                                    <Button type="button" onClick={()=>testAdressMac(field.value)}loading={macloading} >Tester L'addresse mac</Button>
                                </div>                          
                            )} />
                            {getFormErrorMessage('MacAddress')}
                        </div> 
                        <div className="field span-4">
                            <span className="p-float-label">
                                Description
                                <Controller name="DescriptionCamera" control={control}  render={({ field}) => (
                                    <InputText id={field.name} {...field} autoFocus />                                )} />
                            </span>
                        </div>

    
                        <div className="field" style={{"gridColumn": "span 2"}}>
                            <span className="p-float-label">
                                <Controller name="IsDefaultPassword" control={control}  render={({ field }) => (
                                    <ToggleButton
                                    onLabel="Mot de passe par defaut activer" 
                                    offLabel="Mot de passe par defaut desactiver" 
                                    onIcon="pi pi-check" 
                                    offIcon="pi pi-times" 
                                    checked={IsDefaultPassword}                
                                    onChange={(e) => field.onChange(e.value)} />
                                )} />        
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller disabled={IsDefaultPassword} name="Login" control={control} rules={{ required: 'Encodeur requis.' }} render={({ field, fieldState }) => (
                                    <InputText disabled={IsDefaultPassword} id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': (!IsDefaultPassword&&fieldState.invalid) })} />
                                )} />
                                <label htmlFor="Login" className={classNames({ 'p-error': errors.Login })}>Login</label>
                            </span>
                            {!IsDefaultPassword&&
                                getFormErrorMessage('Login')
                            }
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller disabled={IsDefaultPassword} name="Password" control={control} rules={{ required: 'Encodeur requis.' }} render={({ field, fieldState }) => (
                                    <InputText disabled={IsDefaultPassword} id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': (!IsDefaultPassword&&fieldState.invalid) })} />
                                )} />
                                <label htmlFor="Password" className={classNames({ 'p-error': errors.Password })}>Password</label>
                            </span>
                            {!IsDefaultPassword&&
                                getFormErrorMessage('Password')
                            }
                        </div>

                        <div className="field span-4">
                            <span className="p-float-label">
                                Commentaire
                                <Controller name="DescriptionCamera" control={control}  render={({ field}) => (
                                    <InputText id={field.name} {...field} autoFocus />                                )} />
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="Building" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="Building" className={classNames({ 'p-error': errors.Building })}>Bâtiment</label>
                            </span>
                            {getFormErrorMessage('Building')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="Local" control={control}  render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="Local" className={classNames({ 'p-error': errors.Local })}>Local</label>
                            </span>
                            {getFormErrorMessage('Local')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="Bay" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="Bay" className={classNames({ 'p-error':errors.Bay })}>Baie</label>
                            </span>
                            {getFormErrorMessage('Bay')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="Position" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="Position" className={classNames({ 'p-error': errors.Position })}>Position Baie</label>
                            </span>
                            {getFormErrorMessage('Position')}
                        </div> 
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="IsPtz" control={control}  render={({ field }) => (
                                    <ToggleButton
                                    onLabel="PTZ activer" 
                                    offLabel="PTZ desactiver" 
                                    onIcon="pi pi-check" 
                                    offIcon="pi pi-times" 
                                    checked={field.value}                
                                    onChange={(e) => field.onChange(e.value)} />
                                )} />        
                            </span>
                        </div>
                        <div className="field" >
                            <span className="p-float-label">
                                <Controller name="Brewing" control={control}  render={({ field }) => (
                                    <ToggleButton
                                    onLabel="Camera Brassée" 
                                    offLabel="Camera non Brassée" 
                                    onIcon="pi pi-check" 
                                    offIcon="pi pi-times" 
                                    checked={field.value==="oui"}                   
                                    onChange={(e) => field.onChange(e.value?"oui":"non")} />
                                )} />        
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="Switch" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="Switch" className={classNames({ 'p-error':errors.Switch })}>Switch</label>
                            </span>
                            {getFormErrorMessage('Switch')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="Port" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="Port" className={classNames({ 'p-error':errors.Switch })}>Port Switch</label>
                            </span>
                            {getFormErrorMessage('Port')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="Unity" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="Unity" className={classNames({ 'p-error':errors.Switch })}>Unité Switch</label>
                            </span>
                            {getFormErrorMessage('Unity')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="ConfigurationItemNumber" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="ConfigurationItemNumber" className={classNames({ 'p-error':errors.Switch })}>CI</label>
                            </span>
                            {getFormErrorMessage('ConfigurationItemNumber')}
                        </div>

                        <div className="field span-4">
                            <Controller name="VideoStreams" control={control} render={({ field, fieldState }) => (
                                <FormFlux fluxs={field.value} setFlux={field.onChange} platform={prop.requestCamera?.SiteName}></FormFlux>                       
                            )} />
                            {getFormErrorMessage('VideoStreams')}
                        </div> 
                    </div> 
                    <div className='footer'>
                        <Button type="submit" label="Envoyer" severity="success" className="mt-2" />
                    </div>
                    </form>
                </FormProvider>
            </div>
       </div>
    );
}
   