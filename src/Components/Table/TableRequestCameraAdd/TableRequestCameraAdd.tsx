import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { ColumnBodyOptions, Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { ICameraRequestAdd } from "../../../Utils/Interfaces/IRequestCameraAdd";
import { Tag } from "primereact/tag";

interface IProp{
    requests:ICameraRequestAdd[],
    selectionMode:"multiple" | "single" | "radiobutton" | "checkbox" | null | undefined
    onEdit?:(request:ICameraRequestAdd,option?:ColumnBodyOptions)=>void,
    onDelete?:(request:ICameraRequestAdd,option?:ColumnBodyOptions)=>void,
    onAdd?:()=>void,
    validation:boolean,
}
export default function TableRequestCameraAdd(prop:IProp){
    const [selectedItems, setSelectedItems] = useState<ICameraRequestAdd[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        LogicalId: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    function onGlobalFilterChange(e:ICameraRequestAdd){
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    function onEdit(request:ICameraRequestAdd,option:ColumnBodyOptions){
        if(prop.onEdit===undefined)return
        prop.onEdit(request,option)
    }
    function onDelete(request:ICameraRequestAdd,option:ColumnBodyOptions){
        if(prop.onDelete===undefined)return
        confirmDialog({
            message: 'Voulez vous supprimer cette caméra ?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept:()=>prop.onDelete(request,option),
        }); 
    }
    function onAdd(){
        if(prop.onAdd===undefined)return
        prop.onAdd()
    }
    function header(){
        return(
            <div className='table-header'>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"></InputIcon>
                    <InputText placeholder="Rechercher" onChange={onGlobalFilterChange}/>
                </IconField>
                <div style={{margin:"auto"}}/>
                {
                    prop.onAdd!==undefined&&
                    <Button label="Crée une requete camera" severity="success" icon="pi pi-plus" onClick={onAdd} /> 
                }
            </div>
        )
    }
    function toolTemplate(request:ICameraRequestAdd,option:ColumnBodyOptions){
        return(
            <div className='table-collumn-tool'>
                {prop.onDelete!==undefined&&<Button icon="pi pi-trash" rounded severity="danger" aria-label="Supprimer" onClick={() => onDelete(request,option)}/>}
                {
                    prop.onEdit!==undefined&&request.SiteName?
                    <>
                        <Button icon="pi pi-pencil" severity="success" rounded onClick={() => onEdit(request,option)}/>
                    </>
                    :<>
                        <Button tooltip="Veullier Selectionner d'abort la licence de la requete" icon="pi pi-exclamation-triangle" severity="warning" rounded />
                    </>
                }
            </div>
        )
    }
    return (
       <div className="table-test table">
            <DataTable
                value={prop.requests} 
                paginator
                rows={10} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                selectionMode={prop.selectionMode}
                dataKey="name"
                selection={selectedItems}
                header={header}
                size='small'
            >
            {
                (prop.onDelete!==undefined||prop.onEdit!==undefined)&&
                <Column
                    key="Tool"
                    header="Outils"
                    body={toolTemplate}
                />
            }
            <Column
                key="NameCamera"
                field="NameCamera"
                header="Nom Camera"
                filter
            />
            <Column
                key="RequestCameraState"
                field="RequestCameraState"
                header="Etas de la requete"
                filter
            />
            <Column
                key="ConfigurationItemNumber"
                field="ConfigurationItemNumber"
                header="CI"
                filter
            />
            <Column
                key="IPAddress"
                field="IPAddress"
                header="Adresse Ip"
                filter
            />
            <Column
                key="LogicalId"
                field="LogicalId"
                header="Logical Id"
                filter
            /> 
            {
                prop.validation&&
                <Column
                    key="isMissingInfo"
                    field="isMissingInfo"
                    header="Erreur"
                    body={(data:ICameraRequestAdd) => {
                        return(
                            <Tag
                                value={data.isMissingInfo?"Erreur":"OK"}
                                severity={data.isMissingInfo?"danger":"success"}
                                icon={data.isMissingInfo?"pi pi-times":"pi pi-check"}
                            ></Tag>
                        )   
                    }}
                />
            }
            </DataTable>
       </div>
    );
}
 