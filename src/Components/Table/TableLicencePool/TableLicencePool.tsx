import { FilterMatchMode, FilterOperator, FilterService } from "primereact/api";
import { Button } from "primereact/button";
import { ColumnBodyOptions, Column, ColumnSortEvent, ColumnFilterElementTemplateOptions } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable, DataTableExpandedRows, DataTableRowExpansionTemplate, DataTableValueArray } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ReactNode, useState } from "react";
import { ILicencePool } from "../../../Utils/Interfaces/ILicencePool";
import { booleanFilterTemplate, booleanTemplate, dateFilterTemplate, dateTemplate } from "../../GenericTemaplate/GenericTemplate";
import { IStatus } from "../../../Utils/Interfaces/IStatus";
import { MultiSelect } from "primereact/multiselect";
import { TriStateCheckboxChangeEvent } from "primereact/tristatecheckbox";
import { Tag } from "primereact/tag";

interface IProp{
    licencePools:ILicencePool[],
    selectionMode:"multiple" | "single" | "radiobutton" | "checkbox" | null | undefined
    onEdit?:(licencePool:ILicencePool,option?:ColumnBodyOptions)=>void,
    onDelete?:(licencePool:ILicencePool,option?:ColumnBodyOptions)=>void,
    onClose?:(licencePool:ILicencePool,option?:ColumnBodyOptions)=>void,
    onOpen?:(licencePool:ILicencePool,option?:ColumnBodyOptions)=>void,
    onAdd?:()=>void,
    onExpend?:((data: ILicencePool, options: DataTableRowExpansionTemplate) => ReactNode) | undefined,
    
}

export default function TableLicencePool(prop:IProp){
    const [selectedItems, setSelectedItems] = useState<ILicencePool[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>({});
    const statuses:IStatus[] = [
        { name: 'Cloturé', code: 'contrast' },
        { name: 'Facturé', code: 'RM' },
        { name: 'Non-Facturé', code: 'LDN' },
        { name: 'Expiré', code: 'IST' },
    ];
    FilterService.register('statusFilterAfficher', (array1:IStatus[],array2:IStatus[]) => { 
        if(array2.length===0){
            return true
        }
        for (let i = 0; i < array2.length; i++) {
            for (let j = 0; j < array1.length; j++) {
                if (array2[i].name === array1[j].name) {
                    return true
                }
            }
        }
        return false
    });
    FilterService.register('statusFilterCacher', (array1,array2) => { 
        if(array2.length===0){
            return true
        }
        for (let i = 0; i < array2.length; i++) {
            for (let j = 0; j < array1.length; j++) {
                if (array2[i].name === array1[j].name) {
                    return false
                }
            }
        }
        return true
    });
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        ServiceCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        IsProject: { value: null,  matchMode: FilterMatchMode.EQUALS},
        Name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        CreationDate: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
        ExpectedEndDate: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
        Status: {operator: FilterOperator.AND, constraints: [
            { value:[{ name: 'Cloturé', code: 'contrast' }], matchMode: 'statusFilterCacher' },
        ]}
    });
    function onGlobalFilterChange(e:ILicencePool){
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    function onEdit(licencePool:ILicencePool,option:ColumnBodyOptions){
        if(prop.onEdit===undefined)return
        prop.onEdit(licencePool,option)
    }
    function onDelete(licencePool:ILicencePool,option:ColumnBodyOptions){
        if(prop.onDelete===undefined)return
        confirmDialog({
            message: 'Voulez vous supprimer cette caméra ?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept:()=>prop.onDelete(licencePool,option),
        }); 
    }
    function onClose(licencePool:ILicencePool,option:ColumnBodyOptions){
        if(prop.onClose===undefined)return
        confirmDialog({
            message: "Voulez vous fermer c'ette licence ?",
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-help',
            accept:()=>prop.onClose(licencePool,option),
        });
    }
    function onOpen(licencePool:ILicencePool,option:ColumnBodyOptions){
        if(prop.onOpen===undefined)return
        confirmDialog({
            message: 'Voulez vous reouvrire c ette licence ?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-help',
            accept:()=>prop.onOpen(licencePool,option),
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
                <Button label="Ajoutée un nouveau groupe de licence" severity="success" icon="pi pi-plus" onClick={onAdd} /> 
            </div>
        )
    }
    function toolTemplate(licencePool:ILicencePool,option:ColumnBodyOptions){
        return(
            <div className='table-collumn-tool'>
                {
                    licencePool.IsClose?(
                        prop.onOpen!==undefined&&<Button icon="pi pi-flag-fill" rounded text severity="help" onClick={()=>onOpen(licencePool,option)}/>
                    ):(
                        <>
                            {prop.onDelete!==undefined&&<Button icon="pi pi-trash" rounded text severity="danger" onClick={() => onDelete(licencePool,option)}/>}
                            {prop.onClose!==undefined&&<Button icon="pi pi-flag" rounded text severity="help" onClick={() => onClose(licencePool,option)}/>}
                            {prop.onEdit!==undefined&&<Button icon="pi pi-pencil" rounded text severity="success" onClick={() => onEdit(licencePool,option)}/>}
                        </>
                    )
                }
            </div>
        )
    }
    function sortDate(event: ColumnSortEvent) {
        return event.data.sort((data1:ILicencePool, data2:ILicencePool) => {
            const date1 = new Date(data1.CreationDate).getTime();
            const date2 = new Date(data2.CreationDate).getTime();
            return event.order * (date1 - date2);
        });
    }
    const getSeverity = (status:string) => {
        switch (status) {
            case 'Cloturé':
                return 'contrast';

            case 'Facturé':
                return 'info';

            case 'Non-Facturé':
                return 'warning';

            case 'Expiré':
                return 'danger';
        }
    };
    const statusItemTemplate = (option:any) => {
        return <Tag value={option.name} severity={getSeverity(option.name)} />;
    };
    const statusBodyTemplate = (rowData:ILicencePool) => {
        return (
            <div>
                {
                rowData.Status.map((statu:IStatus)=>{
                    return (
                        statusItemTemplate(statu)
                    )
                })
                }
            </div>
        )
    };
    const statusFilterTemplate = (options:ColumnFilterElementTemplateOptions) => {
        return (
            <MultiSelect 
                value={options.value}
                onChange={(e: TriStateCheckboxChangeEvent) =>{
                    options.filterCallback(e.value,options.index)
                }
                }
                options={statuses}
                itemTemplate={statusItemTemplate} 
                optionLabel="name" 
                placeholder="Select Cities"
                className="w-full md:w-20rem" />
        )
    };
    return (
       <div className="table-test table">
            <ConfirmDialog />
            <DataTable
                value={prop.licencePools} 
                paginator
                expandedRows={expandedRows} 
                rows={10} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                selectionMode={prop.selectionMode}
                filters={filters}
                dataKey="Id"
                selection={selectedItems}
                header={header}
                onRowToggle={(e) => setExpandedRows(e.data)}
                sortField="CreationDate"
                sortOrder={-1}
                rowExpansionTemplate={prop.onExpend}
                globalFilterFields={['ServiceCode', 'Name']}
                removableSort 
                size='small'
            >
            {
                prop.onExpend!==undefined&&<Column expander = {true} />
            }
            <Column
                key="Tool"
                header="Outils"
                body={toolTemplate}
            />
            <Column
                key="ServiceCode"
                field="ServiceCode"
                header="Code de Service" 
                filter 
                filterPlaceholder = "Rechercher par service" 
            />
            <Column
                key="Name"
                field="Name"
                header="Nom du groupe de licences" 
                filter 
                filterPlaceholder = "Rechercher par Nom" 
            />
            <Column
                key="IsProject"
                header="Est un projet" 
                dataType="boolean" 
                filterField="IsProject"
                body={(rowdata)=>booleanTemplate(rowdata,"IsProject")} 
                filterElement={booleanFilterTemplate}
                filter 
            />
            <Column
                key={"CreationDate"}
                body={(rowdata)=>dateTemplate(rowdata,"CreationDate")}
                header="Date de création" 
                filter 
                filterField="CreationDate"
                dataType ="date"
                filterElement={dateFilterTemplate}
                sortable
                sortField="CreationDate"
                sortFunction={sortDate}
            />
            <Column
                key={"ExpectedEndDate"}
                body={(rowdata)=>dateTemplate(rowdata,"ExpectedEndDate")}
                header="Date de fin estimer" 
                filter 
                dataType="date"
                filterField="ExpectedEndDate"
                filterElement={dateFilterTemplate}
            />
            <Column 
                key="Status" 
                header="Status" 
                filterMenuStyle={{ width: '14rem' }} 
                body={statusBodyTemplate}
                filterField="Status"
                filterMatchModeOptions={[
                    {label:"Afficher",value:"statusFilterAfficher"},
                    {label:"Cacher",value:"statusFilterCacher"}
                ]}
                filterElement={statusFilterTemplate}
                filter
            />
            </DataTable>
       </div>
    );
}