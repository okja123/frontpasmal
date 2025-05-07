import BarChartCameraIntegree from '../../Components/Dashboard/BarChartCameraIntegree/BarChartCameraIntegree'
import BarChartRepartitionCamera from '../../Components/Dashboard/BarChartRepartitionCamera/BarChartRepartitionCamera'
import InfoText from '../../Components/Dashboard/InfoText/InfoText'
import './Dashboard.css'

interface IProp{
    platform : string
}
export default function Dashboard(prop:IProp){
    return(
        <div className="dashboard">
            <h2>DashBoard</h2>
            <div className='stats'>
                <InfoText platform={prop.platform}/>
            </div>
            <div className='graph'>
                <BarChartCameraIntegree platform={prop.platform}/>
                <BarChartRepartitionCamera platform={prop.platform}/>
            </div>
        </div>
    )
}