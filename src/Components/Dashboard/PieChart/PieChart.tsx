import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { CameraManagerApiClient } from '../../../utils/CameraManagerClientApi';
interface IProp{
    platform:string;
}
export default function PieChart(prop:IProp) {
    const [chartData, setChartData] = useState({});
    const options = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true
                }
            }
        }
    };

    useEffect(() => {
        Promise.all([
            CameraManagerApiClient.site_nbrCameraOK(prop.platform),
            CameraManagerApiClient.site_nbrCameraKO(prop.platform),
        ])
        .then((values)=>{
            const documentStyle = getComputedStyle(document.documentElement);
            const data = {
                labels: ['Caméras OK', 'Caméras KO'],
                datasets: [
                    {
                        data: [values[0], values[1]],
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-500'), 
                            documentStyle.getPropertyValue('--yellow-500'), 
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--blue-400'), 
                            documentStyle.getPropertyValue('--yellow-400'), 
                        ]
                    }
                ]
            }
            
            setChartData(data);
        })
        
    }, []);

    return (
        <div className="card flex justify-content-center">
            <Chart type="pie" data={chartData} options={options} className="w-full md:w-30rem" />
        </div>
    )
}