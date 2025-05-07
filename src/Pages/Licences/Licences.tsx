import { Toast } from "primereact/toast";
import TableLicencePool from "../../Components/Table/TableLicencePool/TableLicencePool"
import { ILicencePool } from "../../Utils/Interfaces/ILicencePool";
import { useState, useRef, useEffect } from "react";
import { CameraManagerApiClient } from "../../Utils/CameraManagerClientApi";
import { DataTableRowExpansionTemplate } from "primereact/datatable";
import { ILicence } from "../../Utils/Interfaces/ILicence";
import { ColumnBodyOptions } from "primereact/column";
import TableLicence from "../../Components/Table/TableLicence/TableLicence";
import { Dialog } from "primereact/dialog";
import FormLicence from "../../Components/Form/FormLicence/FormLicence";
import FormLicencePool from "../../Components/Form/FormLicencePool/FormLicencePool";
import { DEFAULT_VALUES } from "../../Utils/DefaultValue";

interface IProp{
    platform : string
}
export default function Licences(prop:IProp){
    const [LicencePools, setLicencePools] = useState<ILicencePool[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);
    const [isFormLicencePoolVisible, setIsFormLicencePoolVisible] = useState<boolean>(false);
    const [isFormLicenceVisible, setIsFormLicenceVisible] = useState<boolean>(false);
    const [selectedLicencePool, setSelectedLicencePool] = useState<ILicencePool>(null);
    const [selectedLicence, setSelectedLicence] = useState<ILicence>(null);
    const [index, setIndex] = useState([-1,-1]);
    useEffect(() => {
        loadData()
    }, []);
    useEffect(() => {
        if(!selectedLicence?.asChanged)return
        console.log("lic")
        let licenceTemp:ILicence = {
            ...selectedLicence,
            UpdateDate: new Date().toISOString(),
            InvoiceDate:selectedLicence.InvoiceDate?selectedLicence.InvoiceDate.toISOString():null,
        }
        if(index[1]==-1){
            CameraManagerApiClient.licencePool_addLicence(LicencePools[index[0]].Id,licenceTemp)
            .then(result=>{
                if(result){
                    toast.current?.show({ severity: 'success', summary: 'Demande envoyée', detail: 'Ajout reussie', life: 3000 });
                }
                else{
                    toast.current?.show({ severity: 'error', summary: 'Erreur', detail: "Erreur lors de l'ajout", life: 3000 });
                }
                loadData()
            })
        }else{
            console.log(selectedLicence)
            console.log(licenceTemp)
            CameraManagerApiClient.licence_put(licenceTemp.Id,licenceTemp)
            .then(result=>{
                if(result){
                    toast.current?.show({ severity: 'success', summary: 'Demande envoyée', detail: 'Modification reussie', life: 3000 });
                }
                else{
                    toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la modification', life: 3000 });
                }
                loadData()
            })
        }

    }, [selectedLicence]);
    useEffect(() => {
        if(!selectedLicencePool?.asChanged)return
        console.log("pool")
        let licencePoolTemp:ILicencePool = {
            ...selectedLicencePool,
            CreationDate:selectedLicencePool.CreationDate?selectedLicencePool.CreationDate.toISOString():null,
            ExpectedEndDate:selectedLicencePool.ExpectedEndDate?selectedLicencePool.ExpectedEndDate.toISOString():null,
        }
        console.log(licencePoolTemp)
        if(index[0]==-1){
            licencePoolTemp.CreationDate = new Date().toISOString()
            CameraManagerApiClient.licencePool_post(licencePoolTemp)
            .then(result=>{
                if(result){
                    toast.current?.show({ severity: 'success', summary: 'Demande envoyée', detail: 'Ajout reussie', life: 3000 });
                }
                else{
                    toast.current?.show({ severity: 'error', summary: 'Erreur', detail: "Erreur lors de l'ajout", life: 3000 });
                }
                loadData()
            })
        }else{
            CameraManagerApiClient.licencePool_put(licencePoolTemp.Id,licencePoolTemp)
            .then(result=>{
                if(result){
                    toast.current?.show({ severity: 'success', summary: 'Demande envoyée', detail: 'Modification reussie', life: 3000 });
                }
                else{
                    toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la modification', life: 3000 });
                }
                loadData()
            })
        }

    }, [selectedLicencePool]);
    function loadData(){
        setLoading(true)
        CameraManagerApiClient.site_getLicnencePools(prop.platform)
        .then(licencePools=>{
            setLicencePools(
                licencePools.map(licencePool=>{
                    let status = []
                    if(new Date(licencePool.ExpectedEndDate ).getTime()< (new Date).getTime()){
                        status.push({ name: 'Expiré', code: 'IST' })
                    }
                    if(licencePool.IsClose){
                        status.push({ name: "Cloturé", code: 'IST' })
                    }
                    if(licencePool.Licenses.filter((licence)=>licence.InvoiceDate!==undefined).length!== licencePool.Licenses.length){
                        status.push({ name: "Non-Facturé", code: 'IST' })
                    }
                    else{
                        status.push({ name: "Facturé", code: 'IST' })
                    }
                    return{
                        ...licencePool,
                        CreationDate:licencePool.CreationDate?new Date(licencePool.CreationDate):null,
                        ExpectedEndDate:licencePool.ExpectedEndDate?new Date(licencePool.ExpectedEndDate):null,
                        Status:status
                    }
                })
            )
            setLoading(false)
        })
    }
    function open(licencePool: ILicencePool, option?: ColumnBodyOptions){
        CameraManagerApiClient.licencePool_put(licencePool.Id,{
            ...licencePool,
            IsClose:false,
        })
        .then(result=>{
            if(result){
                toast.current?.show({ severity: 'success', summary: 'Demande envoyée', detail: 'Ouverture reussie', life: 3000 });
            }
            else{
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail: "Erreur lors de l'ouverture", life: 3000 });
            }
            loadData()
        })
    }
    function close(licencePool: ILicencePool, option?: ColumnBodyOptions){
        CameraManagerApiClient.licencePool_put(licencePool.Id,{
            ...licencePool,
            IsClose:true,
        })
        .then(result=>{
            if(result){
                toast.current?.show({ severity: 'success', summary: 'Demande envoyée', detail: 'Fermeture reussie', life: 3000 });
            }
            else{
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la fermeture', life: 3000 });
            }
            loadData()
        })
    }
    function edit(licencePool: ILicencePool, option?: ColumnBodyOptions){
        setIsFormLicencePoolVisible(true)
        setIndex([option?.rowIndex,-1])
        setSelectedLicencePool(licencePool)
    }
    function remove(licencePool: ILicencePool, option?: ColumnBodyOptions){
        CameraManagerApiClient.licencePool_delete(licencePool.Id)
        .then(result=>{
            if(result){
                toast.current?.show({ severity: 'success', summary: 'Demande envoyée', detail: 'Suppresion reussie', life: 3000 });
            }
            else{
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppresion', life: 3000 });
            }
            loadData()
        })
    }
    function add(){
        setIsFormLicencePoolVisible(true)
        setIndex([-1,-1])
        setSelectedLicencePool({
            ...DEFAULT_VALUES.licencePool,
            SiteName:prop.platform
        })
    }
    function rowExpansionTemplate(data: ILicencePool, options: DataTableRowExpansionTemplate){
        function addLicance(){
            setIsFormLicenceVisible(true)
            //index de larrray licence pool est inverser je sais pas pourquoi ?
            setIndex([(LicencePools.length-options.index-1),-1])
            setSelectedLicence({
                ...DEFAULT_VALUES.licence,
                SiteName:prop.platform
            })
        }
        function deleteLicence(licence: ILicence, option: ColumnBodyOptions){
            let dataTemp = data
            dataTemp.Licenses.splice(option.rowIndex,1)
            dataTemp ={
                ...dataTemp,
                CreationDate: dataTemp.CreationDate?dataTemp.CreationDate.toISOString():null,
                ExpectedEndDate:dataTemp.ExpectedEndDate?dataTemp.ExpectedEndDate.toISOString():null,
            }
            CameraManagerApiClient.licencePool_put(data.Id,dataTemp)
            .then(result=>{
                if(result){
                    toast.current?.show({ severity: 'success', summary: 'Demande envoyée', detail: 'Suppresion reussie', life: 3000 });
                }
                else{
                    toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppresion la licence est utiliser dans une requete', life: 3000 });
                }
                loadData()
            })
        }
        function editLicence(licence: ILicence, option: ColumnBodyOptions){
            setIndex([options.index,option.rowIndex])
            setIsFormLicenceVisible(true)
            setSelectedLicence(licence)
        }
        return(
            <TableLicence 
                licences={data.Licenses.map(licence=>{
                    return {
                        ...licence,
                        UpdateDate:licence.UpdateDate?new Date(licence.UpdateDate):null,
                        InvoiceDate:licence.InvoiceDate?new Date(licence.InvoiceDate):null,
                    }
                })} 
                selectionMode={undefined} 
                onDelete={deleteLicence} 
                onEdit={editLicence} 
                onAdd={addLicance}
            />
        )
    }
    function formLicenceTemplate(){
        const hide = ()=>setIsFormLicenceVisible(false)
        return(
            <FormLicence hide={hide} item={selectedLicence} setitem={setSelectedLicence}></FormLicence>
        )
    }
    function formLicencePoolTemplate(){
        const hide = ()=>setIsFormLicencePoolVisible(false)
        return(
            <FormLicencePool hide={hide} item={selectedLicencePool} setitem={setSelectedLicencePool}></FormLicencePool>
        ) 
    }
    return(
        <div className='licences' style={{width:"100%"}}>
            <Toast ref={toast} />
            <Dialog
                visible={isFormLicenceVisible}
                onHide={() => {if (!isFormLicenceVisible) return; setIsFormLicenceVisible(isFormLicenceVisible); }}
                content={formLicenceTemplate}
            />
            <Dialog
                visible={isFormLicencePoolVisible}
                onHide={() => {if (!isFormLicencePoolVisible) return; setIsFormLicencePoolVisible(isFormLicencePoolVisible); }}
                content={formLicencePoolTemplate}
            />
            <TableLicencePool 
                licencePools={LicencePools} 
                selectionMode={undefined} 
                onOpen={open} 
                onClose={close} 
                onEdit={edit} 
                onDelete={remove} 
                onExpend={rowExpansionTemplate}
                onAdd={add}
            />
        </div>
    )
}