import { Button } from "primereact/button";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { IRenameCamera } from "../../../Utils/Interfaces/IRenameCamera";
import { getFormErrorMessage } from "../../GenericTemaplate/GenericTemplate";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { ICamera } from "../../../Utils/Interfaces/ICamera";

interface IProp{
    hide :()=>void,
    item:IRenameCamera,
    setitem:(item:IRenameCamera)=>void
    camera?:ICamera
}
export default function FormRenameCamera(prop:IProp){
    const defaultValues:IRenameCamera = {}
    const methodes = useForm<IRenameCamera>({ defaultValues });
    const { control , formState: { errors }, handleSubmit, reset} = methodes
    const onSubmit = (data:IRenameCamera) => {
        let renamecameratemp:IRenameCamera={
            ...data,
            Applicant:localStorage.getItem("userName")??"",
            asChanged:true
        }
        if(prop.camera!== null){
            console.log(prop.camera)
            renamecameratemp = {
                ...renamecameratemp,
                OldName:prop.camera.NameCamera,
                CameraGuidCamera:prop.camera.GuidCamera,
                CameraSiteName:prop.camera.SiteName,
                CameraLogicalId:prop.camera.LogicalId,
            }
        }
        prop.setitem(renamecameratemp)
        prop.hide()
        reset()
    };
    return (
       <div className="form-test form">
            <div className='form-header'>
                <h2>Formulaire renommage camera</h2>
                <div style={{margin:"auto"}}></div>
                <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={prop.hide}/>
            </div>
            <div className='form-body'>
                <FormProvider {...methodes}>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="NewName" control={control} rules={{ required: 'Titre est Requis.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="NewName" className={classNames({ 'p-error': errors.NewName })}>Nouveau nom</label>
                            </span>
                            {getFormErrorMessage('NewName',errors)}
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
                 