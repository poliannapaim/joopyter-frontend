import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './views/Welcome'
import Register from './views/Register'
import Dashboard from './views/Dashboard'
import Account from './views/Account'
import Album from './views/Album'
import UpdateAlbum from './views/UpdateAlbum'
import UploadAlbum from './views/UploadAlbum'
import UpdateTracks from './views/UpdateTracks'
import UploadTracks from './views/UploadTracks'
import Security from './views/Security'
import TrashedAlbums from './views/TrashedAlbums'

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
          <Route path='/security' element={
            <ProtectedRoute>
              <Security/>
            </ProtectedRoute>
          }/>
          <Route path='/upload-album' element={ 
            <ProtectedRoute>
              <UploadAlbum/>
            </ProtectedRoute>
          }/>
          <Route path='/album/:albumId' element={
            <ProtectedRoute>
              <Album/>
            </ProtectedRoute>
          }/>
          <Route path='/album/:albumId/edit' element={
            <ProtectedRoute>
              <UpdateAlbum/>
            </ProtectedRoute>
          }/>
          <Route path='/album/:albumId/upload-tracks' element={
            <ProtectedRoute>
              <UploadTracks/>
            </ProtectedRoute>
          }/>
          <Route path='/album/:albumId/edit-tracks' element={
            <ProtectedRoute>
              <UpdateTracks/>
            </ProtectedRoute>
          }/>
          <Route path='/trashed-albums' element={
            <ProtectedRoute>
              <TrashedAlbums/>
            </ProtectedRoute>
          }/>
      </Routes>
    </>
  );
}

export default App
