import { Button } from "primereact/button";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { getFormErrorMessage } from "../../GenericTemaplate/GenericTemplate";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { IUserRole } from "../../../Utils/Interfaces/IUserRole";
import { CameraManagerApiClient } from "../../../Utils/CameraManagerClientApi";
import { MultiSelect } from "primereact/multiselect";
import { DEFAULT_VALUES } from "../../../Utils/DefaultValue";
import { IUserGroup } from "../../../Utils/Interfaces/IUserGroup";

interface IProp{
    hide :()=>void,
    item:IUserGroup|null,
    setitem:(item:IUserGroup)=>void
}
export default function FormUserGroup(prop:IProp){
    const defaultValues:IUserGroup = DEFAULT_VALUES.userGroup
    const methodes = useForm<IUserGroup>({ defaultValues });
    const { control , formState: { errors }, handleSubmit, reset ,watch} = methodes
    const [loading, setLoading] = useState<boolean>(true);
    const [UserRoles, setUserRoles] = useState<IUserRole[]>([]);
    const [Sites, setSites] = useState<string[]>([]);
    const onSubmit = (data:IUserGroup) => {
        let formateditem : IUserGroup = {
            ...data,
            RoleCode:data.RoleCode.Code,
            asChanged:true,
            isNew:prop.item===null
        }
        prop.setitem(formateditem)
        prop.hide()
        reset()
    };
    useEffect(() => {
        Promise.all([
            CameraManagerApiClient.userRole_getAll(),
            CameraManagerApiClient.site_getAll()
        ])
        .then((results=>{
            setUserRoles(results[0])
            setSites(results[1])
            setLoading(false)
        }))
    }, []);
    useEffect(() => {
        if(loading||prop.item===null)return
        reset({
            ...prop.item,
            RoleCode:UserRoles.find(userrole=>userrole.Code===prop.item.RoleCode)
        })
    }, [loading]);
    return (
       <div className="form-user-group form">
            <div className='form-header'>
                <h2>Formulaire {prop.item?"modification":"creation"} group ORDI</h2>
                <div style={{margin:"auto"}}></div>
                <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={prop.hide}/>
            </div>
            <div className='form-body'>
                <FormProvider {...methodes}>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        {
                            prop.item===null&&
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller
                                        name={`Name`}
                                        control={control} 
                                        rules={{ required: 'Nom requis.' }} 
                                        render={({ field, fieldState }) => (
                                            <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                        )} />
                                    <label htmlFor={`Name`} className={classNames({ 'p-error':errors.Name })}>Nom</label>
                                </span>
                                {getFormErrorMessage(`Name`,errors)}
                            </div>
                        }
                        <div className="field">
                            <span className="p-float-label">                                    
                                <Controller name="RoleCode" control={control}  rules={{ required: true }} render={({ field ,fieldState}) => (
                                    <Dropdown  invalid ={fieldState.invalid} id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={UserRoles} optionLabel="Name" loading ={loading}/>
                                )} />
                                <label htmlFor="country"className={classNames({ 'p-error': errors.RoleCode})}>Role</label>
                            </span>
                            {getFormErrorMessage(`Name`,errors)}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name={`SiteCodes`} control={control} rules={{ required: 'Veuiller choisire au moin un Site.' }}  render={({ field, fieldState }) => (
                                    <MultiSelect  loading={loading}   filter  invalid ={fieldState.invalid} id={field.name} value={field.value} onChange={(e) => { field.onChange(e.value)}} options={Sites}  />
                                )} />
                                <label htmlFor={`SiteCodes`} className={classNames({ 'p-error': errors.Usages })}>Sites</label>
                            </span>
                            {getFormErrorMessage(`Name`,errors)}
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
                 