import { Button } from 'primereact/button';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { getFormErrorMessage } from '../../GenericTemaplate/GenericTemplate';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { IRequest } from '../../../Utils/Interfaces/IRequest';
import { DEFAULT_VALUES } from '../../../Utils/DefaultValue';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { InputNumber } from 'primereact/inputnumber';
import { useState, useEffect } from 'react';
import { CameraManagerApiClient } from '../../../Utils/CameraManagerClientApi';
import { ILicencePool } from '../../../Utils/Interfaces/ILicencePool';
import { IService } from '../../../Utils/Interfaces/IService';
import { IRequestType } from '../../../Utils/Interfaces/IRequestType';
import { ILicence } from '../../../Utils/Interfaces/ILicence';
interface IProp{
    hide :()=>void,
    request:IRequest|null,
    setitem:(item:IRequest)=>void,
    asHeader?:boolean
}
export default function FormRequest(prop:IProp){
    const defaultValues:IRequest = DEFAULT_VALUES.request
    const methodes = useForm<IRequest>({ defaultValues });
    const { control , formState: { errors }, handleSubmit, reset ,watch,setValue }= methodes
    const [loading, setLoading] = useState<boolean>(true);
    const [LicencePools, setLicencePools] = useState<ILicencePool[]>([]);
    const [RequestTypes, setRequestTypes] = useState<IRequestType[]>([]);
    const [Services, setServices] = useState<IService[]>([]);
    const service = watch("ServiceCode")
    const numberOfCamerasRequested = watch("NumberOfCamerasRequested")
    const [licenceloading, setlicenceLoading] = useState<boolean>(false);
    const onSubmit = (data:IRequest) => {
        prop.setitem({
            ...data,
            LicensePoolId:data?.Id,
            LicenseId:data?.LicenseId?.Id,
            RequestType:data?.RequestType.Name,
            RequestTypeCode:data?.RequestType.Code,
            ServiceCode:data?.ServiceCode.Code,
            LicenseName:data?.LicenseId?.Name,
            ServiceName:data?.ServiceCode.Name,
            SiteName:data?.LicenseId.SiteName,
            RequestState:"In progress",
            RequestStateCode:"PROG",
            asChanged:true
        })
        prop.hide()
        reset()
    };
    function loadData(){
        setLoading(true)
        if(prop.request===null||prop.request.SiteName===null||prop.request.SiteName===undefined||prop.request.SiteName===""){
            Promise.all([
                CameraManagerApiClient.site_getServices("ORY"),
                CameraManagerApiClient.site_getServices("CDG"),
                CameraManagerApiClient.site_getServices("LBG"),
            ])
            .then(values=>{
                setServices([...values[0],...values[1],...values[2]]);
                //if request type change ,change here !
                setRequestTypes([{Name:"Add",Code:"ADD"},{Name:"Replace",Code:"REP"}])
                setLoading(false);
            }) 
        }
        else{
            Promise.all([
                CameraManagerApiClient.site_getServices(prop.request.SiteName),
                CameraManagerApiClient.service_getLicencePools(prop.request.ServiceCode)
            ])
            .then(values=>{
                setServices(values[0]);
                //if request type change ,change here !
                setRequestTypes([{Name:"Add",Code:"ADD"},{Name:"Replace",Code:"REP"}])
                if(values[1].length>0){
                    setLicencePools(disableLicenceTooSmall(values[1],numberOfCamerasRequested))
                }
                setLoading(false);
            }) 
        }
    }
    function disableLicenceTooSmall(licencePools:ILicencePool[],cameraMax:number):ILicencePool[]
    {
        if(cameraMax===null||cameraMax===undefined){
            return licencePools
        }
        licencePools?.forEach(licencePool=>{
            licencePool.Licenses = licencePool.Licenses.map((licence:ILicence)=>{
                return{
                    ...licence,
                    disabled:(licence.Quantity-licence.CameraQuantity<cameraMax)
                }
            })
        })
        return licencePools
    }
    useEffect(() => {
        loadData()
    }, []);
    useEffect(() => {
        if(loading) return
        if (prop.request!==null) {
            reset({
                ...prop.request,
                ServiceCode: Services.find((service) => service.Code === prop.request?.ServiceCode),
                RequestType: RequestTypes.find((requestType) => requestType.Name === prop.request?.RequestType),
                NumberOfCamerasRequested: prop.request.NumberOfCamerasRequested,
            });
            //setlicenceLoading(false)
        } else {
            reset(defaultValues);
        }
    }, [loading]);
    
    useEffect(() => {
        if(service==="" ||service===null||service===undefined) {
            setlicenceLoading(false)
            return
        }
        setlicenceLoading(true)
        //service est stockée commme un object qui implemente l'interface:Service pour afficher dans le drop down
        CameraManagerApiClient.service_getLicencePools(service?.Code)
        .then((licencePools=>{
            setLicencePools(disableLicenceTooSmall(licencePools,numberOfCamerasRequested))
            let licenceselectioned 
            
            if(LicencePools.length!==0){
                licenceselectioned=LicencePools.find((licencePool) =>licencePool.Licenses.find((licence:ILicence)=> licence.Id === prop.request?.LicenseId))?.Licenses.find((licence:ILicence)=> licence.Id === prop.request?.LicenseId)
            }
            setValue("LicenseId",licenceselectioned)
            setlicenceLoading(false)
        }))
        
    }, [service]);
    
    useEffect(() => {
        setLicencePools(disableLicenceTooSmall(LicencePools,numberOfCamerasRequested))
    }, [numberOfCamerasRequested]);
    //bodyTemplate
    const groupedItemTemplate = (option:ILicencePool) => {
        return (
            <div className="flex align-items-center">
                Groupe de licences : {option.Name} Camera totale : {option.Quantity}  Camera utiliser :{option.CameraQuantity}  Camera restante : {option.Quantity-option.CameraQuantity} 
            </div>
        );
    };
    const itemTemplate = (option:ILicence) => {
        return (
            <div className="flex align-items-center">
                {/* la propriete a ete ajouté dans le use effect plus haut */}
                licence{option.disabled?"(desactiver car manque de camera libre)":""} : {option.Name} Camera totale : {option.Quantity}  Camera utiliser :{option.CameraQuantity}  Camera restante : {option.Quantity-option.CameraQuantity} 
            </div>
        );
    };
    return (
       <div className="form-test form">
            {
                prop.asHeader===true&&
                <div className='form-header'>
                    <h2>Formulaire {prop.request?"modification":"creation"} item</h2>
                    <div style={{margin:"auto"}}></div>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={prop.hide}/>
                </div>
            }
            <div className='form-body'>
                <FormProvider {...methodes}>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="Title" control={control} rules={{ required: 'Titre est Requis.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="Title" className={classNames({ 'p-error': errors.Title })}>Titre de la demande</label>
                            </span>
                            {getFormErrorMessage('Title',errors)}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="MasaiCaseNumber" control={control} rules={{ required: 'N° Interaction MASAI est Requis.' }} render={({ field , fieldState}) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="MasaiCaseNumber">N° Interaction MASAI</label>
                            </span>
                            {getFormErrorMessage('MasaiCaseNumber',errors)}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="NumberOfCamerasRequested" control={control} rules={{ required: 'Nombre de camera est Requis.' }} render={({ field , fieldState}) => (
                                    <InputNumber id={field.name} {...field} onChange={(e) => field.onChange(e.value)} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="NumberOfCamerasRequested">Nombre de camera demander</label>
                            </span>
                            {getFormErrorMessage('NumberOfCamerasRequested',errors)}
                        </div>
                        {
                            prop.request===null&&
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="RequestType" control={control} rules={{ required: 'Veuiller choisire un Type.' }}  render={({ field, fieldState }) => (
                                        <Dropdown loading={loading}  optionLabel="Name" filter  invalid ={fieldState.invalid} id={field.name} value={field.value} onChange={(e) => { field.onChange(e.value)}} options={RequestTypes}  />
                                    )} />
                                    <label htmlFor="RequestType" className={classNames({ 'p-error': errors.ServiceCode })}>Type de requete</label>
                                </span>
                                {getFormErrorMessage('RequestType',errors)}
                            </div>
                        }
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="ServiceCode" control={control} rules={{ required: 'Veuiller choisire un Service.' }}  render={({ field, fieldState }) => (
                                    <Dropdown loading={loading}  optionLabel="Name" filter  invalid ={fieldState.invalid} id={field.name} value={field.value} onChange={(e) => { field.onChange(e.value)}} options={Services}  />
                                )} />
                                <label htmlFor="ServiceCode" className={classNames({ 'p-error': errors.ServiceCode })}>Service</label>
                            </span>
                            {getFormErrorMessage('ServiceCode',errors)}
                        </div>

                        {service&&
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="LicenseId" control={control} rules={{ required: 'Veuiller choisire une licence.' }}  render={({ field, fieldState }) => (
                                        <Dropdown   
                                            loading={licenceloading}
                                            filter  
                                            invalid = {fieldState.invalid}
                                            id={field.name}         
                                            value={field.value} 
                                            optionGroupLabel="Name"
                                            optionGroupChildren="Licenses"
                                            optionLabel="Name" 
                                            optionGroupTemplate={groupedItemTemplate}
                                            itemTemplate ={itemTemplate}
                                            onChange={(e) => {field.onChange(e.value)}} 
                                            options={LicencePools}  />
                                    )} />
                                    <label htmlFor="LicenseId" className={classNames({ 'p-error': errors.LicensePoolId })}>Licence</label>
                                </span>
                                {getFormErrorMessage('LicenseId',errors)}
                            </div>
                        }
                        <div className="field span-4">
                            <span className="p-float-label">
                                Commentaire
                                <Controller name="Comment" control={control}  render={({ field}) => (
                                    <InputText id={field.name} {...field} autoFocus />
                                )}/>
                            </span>
                        </div>
                        <div className='footer'>
                            <Button type="submit" label="Envoyer" className="mt-2" />
                        </div>
                    </form>
                </FormProvider>
            </div>
       </div>
    );
}
                 