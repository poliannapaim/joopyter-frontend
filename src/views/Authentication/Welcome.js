import logo from '../../components/images/logo.svg'
import useDocumentTitle from '../../components/useDocumentTitle'
import { Link } from 'react-router-dom'

import Form from '../../components/loginForm'

export default function Welcome() {
    useDocumentTitle('joopyter')

    return (
        <div className='container'>
            <div className='logo'>
                <img src={ logo } className='logo-img' alt='logo' />
                <h1 className='logo-name'>joopyter</h1>
            </div>

            <main className='main'>
                <nav className='about'>
                    <ul>
                        <li>
                            <Link to='/about' className='nav-link'>what is joopyter?</Link>
                        </li>
                    </ul>
                </nav>
	

                <div className="login">
                    <Form />
                    
                    <div>
                        <ul className='auth-links'>
                            <li>
                                <Link to='/forgot-password' className='auth-link'>forgot your password?</Link>
                            </li>
                            <li>
                                <Link to='/register' className='auth-link'>new here? create an account</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='motif'>
                    <h4>a space for storytellers to be true to their soul.</h4>
                    <h3>share your art.</h3>
                </div>
            </main>
        </div>
    )
}
