import { IConfiguration } from "./Interfaces/Iconfig";

export class ConfigLoader{
    public static loadConfig() {
        return fetch("./config.json")
        .then(response => response.json())
        .then((data:IConfiguration) =>{
            localStorage.setItem("BaseURL",data.baseURL)
        })
        /*
        .then(()=>CameraManagerApiClient.token_get())
        .then(response => response.json())
        .then((data:string)=>{
            localStorage.setItem("jwtToken",data)
        })
        */
        .catch(error => {
            console.error('Error:', error)
            throw error;
        });
    }
}