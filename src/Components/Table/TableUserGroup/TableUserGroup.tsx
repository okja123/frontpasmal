import { DataTable } from 'primereact/datatable';
import { Column, ColumnBodyOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import IUserGroup from '../../../Utils/Interfaces/IUserGroup';
interface IProp{
    userGroups:IUserGroup[],
    selectionMode:"multiple" | "single" | "radiobutton" | "checkbox" | null | undefined
    loading:boolean,
    onEdit?:(userGroup:IUserGroup,option?:ColumnBodyOptions)=>void,
    onDelete?:(userGroup:IUserGroup,option?:ColumnBodyOptions)=>void,
    onSelect?:(userGroup:IUserGroup)=>void,
    onAdd?:()=>void,
    
}
export default function TableUserGroup(prop:IProp){
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        Name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        RoleCode: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    function onGlobalFilterChange(e:any){
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    function onEdit(userGroup:IUserGroup,option:ColumnBodyOptions){
        if(prop.onEdit===undefined)return
        prop.onEdit(userGroup,option)
    }
    function onDelete(userGroup:IUserGroup,option:ColumnBodyOptions){
        if(prop.onDelete===undefined)return
        confirmDialog({
            message: 'Voulez vous supprimer cette caméra ?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept:()=>prop.onDelete?prop.onDelete(userGroup,option):null,
        }); 
    }
    function onSelect(event:any){
        if(prop.onSelect===undefined)return
        setSelectedItems(event.value)
        prop.onSelect(event)
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
                <Button label="Crée un Groupe" severity="success" icon="pi pi-plus" onClick={onAdd} /> 
            </div>
        )
    }
    function toolTemplate(userGroup:IUserGroup,option:ColumnBodyOptions){
        return(
            <div className='table-collumn-tool'>
                {prop.onDelete!==undefined&&<Button icon="pi pi-trash" rounded text severity="danger" aria-label="Supprimer" onClick={() => onDelete(userGroup,option)}/>}
                {prop.onEdit!==undefined&&<Button icon="pi pi-pencil" rounded text severity="success" aria-label="Filter"  onClick={()=>onEdit(userGroup,option)}/>}
            </div>
        )
    }
    function siteTemplate(userGroup:IUserGroup,site:string){
        return(
            <>
                {
                    userGroup.SiteCodes.find(sitecode=>sitecode==site)?
                    <>
                        <i className="pi pi-check-circle"></i>
                    </>
                    :
                    <>
                        <i className="pi pi-times-circle"></i>
                    </>
                }
            </>
        )
    }
    return (
       <div className="table-test table">
            <ConfirmDialog />
            <DataTable
                value={prop.userGroups} 
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
                emptyMessage="Aucune userGroups trouver."
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
                key="Name"
                field="Name"
                header="Groupe ORDI" 
                filter 
                filterPlaceholder = "Rechercher par nom" 
            />
            <Column
                key="RoleCode"
                field="RoleCode"
                header="Code Role" 
                filter 
                filterPlaceholder="Rechercher par Nom" 
            />
            <Column
                key="CDG"
                header="CDG" 
                body={(rowData)=>siteTemplate(rowData,"CDG")}
            />
            <Column
                key="ORY"
                header="ORY" 
                body={(rowData)=>siteTemplate(rowData,"ORY")}
            />
            <Column
                key="LBG"
                header="LBG" 
                body={(rowData)=>siteTemplate(rowData,"LBG")}
            />            
            </DataTable>
       </div>
    );
}
                 