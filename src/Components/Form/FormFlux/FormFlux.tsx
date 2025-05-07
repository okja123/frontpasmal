import { TabPanel, TabView, TabViewTabCloseEvent } from "primereact/tabview";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import './FormFlux.css'
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";
import { IVideoStream } from "../../../Utils/Interfaces/IVideoStream";
import { CameraManagerApiClient } from "../../../Utils/CameraManagerClientApi";
import { DEFAULT_VALUES } from "../../../Utils/DefaultValue";

interface IProp{
    fluxs : IVideoStream[],
    setFlux:(fluxs :IVideoStream[])=>void,
    platform:string
}
export default function FormFlux(prop :IProp){
    const [loading, setLoading] = useState<boolean>(true);
    const [Usages, setUsages] = useState<string[]>([]);
    const { control ,  formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: "VideoStreams", // unique name for your Field Array
    });
    const getFormErrorMessage = (path:string) => {

        let splitPath = path.split(".")
        let errormessage:any = errors
        for(let i =0;i<splitPath.length;i++){
            if(errormessage===undefined)
                return<></>
            errormessage=errormessage[splitPath[i]]
        }
        if(errormessage===undefined)
            return<></>
        return <small className="p-error">{errormessage.message}</small>
    };
    useEffect(() => {
        setLoading(true)
        CameraManagerApiClient.cameraUsage_getAll()
        .then(usages=>{
            setUsages(usages)
            setLoading(false)
        })
    }, []);
    return(
        <>
        <Button type="button" label="Ajouter un Flux Video" onClick={()=>append({
            ...DEFAULT_VALUES.videoStream,
            SiteName:prop.platform,
            LastUpdate:new Date
            })}></Button>
        <TabView 
            scrollable
            className="infoflux" >
            {fields.map((field, index) => {
                return (
                    <TabPanel 
                        key={field.id}
                        header={"Flux "+index} 
                        //rightIcon={errors[index]}
                    >
                    <div className="grid-flux-form">
                    <div className="field">
                        <span className="p-float-label">
                            <Controller
                                name={`VideoStreams.${index}.Name`}
                                control={control} 
                                rules={{ required: 'Nom requis.' }} 
                                render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            <label htmlFor={`VideoStreams.${index}.Name`} className={classNames({ 'p-error':errors.Switch })}>Nom</label>
                        </span>
                        {getFormErrorMessage(`VideoStreams.${index}.Name`)}
                    </div>
                    <div className="field">
                        <span className="p-float-label">
                            <Controller
                                name={`VideoStreams.${index}.PreferredConnectionType`}
                                control={control} 
                                rules={{ required: 'Type de Connexion requis.' }} 
                                render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            <label htmlFor={`VideoStreams.${index}.PreferredConnectionType`} className={classNames({ 'p-error':errors.Switch })}>Type de Connexion preferée</label>
                        </span>
                        {getFormErrorMessage(`VideoStreams.${index}.PreferredConnectionType`)}
                    </div>
                    <div className="field">
                        <span className="p-float-label">
                            <Controller
                                name={`VideoStreams.${index}.RecordingFrameInterval`}
                                control={control} 
                                rules={{ required: 'Type de Connexion requis.' }} 
                                render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            <label htmlFor={`VideoStreams.${index}.RecordingFrameInterval`} className={classNames({ 'p-error':errors.Switch })}>intervalle de trame d'enregistrement </label>
                        </span>
                        {getFormErrorMessage(`VideoStreams.${index}.RecordingFrameInterval`)}
                    </div>
                    <div className="field">
                        <span className="p-float-label">
                            <Controller
                                name={`VideoStreams.${index}.MulticastAdress`}
                                control={control} 
                                rules={{ pattern: {value:/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,message:"L'adresse IP doit être renseignée et valide."},required: "L'adresse IP doit être renseignée et valide." }}
                                render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            <label htmlFor={`VideoStreams.${index}.MulticastAdress`} className={classNames({ 'p-error':errors.Switch })}>Adresse Multicaste</label>
                        </span>
                        {getFormErrorMessage(`VideoStreams.${index}.MulticastAdress`)}
                    </div>
                    <div className="field ">
                        <span className="p-float-label">
                            <Controller
                                name={`VideoStreams.${index}.BitRate`}
                                control={control} 
                                rules={{ required: 'Nom requis.' }} 
                                render={({ field, fieldState }) => (
                                    <InputNumber id={field.name} {...field} onChange={(e) => field.onChange(e.value)} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            <label htmlFor="BitRate" className={classNames({ 'p-error': errors.LogicalId })}>BitRate</label>
                        </span>
                        {getFormErrorMessage(`VideoStreams.${index}.BitRate`)}
                    </div>
                    <div className="field ">
                        <span className="p-float-label">
                            <Controller
                                name={`VideoStreams.${index}.FrameRate`}
                                control={control} 
                                rules={{ required: 'Nom requis.' }} 
                                render={({ field, fieldState }) => (
                                    <InputNumber id={field.name} {...field} onChange={(e) => field.onChange(e.value)} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            <label htmlFor="FrameRate" className={classNames({ 'p-error': errors.FrameRate })}>FrameRate</label>
                        </span>
                        {getFormErrorMessage(`VideoStreams.${index}.FrameRate`)}
                    </div>
                    <div className="field ">
                        <span className="p-float-label">
                            <Controller
                                name={`VideoStreams.${index}.ImageQuality`}
                                control={control} 
                                rules={{ required: 'Nom requis.' }} 
                                render={({ field, fieldState }) => (
                                    <InputNumber id={field.name} {...field} onChange={(e) => field.onChange(e.value)} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            <label htmlFor="ImageQuality" className={classNames({ 'p-error': errors.LogicalId })}>ImageQuality</label>
                        </span>
                        {getFormErrorMessage(`VideoStreams.${index}.ImageQuality`)}
                    </div>
                    <div className="field ">
                        <span className="p-float-label">
                            <Controller
                                name={`VideoStreams.${index}.KeyFrameInterval`}
                                control={control} 
                                rules={{ required: 'Nom requis.' }} 
                                render={({ field, fieldState }) => (
                                    <InputNumber id={field.name} {...field} onChange={(e) => field.onChange(e.value)} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            <label htmlFor="KeyFrameInterval" className={classNames({ 'p-error': errors.LogicalId })}>Key Frame Interval</label>
                        </span>
                        {getFormErrorMessage(`VideoStreams.${index}.KeyFrameInterval`)}
                    </div>
                    <div className="field ">
                        <span className="p-float-label">
                            <Controller
                                name={`VideoStreams.${index}.MulticastPort`}
                                control={control} 
                                rules={{ required: 'Nom requis.' }} 
                                render={({ field, fieldState }) => (
                                    <InputNumber id={field.name} {...field} onChange={(e) => field.onChange(e.value)} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            <label htmlFor="MulticastPort" className={classNames({ 'p-error': errors.LogicalId })}>Port Multicast</label>
                        </span>
                        {getFormErrorMessage(`VideoStreams.${index}.MulticastPort`)}
                    </div>
                    <div className="field ">
                        <span className="p-float-label">
                            <Controller
                                name={`VideoStreams.${index}.ResolutionX`}
                                control={control} 
                                rules={{ required: 'Nom requis.' }} 
                                render={({ field, fieldState }) => (
                                    <InputNumber id={field.name} {...field} onChange={(e) => field.onChange(e.value)} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            <label htmlFor="ResolutionX" className={classNames({ 'p-error': errors.LogicalId })}>Resolution X</label>
                        </span>
                        {getFormErrorMessage(`VideoStreams.${index}.ResolutionX`)}
                    </div>
                    <div className="field ">
                        <span className="p-float-label">
                            <Controller
                                name={`VideoStreams.${index}.ResolutionY`}
                                control={control} 
                                rules={{ required: 'Nom requis.' }} 
                                render={({ field, fieldState }) => (
                                    <InputNumber id={field.name} {...field} onChange={(e) => field.onChange(e.value)} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            <label htmlFor="ResolutionY" className={classNames({ 'p-error': errors.LogicalId })}>Resolution Y</label>
                        </span>
                        {getFormErrorMessage(`VideoStreams.${index}.ResolutionY`)}
                    </div>
                    <div className="field">
                        <span className="p-float-label">
                            <Controller name={`VideoStreams.${index}.Usages`} control={control} rules={{ required: 'Veuiller choisire un Archiveur.' }}  render={({ field, fieldState }) => (
                                <MultiSelect  loading={loading}   filter  invalid ={fieldState.invalid} id={field.name} value={field.value} onChange={(e) => { field.onChange(e.value)}} options={Usages}  />
                            )} />
                            <label htmlFor={`VideoStreams.${index}.Usages`} className={classNames({ 'p-error': errors.Usages })}>Usages</label>
                        </span>
                        {getFormErrorMessage(`VideoStreams.${index}.Usages`)}
                    </div>
                    </div>
                    <Button type="button" label="Supprimer le Flux Video" onClick={() => remove(index)}></Button>
                    </TabPanel>
                );
            })}
        </TabView>
        </> 
    )
}