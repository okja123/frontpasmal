import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { CameraManagerApiClient } from "../../../Utils/CameraManagerClientApi";
import './BarChartRepartitionCamera.css'
interface IProp{
    platform:string;
}
export default function BarChartRepartitionCamera(prop:IProp){
    const [Data, setData] = useState({});
    const options = {
        scales: {
            x: {
                ticks: {
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0,
                },
            },
            y: {
                beginAtZero: true,
            },
            },
    };
    useEffect(() => {
        CameraManagerApiClient.site_getArchivers(prop.platform)
        .then((archivers)=>{
            console.log(archivers);
            let filterdArchivers = archivers.filter(archiver => archiver.NumberOfCamera < 100 || archiver.NumberOfCamera > 300);
            console.log(filterdArchivers);
            let data = {
                labels: filterdArchivers.map(archiver => archiver.Name),
                datasets: [
                  {
                    label: 'Nombre de caméras',
                    data: filterdArchivers.map(archiver => archiver.NumberOfCamera),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    type: 'bar',
                  },
                  {
                    label: 'Limite archiveur sur utilisé',
                    data: filterdArchivers.map(() => 300),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    type: 'line',
                  },
                  {
                    label: 'Limite archiveur sous utilisé',
                    data: filterdArchivers.map(() => 100),
                    backgroundColor: 'rgba(25, 52, 172, 0.2)',
                    borderColor: 'rgb(76, 140, 223)',
                    borderWidth: 1,
                    type: 'line',
                  },
                ],
              };
            setData(data);
        })
    },[]);
    return(
        <div className="barchart-repartition-camera">
            <h2>Répartition des caméras sur Archiveurs sur/sous utilisé {prop.platform}</h2>
            <Chart type="bar" data={Data} options={options} />
        </div>
    )
}