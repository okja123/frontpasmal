import { Controller, FormProvider, useForm } from "react-hook-form";
import { ILicence } from "../../../Utils/Interfaces/ILicence";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { IService } from "../../../Utils/Interfaces/IService";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { getFormErrorMessage } from "../../GenericTemaplate/GenericTemplate";
import { CameraManagerApiClient } from "../../../Utils/CameraManagerClientApi";
import { DEFAULT_VALUES } from "../../../Utils/DefaultValue";

interface IProp{
    hide :()=>void,
    item:ILicence,
    setitem:(item:ILicence)=>void
}
export default function FormLicence(prop:IProp){
    const [loading, setLoading] = useState<boolean>(true);
    const [Services, setServices] = useState<IService[]>([]);
    const defaultValues:ILicence = DEFAULT_VALUES.licence
    const methodes = useForm<ILicence>({ defaultValues });
    const { control , formState: { errors }, handleSubmit, reset} = methodes
    const onSubmit = (data:ILicence) => {
        console.log(data)
        prop.setitem({
            ...data,
            ServiceCode:data.ServiceCode.Code,
            asChanged:true,
        })
        prop.hide()
        reset()
    };
    useEffect(() => {
        CameraManagerApiClient.site_getServices(prop.item.SiteName)
        .then(services=>{
            setServices(services)
            setLoading(false)
        })
    }, []);
    useEffect(() => {
        let service = Services.find((service)=>service.Code===prop.item.ServiceCode)
        reset({
            ...prop.item,
            ServiceCode:service?service:null,
            InvoiceDate:prop.item.InvoiceDate?new Date(prop.item.InvoiceDate):null,
            UpdateDate:prop.item.UpdateDate?new Date(prop.item.UpdateDate):null,
        });
    }, [Services]);
    return (
       <div className="form-test form">
            <div className='form-header'>
                <h2>Formulaire {prop.item?"modification":"creation"} item</h2>
                <div style={{margin:"auto"}}></div>
                <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={prop.hide}/>
            </div>
            <div className='form-body'>
                <FormProvider {...methodes}>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="Name" control={control} rules={{ required: 'Nom est Requis.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="Name" className={classNames({ 'p-error': errors.Name })}>Nom de la commande</label>
                            </span>
                            {getFormErrorMessage('Name',errors)}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="ServiceCode" control={control} rules={{ required: 'Service est Requis.' }} render={({ field , fieldState }) => {
                                    return(
                                    <Dropdown loading ={loading} id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={Services} optionLabel="Name" />
                                    )
                                }} />
                                <label htmlFor="ServiceCode" className={classNames({ 'p-error': errors.ServiceCode })}>Service proprietaire</label>
                            </span>
                            {getFormErrorMessage('ServiceCode',errors)}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="Quantity" control={control} rules={{ required: 'Quantité est Requis.' }} render={({ field, fieldState }) => (
                                    <InputNumber id={field.name} {...field} onChange={(e) => field.onChange(e.value)} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="Quantity" className={classNames({ 'p-error': errors.Quantity })}>Quantité</label>
                            </span>
                            {getFormErrorMessage('Quantity',errors)}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="Applicant" control={control} rules={{ required: 'Demandeur est Requis.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="Applicant" className={classNames({ 'p-error': errors.Applicant })}>Demandeur</label>
                            </span>
                            {getFormErrorMessage('Applicant',errors)}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="ChargeCode" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="ChargeCode" className={classNames({ 'p-error': errors.ChargeCode })}>Compte d'imputation</label>
                            </span>
                            {getFormErrorMessage('ChargeCode',errors)}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="ChargeOrderNumber" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="ChargeOrderNumber" className={classNames({ 'p-error': errors.ChargeOrderNumber })}>Ordre d'imputation TIME</label>
                            </span>
                            {getFormErrorMessage('ChargeOrderNumber',errors)}
                        </div>
                        <span className="p-float-label">
                            Commentaire
                            <Controller name="Comment" control={control}  render={({ field}) => (
                                <InputText id={field.name} {...field} autoFocus />
                            )} />
                        </span>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="InvoiceDate" control={control} render={({ field }) => (
                                    <Calendar id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                                )} />
                                <label htmlFor="InvoiceDate">Facturé le </label>
                            </span>
                        </div>
                        {
                            /* 
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="UpdateDate" control={control} render={({ field }) => (
                                        <Calendar id={field.name} value={field.value} onChange={(e) => {field.onChange(e.value)}} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                                    )} />
                                    <label htmlFor="UpdateDate">Commandé le</label>
                                </span>
                            </div>
                            */
                        }
                        <div className='footer'>
                            <Button type="submit" label="Envoyer" className="mt-2" />
                        </div>
                    </form>
                </FormProvider>
            </div>
       </div>
    );
}
      