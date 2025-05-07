import { PATH } from '../../Utils/Constants';
import './Home.css'
import { Image } from 'primereact/image';

export default function Home(){
    return (
      <div className='home' style={{width:'100%'}}>
        <h2>Bienvenue sur Camera Manager !</h2>
        <h3>Workflow d'intégration d'une caméra de vidéosurveillance :</h3>
        <Image alt="workflow" src={PATH.IMAGE+"/workflowIntegrationCamera.png"} preview={false} width='100%'/>
      </div>
    )
  }
  