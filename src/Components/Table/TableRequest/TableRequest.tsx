import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { ColumnBodyOptions, Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTableRowExpansionTemplate, DataTableExpandedRows, DataTableValueArray, DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ReactNode, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IRequest } from "../../../Utils/Interfaces/IRequest";
import { numberFilterTemplate, dateTemplate, dateFilterTemplate } from "../../GenericTemaplate/GenericTemplate";
interface IProp{
    requests:IRequest[],
    selectionMode:"multiple" | "single" | "radiobutton" | "checkbox" | null | undefined
    onEdit?:(request:IRequest,option?:ColumnBodyOptions)=>void,
    onDelete?:(request:IRequest,option?:ColumnBodyOptions)=>void,
    onSelect?:(request:IRequest)=>void,
    onExpend?:((data: IRequest, options: DataTableRowExpansionTemplate) => ReactNode) | undefined,
    headerElements?:ReactNode[],
    columns?:ReactNode[],
}
export default function TableRequest(prop:IProp){
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState<IRequest[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>({});
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    function onGlobalFilterChange(e:IRequest){
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    function onEdit(request:IRequest,option:ColumnBodyOptions){
        if(prop.onEdit===undefined)return
        prop.onEdit(request,option)
    }
    function onDelete(request:IRequest,option:ColumnBodyOptions){
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
    function header(){
        const container = useRef(null)
        return(
            <div className='table-header' ref={container}>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"></InputIcon>
                    <InputText placeholder="Rechercher" onChange={onGlobalFilterChange}/>
                </IconField>
                <div style={{margin:"auto"}}/>
                {
                    prop.headerElements?.map((element, index) => [
                        index !== 0 && <div key={`margin-${index}`} style={{ margin: "5px" }} />,
                        element
                    ]).flat()
                }
            </div>
        )
    }
    function toolTemplate(request:IRequest,option:ColumnBodyOptions){
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
                dataKey="MasaiCaseNumber"
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
            <Column
                key="LastUpdate"
                body={rowdata=>dateTemplate(rowdata,"LastUpdate")}
                header="Derniere modification"
                filter
                filterField="LastUpdate" 
                dataType="date" 
                filterElement={dateFilterTemplate} 
            />
            {
                prop.columns?.map((element) => element)
            }
            </DataTable>
       </div>
    );
}
 