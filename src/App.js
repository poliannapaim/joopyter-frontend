import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './views/Welcome'
import ForgotPassword from './views/ForgotPassword'
import Register from './views/Register'
import Dashboard from './views/Dashboard'
import Account from './views/Account'
import Album from './views/Album'
import UpdateAlbum from './views/UpdateAlbum'
import UploadAlbum from './views/UploadAlbum'
import UpdateTracks from './views/UpdateTracks'
import UploadTracks from './views/UploadTracks'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    return children
  }
  return <Navigate to='/' replace/>
}

const ForcePublicRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token')
  if (!token) {
    return children
  }
  return <Navigate to='/dashboard' replace/>
}

function App() {
  return (
    <>
      <Routes>
          <Route exact path='/' element={
            <ForcePublicRoute>
              <Welcome/>
            </ForcePublicRoute>
          }/>
          <Route path='/forgot-password' element={   
            <ForcePublicRoute>
              <ForgotPassword/>
            </ForcePublicRoute>
          }/>
          <Route path='/register' element={ 
            <ForcePublicRoute>
              <Register/>
            </ForcePublicRoute>
          }/>
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }/>
          <Route path='/account' element={
            <ProtectedRoute>
              <Account/>
            </ProtectedRoute>
          }/>
          <Route path='/album/:id' element={
            <ProtectedRoute>
              <Album/>
            </ProtectedRoute>
          }/>
          <Route path='/album/edit/:id' element={
            <ProtectedRoute>
              <UpdateAlbum/>
            </ProtectedRoute>
          }/>
          <Route path='/upload-album' element={ 
            <ProtectedRoute>
              <UploadAlbum/>
            </ProtectedRoute>
          }/>
          <Route path='/album/edit-tracks/:id' element={
            <ProtectedRoute>
              <UpdateTracks/>
            </ProtectedRoute>
          }/>
          <Route path='/album/:id/upload-tracks/' element={
            <ProtectedRoute>
              <UploadTracks/>
            </ProtectedRoute>
          }/>
          {/* <Route path='/album/:id' element={ <UploadAlbum /> }/> */}
      </Routes>
    </>
  );
}

export default App
