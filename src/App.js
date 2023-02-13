import './App.css';
import { Routes, Route } from 'react-router-dom';
import Welcome from './views/Authentication/Welcome';
import ForgotPassword from './views/Authentication/ForgotPassword';
import Register from './views/Authentication/Register'
import Dashboard from './views/Authentication/Dashboard'

function App() {
  return (
    <>
      <Routes>
          <Route exact path='/' element={ <Welcome /> }/>
          <Route path='/forgot-password' element={ <ForgotPassword /> }/>
          <Route path='/register' element={ <Register /> }/>
          <Route path='/dashboard' element={ <Dashboard /> }/>
      </Routes>
    </>
  );
}

export default App;
