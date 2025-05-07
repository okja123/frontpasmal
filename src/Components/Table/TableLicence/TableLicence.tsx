import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { ColumnBodyOptions, Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { ILicence } from "../../../Utils/Interfaces/ILicence";
import { dateFilterTemplate, dateTemplate, numberFilterTemplate } from "../../GenericTemaplate/GenericTemplate";

interface IProp{
    licences:ILicence[],
    selectionMode:"multiple" | "single" | "radiobutton" | "checkbox" | null | undefined
    onEdit?:(licence:ILicence,option?:ColumnBodyOptions)=>void,
    onDelete?:(licence:ILicence,option?:ColumnBodyOptions)=>void,
    onSelect?:(licence:ILicence)=>void,
    onAdd?:()=>void,
    
}
export default function TableLicence(prop:IProp){
    const [selectedItems, setSelectedItems] = useState<ILicence[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    function onGlobalFilterChange(e:ILicence){
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    function onEdit(licence:ILicence,option:ColumnBodyOptions){
        if(prop.onEdit===undefined)return
        prop.onEdit(licence,option)
    }
    function onDelete(licence:ILicence,option:ColumnBodyOptions){
        if(prop.onDelete===undefined)return
        confirmDialog({
            message: 'Voulez vous supprimer cette caméra ?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept:()=>prop.onDelete(licence,option),
        }); 
    }
    function onSelect(licence:ILicence){
        if(prop.onSelect===undefined)return
        setSelectedItems(licence.value)
        prop.onSelect(licence)
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
                <Button label="Ajoutée une nouvelle Licence" severity="success" icon="pi pi-plus" onClick={onAdd} /> 
            </div>
        )
    }
    function toolTemplate(licence:ILicence,option:ColumnBodyOptions){
        return(
            <div className='table-collumn-tool'>
                {prop.onDelete!==undefined&&<Button icon="pi pi-trash" rounded text severity="danger" aria-label="Supprimer" onClick={() => onDelete(licence,option)}/>}
                {prop.onEdit!==undefined&&<Button icon="pi pi-pencil" rounded text severity="success" aria-label="Filter"  onClick={()=>onEdit(licence,option)}/>}
            </div>
        )
    }
    return (
       <div className="table-test table">
            <DataTable
                value={prop.licences} 
                paginator
                rows={10} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                selectionMode={prop.selectionMode}
                dataKey="name"
                selection={selectedItems}
                header={header}
                size='small'
            >
            <Column
                key="Tool"
                header="Outils"
                body={toolTemplate}
            />
            <Column 
                key="Name"
                field="Name"
                header="Nom" 
                filter
                filterPlaceholder="Search by name" 
            />
            <Column 
                key="ServiceCode"
                field="ServiceCode"
                header="Code du Service" 
                filter
                filterPlaceholder="Search by name" 
            />
            <Column 
                key="ChargeCode"
                field="ChargeCode"
                header="Code du paiement" 
                filter
                filterPlaceholder="Search by name" 
            />
            <Column 
                key="ChargeOrderNumber"
                field="ChargeOrderNumber"
                header="Numero de commande" 
                filter
                filterPlaceholder="Search by name" 
            />
            <Column 
                key="Applicant"
                field="Applicant"
                header="Demandeur" 
                filter
                filterPlaceholder="Search by name" 
            />
            <Column 
                key="Quantity"
                header="Quantitée totale de camera" 
                filterField="Quantity" 
                dataType="numeric" 
                field="Quantity"
                filter 
                filterElement={numberFilterTemplate} 
            />
            <Column 
                key="CameraQuantity"
                header="Quantitée de camera utilisée" 
                filterField="CameraQuantity" 
                dataType="numeric" 
                field="CameraQuantity"
                filter 
                filterElement={numberFilterTemplate}
            />
            <Column 
                key="Comment"
                field="Comment"
                header="Commentaire"
            />
            <Column 
                key="UpdateDate"
                header="Date de mise à jour" 
                filterField="UpdateDate" 
                dataType="date" 
                style={{ minWidth: '10rem' }} 
                body={(rowdata)=>dateTemplate(rowdata,"UpdateDate")} 
                filter 
                filterElement={dateFilterTemplate}
            />
            <Column 
                key="InvoiceDate"
                header="Date de facturation" 
                filterField="InvoiceDate" 
                dataType="date" 
                body={(rowdata)=>dateTemplate(rowdata,"InvoiceDate")} 
                filter 
                filterElement={dateFilterTemplate}
            />
            </DataTable>
       </div>
    );
}
                 