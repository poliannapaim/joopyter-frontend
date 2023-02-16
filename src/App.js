import './App.css'
import { Routes, Route } from 'react-router-dom'
import Welcome from './views/Welcome'
import ForgotPassword from './views/ForgotPassword'
import Register from './views/Register'
import Dashboard from './views/Dashboard'
import Account from './views/Account'
import Album from './views/Album'
import UpdateAlbum from './views/UpdateAlbum'
import UploadAlbum from './views/UploadAlbum'
import UpdateTracks from './views/UpdateTracks'

function App() {
  return (
    <>
      <Routes>
          <Route exact path='/' element={ <Welcome/> }/>
          <Route path='/forgot-password' element={ <ForgotPassword/> }/>
          <Route path='/register' element={ <Register/> }/>
          <Route path='/dashboard' element={ <Dashboard/> }/>
          <Route path='/account' element={ <Account/> }/>
          <Route path='/album/:id' element={ <Album/> }/>
          <Route path='/album/edit/:id' element={ <UpdateAlbum/> }/>
          <Route path='/upload-album' element={ <UploadAlbum/> }/>
          <Route path='/album/edit-tracks/:id' element={ <UpdateTracks/> }/>
          {/* <Route path='/album/:id' element={ <UploadAlbum /> }/> */}
      </Routes>
    </>
  );
}

export default App
