import { Column, ColumnBodyOptions } from "primereact/column";
import { IRequestLight } from "../../../Utils/Interfaces/IRequestLight";
import { ReactNode, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable, DataTableExpandedRows, DataTableRowExpansionTemplate, DataTableValueArray } from "primereact/datatable";
import { dateFilterTemplate, dateTemplate, numberFilterTemplate } from "../../GenericTemaplate/GenericTemplate";
import { useNavigate } from "react-router-dom";

interface IProp{
    requests:IRequestLight[],
    selectionMode:"multiple" | "single" | "radiobutton" | "checkbox" | null | undefined
    onEdit?:(request:IRequestLight,option?:ColumnBodyOptions)=>void,
    onDelete?:(request:IRequestLight,option?:ColumnBodyOptions)=>void,
    onSelect?:(request:IRequestLight)=>void,
    onAdd?:()=>void,
    onExpend?:((data: IRequestLight, options: DataTableRowExpansionTemplate) => ReactNode) | undefined,
}
export default function TableRequestLight(prop:IProp){
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState<IRequestLight[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>({});
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    function onGlobalFilterChange(e:IRequestLight){
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    function onEdit(request:IRequestLight,option:ColumnBodyOptions){
        if(prop.onEdit===undefined)return
        prop.onEdit(request,option)
    }
    function onDelete(request:IRequestLight,option:ColumnBodyOptions){
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
    function onSelect(selecteditem:any){
        if(prop.onSelect===undefined)return
        setSelectedItems(selecteditem.value)
        prop.onSelect(selecteditem)
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
                <Button label="Crée une requete" severity="success" icon="pi pi-plus" onClick={()=>navigate("/create-request")} /> 
                <div style={{margin:"5px"}}/>
                <Button label="Importer des Requetes" severity="success" icon="pi pi-file-excel" onClick={()=>navigate("/import-request")} /> 
            </div>
        )
    }
    function toolTemplate(request:IRequestLight,option:ColumnBodyOptions){
        return(
            <div className='table-collumn-tool'>
                {prop.onDelete!==undefined&&<Button icon="pi pi-trash" rounded text severity="danger" aria-label="Supprimer" onClick={() => onDelete(request,option)}/>}
                {prop.onEdit!==undefined&&<Button icon="pi pi-pencil" rounded text severity="success" aria-label="Filter"  onClick={()=>onEdit(request,option)}/>}
            </div>
        )
    }
    return (
       <div className="table-test table">
            <ConfirmDialog />
            <DataTable
                value={prop.requests} 
                paginator
                rows={10} 
                expandedRows={expandedRows} 
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowsPerPageOptions={[5, 10, 25, 50]}
                selectionMode={prop.selectionMode}
                rowExpansionTemplate={prop.onExpend}
                onSelectionChange={onSelect}
                dataKey="Id"
                selection={selectedItems}
                header={header}
                size='small'
            >
            {
                prop.onExpend!==undefined&&<Column expander = {true} />
            }
            {
                (prop.onDelete!==undefined||prop.onEdit!==undefined)&&
                <Column
                    key="Tool"
                    header="Outils"
                    body={toolTemplate}
                />
            }
            <Column
                key="Title"
                field="Title"
                header="Titre"
                filter
            />
            <Column
                key="ServiceName"
                field="ServiceName"
                header="Demendeur"
                filter
            />
            <Column
                key="RequestType"
                field="RequestType"
                header="Type de requete"
                filter
            />
            <Column
                key="RequestState"
                field="RequestState"
                header="Etas de la requete"
                filter
            />
            <Column
                key="NumberOfCamerasRequested"
                body={data =>  {
                    return(
                        <>
                            {
                                data.NumberOfCamerasRequested?
                                <>
                                    {data.NumberOfCamerasRequested}
                                </>
                                :
                                <>
                                    Non renseigner
                                </>
                            }
                        </>
                    )
                }}
                header="Nombre de cameras demandees"
                filter
                filterField="NumberOfCamerasRequested" 
                dataType="numeric" 
                filterElement={numberFilterTemplate} 
            />
            <Column
                key="NumberOfCameras"
                field="NumberOfCameras"
                header="Nombre de cameras"
                filter
                filterField="NumberOfCameras" 
                dataType="numeric" 
                filterElement={numberFilterTemplate} 
            />
            {
                <Column
                    key="LastUpdate"
                    body={rowdata=>dateTemplate(rowdata,"LastUpdate")}
                    header="Derniere modification"
                    filter
                    filterField="LastUpdate" 
                    dataType="date" 
                    filterElement={dateFilterTemplate} 
                />
            }
            </DataTable>
       </div>
    );
}
 