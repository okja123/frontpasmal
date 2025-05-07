import { useEffect, useState } from 'react'
import './App.css'
import { IUser } from './Utils/Interfaces/IUser';
import { localelanguage } from './Utils/Local';
import { locale, addLocale } from 'primereact/api';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Components/App/Header/Header';
import { ConfigLoader } from './Utils/ConfigLoader';
import { CameraManagerApiClient } from './Utils/CameraManagerClientApi';
import Test from './Pages/Test/Test';
import Dashboard from './Pages/Dashboard/Dashboard';
import Cameras from './Pages/Cameras/Cameras';
import RequestCameraDeletes from './Pages/Deletes/RequestCameraDeletes';
import RenameCameras from './Pages/RenameCameras/RenameCameras';
import GestionDroit from './Pages/GestionDroit/GestionDroit';
import Home from './Pages/Home/Home';
import Requests from './Pages/Requests/Request';
import ImportRequest from './Pages/ImportRequest/ImportRequest';
import Licences from './Pages/Licences/Licences';
import CreationRequest from './Pages/CreateRequest/CreateRequest';

function App() {
  const [user, setUser] = useState<IUser | null>(null);
  addLocale('fr', localelanguage.fr);
  locale('fr');
  useEffect(() => {
    ConfigLoader.loadConfig()
    .then(()=>{
      Promise.all([
        CameraManagerApiClient.user_current(),
        CameraManagerApiClient.user_roles(),
        
      ])
      .then((values)=>{
        setUser(values[0]);       
        localStorage.setItem('userName', values[0].Name);
        localStorage.setItem('jwtToken', values[0].ConnexionToken.Token);
        localStorage.setItem('expiration', values[0].ConnexionToken.ExpirationDate);
        console.log( values[0].ConnexionToken.Token)
      });
    })
  }, []);
  return (
    <div className='app'>
      {
        (user === null)&&
        <>
          <div className='loading'>
            <ProgressSpinner />
          </div>
        </>
      }
      {
        (user !== null && !user.IsAuthenticated)&&
        <>
          <div className='error-message'>
            <Message severity="error" text="Accès non authorisé - Désolé, vous n'êtes pas autorisé à utiliser cette application." />
          </div>
        </>
      }
      {
        (user !== null && user.IsAuthenticated)&&
        <>
          <BrowserRouter>
            <Header user={user}/>
            <Routes>
              <Route path="/"element={<Home/>}/>
              <Route path="/dashboard"element={<Dashboard platform={localStorage.platform}/>}/>
              <Route path="/cameras"element={<Cameras platform={localStorage.platform}/>}/>
              <Route path="/request-camera-deletes"element={<RequestCameraDeletes platform={localStorage.platform}/>}/>
              <Route path="/rename-cameras"element={<RenameCameras platform={localStorage.platform}/>}/>
              <Route path="/gestion-droit"element={<GestionDroit platform={localStorage.platform}/>}/>
              <Route path="/test"element={<Test/>}/>
              <Route path="/requests"element={<Requests platform={localStorage.platform}/>}/>
              <Route path="/import-request" element={<ImportRequest platform={localStorage.platform}/>}/>
              <Route path="/licences" element={<Licences platform={localStorage.platform}/>}/>
              <Route path="/create-request" element={<CreationRequest platform={localStorage.platform}/>}/>
            </Routes>
          </BrowserRouter> 
        </>
      }
    </div>
  )
}

export default App
