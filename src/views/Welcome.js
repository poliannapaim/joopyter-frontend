import logo from '../components/images/logo.svg'
import useDocumentTitle from '../components/useDocumentTitle'
import { Link } from 'react-router-dom'

import Form from '../components/loginForm'

export default function Welcome() {
    useDocumentTitle('joopyter')

    return (
        <div className='container'>
            <div className='logo'>
                <img src={logo} className='logo-img' alt='logo'/>
                <h1 className='logo-name'>joopyter</h1>
            </div>

            <main className='main'>
                <div className="login">
                    <Form/>
                    
                    <div>
                        <ul className='auth-links'>
                            <li>
                                <Link to='/register' className='auth-link'>crie uma conta</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='motif'>
                    <h4>um espaço para contadores de histórias.</h4>
                    <h3>compartilhe a sua arte.</h3>
                </div>
            </main>
        </div>
    )
}
