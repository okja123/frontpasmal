import { DataTable } from 'primereact/datatable';
import './TableCamera.css'
import { Column, ColumnBodyOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { useRef, useState } from 'react';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { TriStateCheckbox, TriStateCheckboxChangeEvent } from 'primereact/tristatecheckbox';
import { ICamera } from '../../../Utils/Interfaces/ICamera';
import { OverlayPanel } from 'primereact/overlaypanel';
import { CameraManagerApiClient } from '../../../Utils/CameraManagerClientApi';
import CameraSnapshot from '../../Cameras/CameraSnapshot/CameraSnapshot';
import { Divider } from 'primereact/divider';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { booleanFilterTemplate } from '../../GenericTemaplate/GenericTemplate';
import Mapper from '../../../Utils/Mapper';
interface IProp{
    cameras:ICamera[],
    selectionMode:"multiple" | "single" | "radiobutton" | "checkbox" | null | undefined
    loading:boolean,
    onEdit?:(camera:ICamera,option?:ColumnBodyOptions)=>void,
    onDelete?:(camera:ICamera,option?:ColumnBodyOptions)=>void,
    onSelect?:(event:any)=>void,
    
}
export default function TableCamera(prop:IProp){
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        IsGeneralStateOk: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    function onGlobalFilterChange(e:any){
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    function onEdit(camera:ICamera,option:ColumnBodyOptions){
        if(prop.onEdit===undefined)return
        prop.onEdit(camera,option)
    }
    function onDelete(camera:ICamera,option:ColumnBodyOptions){
        if(prop.onDelete===undefined)return
        confirmDialog({
            message: 'Voulez vous supprimer cette caméra ?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept:()=>prop.onDelete?prop.onDelete(camera,option):null,
        }); 
    }
    function onSelect(event:any){
        //setSelectedItems(event.value)
        prop.onSelect(event)
    }
    function exportRequest(){
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(Mapper.mapToCameraExel(prop.cameras));
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });
            saveAsExcelFile(excelBuffer, 'Cameras');
        });
        const saveAsExcelFile = (buffer:any, fileName:any) => {
            import('file-saver').then((module) => {
                if (module && module.default) {
                    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                    let EXCEL_EXTENSION = '.xlsx';
                    const data = new Blob([buffer], {
                        type: EXCEL_TYPE
                    });
    
                    module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
                }
            });
        };
    }

    function header(){
        return(
            <div className='table-header'>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"></InputIcon>
                    <InputText placeholder="Rechercher" onChange={onGlobalFilterChange}/>
                </IconField>
                <div style={{margin:"auto"}}/>
                <Button label="Exportée les cameras" severity="success" icon="pi pi-file-excel" onClick={exportRequest} /> 
            </div>
        )
    }
    function toolTemplate(camera:ICamera,option:ColumnBodyOptions){
        return(
            <div className='table-collumn-tool'>
                {prop.onDelete!==undefined&&<Button icon="pi pi-trash" rounded text severity="danger" aria-label="Supprimer" onClick={() => onDelete(camera,option)}/>}
                {prop.onEdit!==undefined&&<Button icon="pi pi-pencil" rounded text severity="success" aria-label="Filter"  onClick={()=>onEdit(camera,option)}/>}
            </div>
        )
    }
    function IsGeneralStateOkTemplate(rowData:ICamera){
        let icon = "pi pi-"+( rowData.IsGeneralStateOk? "check":"times")
        let color = rowData.IsGeneralStateOk? "green":"red"
        const croixrouge = <i className="pi pi-times" style={{ color: "red" }} />
        const traisvert = <i className="pi pi-check" style={{ color: "green" }} />
        const op = useRef<OverlayPanel>(null);
        return(
            <>
                <i className={icon} style={{ color: color }}
                    //onMouseLeave={(e) => op.current?.toggle(e)}
                    //onMouseEnter={(e) => op.current?.toggle(e)}
                    onClick={(e) => op.current?.toggle(e)}></i>
                <OverlayPanel ref={op}>
                    <div className='overlayPanel'>
                        <CameraSnapshot plateform={rowData.SiteName} guid={rowData.GuidCamera}/>
                        <p>Etat de la caméra {rowData.IsGeneralStateOk?traisvert:croixrouge}</p>
                        <p>Unité / Encodeur en ligne : {rowData.UnitIsOnline?traisvert:croixrouge}</p>
                        <p>Unité / Encodeur en fonctionnement : {rowData.UnitIsRunning?traisvert:croixrouge}</p>
                        <p>Caméra en ligne : {rowData.CameraIsOnline?traisvert:croixrouge}</p>
                        <p>Signal de la caméra : {rowData.CameraSignalState}</p>
                        <p>Ping journalier : {rowData.PingOk?traisvert:croixrouge}</p>
                        <p>Vu en ligne pour la dernière fois : {rowData.LastPingOk?.toString()}</p>
                    </div>
                </OverlayPanel>
            </>
            
        )
    };

    const TreeStructureTemplate = (rowdata:ICamera)=>{
        return(
            <Inplace>
                <InplaceDisplay>Clicker pour afficher les Arborescence Security Center</InplaceDisplay>
                <InplaceContent>
                    {rowdata.TreeStructures.map((treeStructure,index)=>{
                        return(
                            <>
                            {index!==0&&<Divider type="solid" />}
                            {treeStructure}
                            </>
                        )
                    })}
                </InplaceContent>
            </Inplace>
        )
    }
    return (
       <div className="table-test table">
            <DataTable
                value={prop.cameras} 
                paginator
                rows={10} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                selectionMode={prop.selectionMode}
                onSelectionChange={onSelect}
                dataKey="GuidCamera"
                selection={selectedItems}
                header={header}
                size='small'
                loading={prop.loading}
                globalFilterFields={['NameCamera', 'Archiver', 'NameUnit', 'IPAddress','ServiceName','SecurityCenterId']}
                globalFilter={globalFilterValue}
                emptyMessage="Aucune cameras trouver."
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
                 key="Ok"
                 header="Ok"
                 filterField="IsGeneralStateOk"
                 filter
                 field='IsGeneralStateOk'
                 dataType="boolean" 
                 body={IsGeneralStateOkTemplate} 
                 filterElement={booleanFilterTemplate}
            />
            <Column
                key="ServiceName"
                field="ServiceName"
                header="Nom du Service" 
                filter 
                filterPlaceholder = "Rechercher par Service"
            />
            <Column
                key="SecurityCenterId"
                field="SecurityCenterId"
                header="ID Security Center" 
                filter 
                filterPlaceholder="Rechercher par ID" 
            />
            <Column
                key="NameCamera"
                field="NameCamera"
                header="Nom Caméra" 
                filter 
                filterPlaceholder="Rechercher par Nom" 
            />
            <Column
                key="Archiver"
                field="Archiver"
                header="Archiveur" 
                filter 
                filterPlaceholder="Rechercher par Nom Archiveur" 
            />
            <Column
                key="NameUnit"
                field="NameUnit"
                header="Nom Encodeur" 
                filter 
                filterPlaceholder="Rechercher par Nom Encodeur" 
            />
            <Column
                key="IPAddress"
                field="IPAddress"
                header="Adresse IP" 
                filter 
                filterPlaceholder="Rechercher par IP" 
            />
            <Column
                 key="TreeStructures"
                 field="TreeStructures"
                 header="Arborescence Security Center" 
                 body={TreeStructureTemplate}/>
            </DataTable>
       </div>
    );
}
                 