import { Button } from 'primereact/button';
import './FormTest.css'
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { getFormErrorMessage } from '../../GenericTemaplate/GenericTemplate';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
interface IProp{
    hide :()=>void,
    item:any,
    setitem:(item:any)=>void
}
export default function FormTest(prop:IProp){
    const defaultValues:any = {}
    const methodes = useForm<any>({ defaultValues });
    const { control , formState: { errors }, handleSubmit, reset ,watch} = methodes
    const onSubmit = (data:any) => {
        prop.setitem({
            ...data,
            asChanged:true
        })
        prop.hide()
        reset()
    };
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
                        
                        <div className='footer'>
                            <Button type="submit" label="Envoyer" className="mt-2" />
                        </div>
                    </form>
                </FormProvider>
            </div>
       </div>
    );
}
                 