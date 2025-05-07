// UserInfo.js
import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { User } from '../../utils/Interfaces';
import './UserInfo.css'

interface IProps {
    user: User
}
const UserInfo = ( {user}:IProps) => {
    const overlayPanelRef = useRef<OverlayPanel>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    isHovered;

    const stringRoles = user.RoleCodes.map((role: string) => {
        switch (role) {
            case 'ADM':
                return 'Administrateur';
            case 'DEM':
                return 'Demandeur';
            case 'INT':
                return 'Intégrateur';
            case 'LIC':
                return 'Licence';
            case 'ADUO':
                return 'Administrateur UO';
            case 'READ':
                return 'Lecteur';
            default:
                return '';
        }
    });

    const popoverContent = (
        <>
            <p>
                <strong>Rôle(s) : </strong> {stringRoles.join(', ')}
            </p>
            <p>
                <strong>Plateforme(s) :</strong> {user.SiteCodes.join(', ')}
            </p>
        </>
    );

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsHovered(true);
        if (!isOpen) {
            overlayPanelRef.current?.show(e, null);
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsHovered(false);
        e;
        if (!isOpen) {
            overlayPanelRef.current?.hide();
        }
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsOpen(!isOpen);
        if (isOpen) {
            overlayPanelRef.current?.hide();
        } else {
            overlayPanelRef.current?.show(e, null);
        }
    };

    return (
        <>
            <Button
                type="button"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleButtonClick}
                label={user?.Name || 'Username non récupéré'}
                style={{ backgroundColor: "transparent" }}
                className='userinfo-button'
            />
            <OverlayPanel ref={overlayPanelRef}>
                <div style={{ borderBottom: "1px solid grey" ,margin:"15px"}}>
                    <strong style={{ fontSize: "22px" }}>{user.Name || 'Username non récupéré'}</strong>
                    <h3 style={{ borderTop: "1px solid grey" }}>Droits sur cette application</h3>
                    {popoverContent}
                </div>
            </OverlayPanel>
        </>
    );
};
export default UserInfo;
