import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { CameraManagerApiClient } from "../../../Utils/CameraManagerClientApi";
import "./BarChartCameraIntegree.css"

interface IProp{
    platform : string
}
export default function BarChartCameraIntegree(prop : IProp){
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
        let cameraIntegrees : number[]  = []
        let licenceRestantes : number[] = []
        let licences : number[] = []
        CameraManagerApiClient.site_getServices(prop.platform)
        .then((services)=>{
            let servicesdatapromise:Promise<number>[] = []
            services.forEach(async service => {
                servicesdatapromise.push(CameraManagerApiClient.service_nbrCamera(service.Code))
                servicesdatapromise.push(CameraManagerApiClient.service_nbrLicence(service.Code))
            });
            Promise.all(servicesdatapromise)
            .then((values)=>{
                for( let i =0 ; i<values.length ;i++){
                    if(i%2==0){
                        cameraIntegrees.push(values[i])
                        continue;
                    }
                    licences.push(values[i])
                    licenceRestantes.push(values[i]-values[i-1])
                }
                let data = {
                    labels: services.map(service => service.Name),
                    datasets: [
                        {
                          label: 'Caméras intégrées',
                          data: cameraIntegrees,
                          backgroundColor: 'rgba(75, 192, 192, 0.2)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1,
                        },
                        {
                          label: 'Licences',
                          data: licences,
                          backgroundColor: 'rgba(255, 99, 132, 0.2)',
                          borderColor: 'rgba(255, 99, 132, 1)',
                          borderWidth: 1,
                        },
                        {
                          label: "Licences Restantes",
                          data: licenceRestantes,
                          backgroundColor: 'rgba(0, 0, 0)',
                          borderColor: 'rgba(255, 206, 86, 1)',
                          borderWidth: 1,
                        }
                      ],
                }
                setData(data)
            })
        });
    },[]);
    return(
        <div className="bar-chart-camera-integree">
            <h2>Caméras intégrées et licences par UO</h2>
            <Chart type="bar" data={Data} options={options} />
        </div>
    );
}