import { useEffect, useRef, useState } from "react";
import IUserGroup from "../../Utils/Interfaces/IUserGroup";
import { Toast } from "primereact/toast";
import { CameraManagerApiClient } from "../../Utils/CameraManagerClientApi";
import TableUserGroup from "../../Components/Table/TableUserGroup/TableUserGroup";
import { Dialog } from "primereact/dialog";
import FormUserGroup from "../../Components/Form/FormUserGroup/FormUserGroup";
import { ColumnBodyOptions } from "primereact/column";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";

interface IProp{
    platform : string
}
export default function GestionDroit(prop:IProp){
    const [UserGroups, setUserGroups] = useState<IUserGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [formvisible, setformVisible] = useState(false);
    const [userGroupSelected, setUserGroupSelected] = useState<IUserGroup|null>(null);
    const toast = useRef<Toast>(null);
    useEffect(() => {
        if(userGroupSelected===null||!userGroupSelected.asChanged){
            return
        }
        if(userGroupSelected.isNew){
            CameraManagerApiClient.userGroup_post(userGroupSelected)
            .then((result)=>{
                if(result){
                    toast.current?.show({ severity: 'info', summary: 'Confirmation', detail: 'Groupe crée', life: 3000 });
                }
                else{
                    toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la creation', life: 3000 });
                }
                loadData()
            })
        }
        else{
            console.log(userGroupSelected)
            CameraManagerApiClient.userGroup_put(userGroupSelected.Name,userGroupSelected)
            .then((result)=>{
                if(result){
                    toast.current?.show({ severity: 'info', summary: 'Confirmation', detail: 'Groupe modifier', life: 3000 });
                }
                else{
                    toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la modification', life: 3000 });
                }
                loadData()
            })
        }
    }, [userGroupSelected]);
    useEffect(() => {
        loadData()
    }, []);
    function loadData(){
        setLoading(true)
        CameraManagerApiClient.userGroup_getAll()
        .then(userGroups=>{
            setUserGroups(userGroups)
            setLoading(false)
        }); 
    }
    function formTemplate(){
        let hide = ()=>{
            setformVisible(false)
        }
        return(
            <FormUserGroup hide={hide} item={userGroupSelected} setitem={setUserGroupSelected}></FormUserGroup>
        )
    }
    function edit(userGroup:IUserGroup,option:ColumnBodyOptions|undefined){
        setUserGroupSelected(userGroup)
        setformVisible(true)
    }
    function add(){
        setUserGroupSelected(null)
        setformVisible(true)
    }
    function deleteitem(userGroup: IUserGroup){
        CameraManagerApiClient.userGroup_delete(userGroup.Name)
        .then(result=>{
            if(!result){
                toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppression', life: 3000 });
                return;
            }
            toast.current?.show({ severity: 'info', summary: 'Confirmation', detail: 'Groupe supprimer', life: 3000 });
            loadData()
        })
    }
    return(
        <div className='request-camera-deletes'>
            <Toast ref={toast} />
            <ConfirmPopup />
            <Dialog
                visible={formvisible}
                modal
                onHide={() => {if (!formvisible) return; setformVisible(false); }}
                content={formTemplate}
            />
            <TableUserGroup 
                userGroups={UserGroups} 
                selectionMode={undefined} 
                loading={false}
                onEdit={edit}
                onAdd={add}
                onDelete={deleteitem}
            />
        </div>
    )
}