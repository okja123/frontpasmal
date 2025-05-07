import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { ColumnBodyOptions, Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { IRenameCamera } from "../../../Utils/Interfaces/IRenameCamera";
import { booleanFilterTemplate, booleanTemplate, dateFilterTemplate, dateTemplate } from "../../GenericTemaplate/GenericTemplate";

interface IProp{
    requestCameraDeletes:IRenameCamera[],
    selectionMode:"multiple" | "single" | "radiobutton" | "checkbox" | null | undefined
    loading:boolean,
    onEdit?:(requestCameraDelete:IRenameCamera,option?:ColumnBodyOptions)=>void,
    onDelete?:(requestCameraDelete:IRenameCamera,option?:ColumnBodyOptions)=>void,
    onSelect?:(requestCameraDelete:IRenameCamera)=>void,
    
}
export default function TableRequestCameraDeleteLight(prop:IProp){
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        NewName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        OldName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        CameraSiteName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        CameraLogicalId: { value: null, matchMode: FilterMatchMode.EQUALS },
        IsRename: { value: null, matchMode: FilterMatchMode.EQUALS },
        RequestDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
        RenameDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
        Applicant: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    function onGlobalFilterChange(e:any){
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    function onEdit(requestCameraDelete:IRenameCamera,option:ColumnBodyOptions){
        if(prop.onEdit===undefined)return
        prop.onEdit(requestCameraDelete,option)
    }
    function onDelete(requestCameraDelete:IRenameCamera,option:ColumnBodyOptions){
        if(prop.onDelete===undefined)return
        confirmDialog({
            message: 'Voulez vous supprimer cette caméra ?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept:()=>prop.onDelete?prop.onDelete(requestCameraDelete,option):null,
        }); 
    }
    function onSelect(event:any){
        if(prop.onSelect===undefined)return
        setSelectedItems(event.value)
        prop.onSelect(event)
    }
    function header(){
        return(
            <div className='table-header'>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"></InputIcon>
                    <InputText placeholder="Rechercher" onChange={onGlobalFilterChange}/>
                </IconField>
                <div style={{margin:"auto"}}/>
            </div>
        )
    }
    function toolTemplate(requestCameraDelete:IRenameCamera,option:ColumnBodyOptions){
        return(
            <div className='table-collumn-tool'>
                {prop.onDelete!==undefined&&<Button icon="pi pi-trash" rounded text severity="danger" aria-label="Supprimer" onClick={() => onDelete(requestCameraDelete,option)}/>}
                {prop.onEdit!==undefined&&<Button icon="pi pi-pencil" rounded text severity="success" aria-label="Filter"  onClick={()=>onEdit(requestCameraDelete,option)}/>}
            </div>
        )
    }
    return (
       <div className="table-rename-camera table">
            <ConfirmDialog />
            <DataTable
                value={prop.requestCameraDeletes} 
                paginator
                rows={10} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                selectionMode={prop.selectionMode}
                onSelectionChange={onSelect}
                dataKey="name"
                selection={selectedItems}
                header={header}
                size='small'
                loading={prop.loading}
                globalFilterFields={['CameraName', 'UnitName', 'ArchiverName', 'Applicant']}
                globalFilter={globalFilterValue}
                emptyMessage="Aucune requestCameraDeletes trouver."
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
                key="OldName"
                field="OldName"
                header="Ancien Nom" 
                filter 
                filterPlaceholder = "Rechercher par Service" 
            />
            <Column
                key={"NewName"}
                field="NewName"
                header="Nouveau Nom" 
                filter 
                filterPlaceholder="Rechercher par Nom" 
            />
            <Column
                key="CameraLogicalId"
                field="CameraLogicalId"
                header="Logical ID" 
                filter 

                filterPlaceholder="Rechercher par ID" 
            />
            <Column
                key={"CameraSiteName"}
                field="CameraSiteName"
                header="Site" 
                filter 
                filterPlaceholder="Rechercher par Nom Archiveur" 
            />
            <Column
                key={"Applicant"}
                field="Applicant"
                header="Demandeur" 
                filter 
                filterPlaceholder="Rechercher par Nom Archiveur" 
            />
            <Column
                key={"RequestDate"}
                header="Date demande" 
                body={(rowData)=>dateTemplate(rowData,"RequestDate")}
                filter
                dataType="date"
                filterField="RequestDate"
                filterElement={dateFilterTemplate}
            />
            <Column
                header="isRename" 
                dataType="boolean" 
                body={(rowData)=>booleanTemplate(rowData,'isReaname')} 
                filterElement={booleanFilterTemplate}
                filter 
            />
            <Column
                key={"RenameDate"}
                header="Date renommage" 
                body={(rowData)=>dateTemplate(rowData,"RenameDate")}
                filter
                dataType="date"
                filterField="RenameDate"
                filterElement={dateFilterTemplate}
            />
            </DataTable>
       </div>
    );
}
                 