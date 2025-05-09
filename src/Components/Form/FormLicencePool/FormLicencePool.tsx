import { Button } from "primereact/button";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { ILicencePool } from "../../../Utils/Interfaces/ILicencePool";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { getFormErrorMessage } from "../../GenericTemaplate/GenericTemplate";
import { useState, useEffect } from "react";
import { CameraManagerApiClient } from "../../../Utils/CameraManagerClientApi";
import { IService } from "../../../Utils/Interfaces/IService";
import { DEFAULT_VALUES } from "../../../Utils/DefaultValue";

interface IProp{
    hide :()=>void,
    item:ILicencePool,
    setitem:(item:ILicencePool)=>void
}
export default function FormLicencePool(prop:IProp){
    const [loading, setLoading] = useState(true);
    const [Services, setServices] = useState<IService[]>([]);
    const defaultValues:ILicencePool = DEFAULT_VALUES.licencePool
    const methodes = useForm<ILicencePool>({ defaultValues });
    const { control , formState: { errors }, handleSubmit, reset ,watch} = methodes
    const onSubmit = (data:ILicencePool) => {
        prop.setitem({
            ...data,
            ServiceCode:data.ServiceCode.Code,
            asChanged:true
        })
        prop.hide()
        reset()
    };
    useEffect(() => {
        CameraManagerApiClient.site_getServices(prop.item.SiteName)
        .then((services)=>{
            setServices(services)
            setLoading(false)
        })
    }, [loading]);
    useEffect(() => {
        let service = Services.find((service) => service.Code === prop.item.ServiceCode)
        reset({
            ...prop.item,
            ServiceCode:service?service:null ,
            ExpectedEndDate: prop.item.ExpectedEndDate ? new Date(prop.item.ExpectedEndDate) : null,
        });
    }, [loading]);
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
                                <label htmlFor="Name" className={classNames({ 'p-error': errors.Name })}>Nom du groupe</label>
                            </span>
                            {getFormErrorMessage('Name',errors)}
                        </div>
                        <div className="field grid-4">
                            <span className="p-float-label">
                                <Controller name="Quantity" control={control} render={({ field, fieldState }) => (
                                    <InputNumber id={field.name} {...field} onChange={(e) => field.onChange(e.value)} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="Quantity" className={classNames({ 'p-error': errors.Quantity })}>Quantitée</label>
                            </span>
                            {getFormErrorMessage('Quantity',errors)}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="ServiceCode" control={control} rules={{ required: 'Nom est Requis.' }}  render={({ field, fieldState }) => (
                                    <Dropdown loading={loading} optionLabel="Name" filter  invalid ={fieldState.invalid} id={field.name} value={field.value} onChange={(e) => { field.onChange(e.value)}} options={Services}  />
                                )} />
                                <label htmlFor="ServiceCode" className={classNames({ 'p-error': errors.ServiceCode })}>Service</label>
                            </span>
                            {getFormErrorMessage('ServiceCode',errors)}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="ExpectedEndDate" control={control} render={({ field }) => (
                                    <Calendar id={field.name} value={field.value} onChange={(e) => {field.onChange(e.value)}} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                                )} />
                                <label htmlFor="ExpectedEndDate">Date de fin prévue</label>
                            </span>
                        </div>
                        <div className="field">
                            <Controller name="IsProject" control={control} render={({ field }) => (
                                <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)} checked={field.value}/>
                            )} />
                            <label htmlFor="IsProject" className={classNames({ 'p-error': errors.IsProject ,"label-color":!errors.IsProject})}>Est-ce un projet ?</label>
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
                 