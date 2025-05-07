import { Button } from "primereact/button";
import PlatformSelect from "../PlatformSelect/PlatformSelect";
import UserInfo from "../UserInfo/UserInfo";
import './Header.css'
import { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { useNavigate } from "react-router";
import { MenuItem } from 'primereact/menuitem';
import { PrimeIcons } from "primereact/api";
import { IUser } from "../../../Utils/Interfaces/IUser";
import { PATH } from "../../../Utils/Constants";

interface IProps {
    user: IUser
}

export default function Header({user}:IProps){
    const op = useRef<OverlayPanel>(null);
    const [menuItem, setMenuItem] = useState<MenuItem>({label:"Accueil",icon:"pi pi-home"});
    const navigate = useNavigate();
    return (
        <div className="header">
            {/*<img className='logo-adp' src = {PATH.IMAGE+"/ADPLogo.svg"} alt="" />*/}
            <img className='logo-camera-manager' src = {PATH.IMAGE+"/CameraManagerLogo.svg"} alt="" />
            <Button className="page-select" type="button" icon={menuItem.icon} label={menuItem.label} onClick={(e) => op.current?.toggle(e)} />
            <OverlayPanel ref={op} className="menu-item-container">
                <Button className="menu-item" label="Accueil" icon="pi pi-home" onClick={()=>{
                    setMenuItem({label:"Accueil",icon:"pi pi-home"});
                    op.current?.hide()
                    navigate("/")
                }}/>
                <Button className="menu-item" label="Dashboard" icon={PrimeIcons.CHART_BAR} onClick={()=>{
                    setMenuItem({label:"Dashboard",icon:PrimeIcons.CHART_BAR});
                    op.current?.hide()
                    navigate("/dashboard")
                }}/>
                <Button className="menu-item" label="Caméras Security Center" icon="pi pi-fw pi-video" onClick={()=>{
                    setMenuItem({label:"Caméras Security Center",icon:"pi pi-fw pi-video"});
                    op.current?.hide()
                    navigate("/cameras")
                }}/>
                <Button className="menu-item" label="Demandes d'intégration" icon="pi pi-fw pi-calendar" onClick={()=>{
                    setMenuItem({label:"Demandes d'intégration",icon:"pi pi-calendar"});
                    op.current?.hide()
                    navigate("/requests")
                }}/>
                <Button visible = {user.RoleCodes.includes('ADM')||user.RoleCodes.includes('READ')||user.RoleCodes.includes('ADUO')} className="menu-item" label="Demandes de suppression" icon="pi pi-fw pi-trash" onClick={()=>{
                    setMenuItem({label:"Demandes de suppression",icon:"pi pi-trash"});
                    op.current?.hide()
                    navigate("/request-camera-deletes")
                }}/>
                <Button visible = {user.RoleCodes.includes('ADM')||user.RoleCodes.includes('LIC')||user.RoleCodes.includes('ADUO')} className="menu-item" label="Licences" icon="pi pi-fw pi-receipt" onClick={()=>{
                    setMenuItem({label:"Licences",icon:"pi pi-receipt"});
                    op.current?.hide()
                    navigate("/licences")
                }}/>
                <Button visible = {user.RoleCodes.includes('ADM')} className="menu-item" label="Demandes de renommage" icon="pi pi-fw pi-cog" onClick={()=>{
                    setMenuItem({label:"Demandes de renommage",icon:"pi pi-cog"});
                    op.current?.hide()
                    navigate("/rename-cameras")
                }}/>
                <Button visible = {user.RoleCodes.includes('ADM')} className="menu-item" label="Gestion des droits" icon="pi pi-fw pi-hammer" onClick={()=>{
                    setMenuItem({label:"Gestion des droits",icon:"pi pi-hammer"});
                    op.current?.hide()
                    navigate("/gestion-droit")
                }}/>
                
            </OverlayPanel>
            <div style={{margin:"auto"}}></div>
            <PlatformSelect></PlatformSelect>
            <UserInfo user={user}></UserInfo>
        </div>
    )
}