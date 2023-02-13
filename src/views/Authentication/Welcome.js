import logo from '../../logo.svg';
import useDocumentTitle from '../../components/useDocumentTitle';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Form from '../../components/registerForm'

function Welcome() {

    useDocumentTitle('joopyter');

    // const [token, setToken] = useState("");
    
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         email: "",
    //         password: "",
    //     };
    // }

    // useEffect(() => {
    //     const url = "http://127.0.0.1:8000/api/v1/login";

    //     const options = {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify ({
    //             email: email.value,
    //             password: password.value
    //         })
    //     }

    //     const fetchData = (async () => {
    //         try {
    //             const res = await fetch(url, options);
    //             const json = await res.json();
    //             setToken(json.slip.token);
    //         }
    //         catch (err) {
    //             console.log("error", err);
    //         }
    //     })();
    // }, []);

    return (
        <div className="container">
            <div className="logo">
                <img src={ logo } className="logo-img" alt="logo" />

                <h1 className="logo-name">joopyter</h1>
            </div>

            <main>
                <nav>
                    <ul>
                        <li>
                            <Link to="/about" className="nav-link">what is joopyter?</Link>
                        </li>
                    </ul>
                </nav>
	

                <div className="login">
                    <Form />
                    
                    <div>
                        <ul className="auth-links">
                            <li>
                                <Link to="/forgot-password" className="auth-link">forgot your password?</Link>
                            </li>
                            <li>
                                <Link to="/register" className="auth-link">new here? create an account</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="motif">
                    <h4>a space for storytellers to be true to their soul.</h4>
                    <h3>share your art.</h3>
                </div>
            </main>
        </div>
    );
}
  
export default Welcome;
