import { Calendar } from "primereact/calendar";
import { ColumnFilterElementTemplateOptions } from "primereact/column";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { TriStateCheckbox, TriStateCheckboxChangeEvent } from "primereact/tristatecheckbox";
import { classNames } from "primereact/utils";
//filter
export function dateFilterTemplate(options: ColumnFilterElementTemplateOptions){
    return <Calendar value={options.value} onChange={(e) => {
            options.filterCallback(e.value, options.index)
        }
    } dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
};
export function booleanFilterTemplate (options: ColumnFilterElementTemplateOptions){
    return(
        <>
        <TriStateCheckbox  value={options.value} onChange={(e: TriStateCheckboxChangeEvent) => options.filterApplyCallback(e.value)} />
        {"<--"}
        </>
    ) 
};
export function numberFilterTemplate (options: ColumnFilterElementTemplateOptions){
    return (
        <InputNumber
            value={options.value}
            onChange={(e: InputNumberChangeEvent) => options.filterCallback(e.value, options.index)} 
        />
    )
};
//template
export function booleanTemplate(rowData:any,field:string){
    return <i className={classNames('pi', { 'true-icon pi-check-circle': rowData[field], 'false-icon pi-times-circle': !rowData[field] })}></i>;
};
export function dateTemplate(rowData:any,field:string){
    return (
        <>
        {
            rowData[field]?
            <>
                {new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/Paris' }).format(rowData[field])}
            </>
            :
            <>
            -
            </> 
        }
        </>
    )
};
export function getFormErrorMessage(path:string,errors:any){

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