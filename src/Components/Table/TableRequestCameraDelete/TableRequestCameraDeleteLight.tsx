import { DataTable } from 'primereact/datatable';
import './TableRequestCameraDeleteLight.css'
import { Column, ColumnBodyOptions} from 'primereact/column';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { IRequestCameraDeleteLight } from '../../../Utils/Interfaces/IRequestCameraDeleteLight';
import { booleanFilterTemplate, booleanTemplate, dateFilterTemplate, dateTemplate } from '../../GenericTemaplate/GenericTemplate';
interface IProp{
    requestCameraDeletes:IRequestCameraDeleteLight[],
    selectionMode:"multiple" | "single" | "radiobutton" | "checkbox" | null | undefined
    loading:boolean,
    onEdit?:(requestCameraDelete:IRequestCameraDeleteLight,option?:ColumnBodyOptions)=>void,
    onDelete?:(requestCameraDelete:IRequestCameraDeleteLight,option?:ColumnBodyOptions)=>void,
    onSelect?:(requestCameraDelete:IRequestCameraDeleteLight)=>void,
    
}
export default function TableRequestCameraDeleteLight(prop:IProp){
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        CameraName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        SecurityCenterId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        UnitName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        ArchiverName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        Applicant: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        RequestDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
        DeleteDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
        IsDelete: { value: null,  matchMode: FilterMatchMode.EQUALS},
    });
    function onGlobalFilterChange(e:any){
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    function onEdit(requestCameraDelete:IRequestCameraDeleteLight,option:ColumnBodyOptions){
        if(prop.onEdit===undefined)return
        prop.onEdit(requestCameraDelete,option)
    }
    function onDelete(requestCameraDelete:IRequestCameraDeleteLight,option:ColumnBodyOptions){
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
    function toolTemplate(requestCameraDelete:IRequestCameraDeleteLight,option:ColumnBodyOptions){
        return(
            <div className='table-collumn-tool'>
                {prop.onDelete!==undefined&&<Button icon="pi pi-trash" rounded text severity="danger" aria-label="Supprimer" onClick={() => onDelete(requestCameraDelete,option)}/>}
                {prop.onEdit!==undefined&&<Button icon="pi pi-pencil" rounded text severity="success" aria-label="Filter"  onClick={()=>onEdit(requestCameraDelete,option)}/>}
            </div>
        )
    }
    return (
       <div className="table-test table">
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
                emptyMessage="Aucune demende de suppression trouver."
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
                key={"CameraName"}
                field="CameraName"
                header="Nom caméra" 
                filter 
                filterPlaceholder = "Rechercher par nom" 
            />
            {
            /*
            <Column
                key={"SecurityCenterId"}
                field="SecurityCenterId"
                header="ID Security Center" 
                filter 
                filterPlaceholder="Rechercher par ID" 
                />
            */
            }
            <Column
                key={"UnitName"}
                field="UnitName"
                header="Nom unité" 
                filter 
                filterPlaceholder="Rechercher par Nom" 
            />
            <Column
                key={"ArchiverName"}
                field="ArchiverName"
                header="Archiveur" 
                filter 
                filterPlaceholder="Rechercher par Nom Archiveur" 
            />
            <Column
                key={"Applicant"}
                field="Applicant"
                header="Demandeur" 
                filter 
                filterPlaceholder="Rechercher par Nom Encodeur" 
            />
            <Column
                key={"RequestDate"}
                header="Date demande" 
                dataType="date"
                filterField="RequestDate" 
                filter
                filterElement={dateFilterTemplate}
                body = {(rowData)=>dateTemplate(rowData,"RequestDate")}
            />
            <Column
                key="IsDelete"
                field="IsDelete"
                header="Supprimer ?" 
                dataType="boolean" 
                body={(rowData)=>booleanTemplate(rowData,"IsDelete")} 
                filterElement={booleanFilterTemplate}
                filter 
            />
            <Column
                key={"DeleteDate"}
                filter
                dataType="date"
                filterField="DeleteDate" 
                filterElement={dateFilterTemplate}
                header="Date supression" 
                body = {(rowData)=>dateTemplate(rowData,"DeleteDate")}
            />
            </DataTable>
       </div>
    );
}
                 