import { DataTable } from 'primereact/datatable';
import './TableTest.css'
import { Column, ColumnBodyOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
interface IProp{
    items:any[],
    selectionMode:"multiple" | "single" | "radiobutton" | "checkbox" | null | undefined
    onEdit?:(item:any,option?:ColumnBodyOptions)=>void,
    onDelete?:(item:any,option?:ColumnBodyOptions)=>void,
    onSelect?:(item:any)=>void,
    onAdd?:()=>void,
    
}
export default function TableTest(prop:IProp){
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    function onGlobalFilterChange(e:any){
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    function onEdit(item:any,option:ColumnBodyOptions){
        if(prop.onEdit===undefined)return
        prop.onEdit(item,option)
    }
    function onDelete(item:any,option:ColumnBodyOptions){
        if(prop.onDelete===undefined)return
        confirmDialog({
            message: 'Voulez vous supprimer cette caméra ?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept:()=>prop.onDelete(item,option),
        }); 
    }
    function onSelect(item:any){
        if(prop.onSelect===undefined)return
        setSelectedItems(item.value)
        prop.onSelect(item)
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
                <Button label="Crée un Item" severity="success" icon="pi pi-plus" onClick={onAdd} /> 
            </div>
        )
    }
    function toolTemplate(item:any,option:ColumnBodyOptions){
        return(
            <div className='table-collumn-tool'>
                {prop.onDelete!==undefined&&<Button icon="pi pi-trash" rounded severity="danger" aria-label="Supprimer" onClick={() => onDelete(item,option)}/>}
                {prop.onEdit!==undefined&&<Button icon="pi pi-pencil" rounded text aria-label="Filter"  onClick={()=>onEdit(item,option)}/>}
            </div>
        )
    }
    return (
       <div className="table-test table">
            <ConfirmDialog />
            <DataTable
                value={prop.items} 
                paginator
                rows={10} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                selectionMode={prop.selectionMode}
                onSelectionChange={onSelect}
                dataKey="name"
                selection={selectedItems}
                header={header}
                size='small'
            >
            <Column
                key="Tool"
                header="Outils"
                body={toolTemplate}/>
            </DataTable>
       </div>
    );
}
                 