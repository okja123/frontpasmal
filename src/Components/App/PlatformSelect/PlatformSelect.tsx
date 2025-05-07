import { useState ,useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import "./platformSelect.css"
import { Toast } from 'primereact/toast';


const PlatformSelect = () => {
    const [platform, setPlatform] = useState('');
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState('');
    const toast = useRef(null);

    const platforms = [
        { label: 'CDG', value: 'CDG' },
        { label: 'ORY', value: 'ORY' },
        { label: 'LBG', value: 'LBG' }
    ];

    const handlePlatformSelect = () => {
        if (platform) {
            localStorage.setItem('platform', platform);
            toast.current.show({severity:'success', summary: 'Success', detail:"Plateforme " + platform + " sélectionnée", life: 3000});
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            setError('Veuillez sélectionner une plateforme');
        }
    };

    return (
        <div className='PlatformSelect'>
            <Toast ref={toast} />
            <Dialog header={"Sélectionnez une plateforme"} visible={visible || localStorage.platform === undefined} modal onHide={() => setVisible(false)}>
                <div className="p-grid" style={{alignContent: "center", justifyContent: "center", alignItems: "center"}}>
                    <div className="p-col-12">
                        <Dropdown value={platform} options={platforms} onChange={(e) => setPlatform(e.value)} placeholder="Sélectionnez une plateforme" />
                    </div>
                    <div className="p-col-12" style={{marginTop: "20px"}}>
                        <Button label="Valider" onClick={handlePlatformSelect} />
                    </div>
                    <div className="p-col-12">
                        {error && <Message severity="error" text={error} />}
                    </div>
                </div>
            </Dialog>
            <Button prefix='pi pi-cog' className = "platform-select-button" label={localStorage.platform == '' || localStorage.platform == undefined ? "⚙ Sélectionnez une plateforme": "⚙ " + localStorage.platform} onClick={() => setVisible(true)} />
        </div>
    );
};

export default PlatformSelect;