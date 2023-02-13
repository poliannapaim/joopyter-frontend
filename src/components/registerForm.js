import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Form(props) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()

        const url = 'http://127.0.0.1:8000/api/v1/login'
        const user = JSON.stringify({
            email,
            password
        })
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: user
        };

        const makeRequest = async () => {
            localStorage.removeItem('auth_token')
            try {
                const res = await fetch(url, options)
                const json = await res.json()
                if (!res.ok) {
                    return alert('Falha na requisição.')
                }
                const token = json['token']
                localStorage.setItem('auth_token', token)
                console.log('redirecionando', token)
                navigate('/dashboard')
            }
            catch (err) {
                console.error("error", err)
            }
        }
        makeRequest()
    }

  return (
    <form className="form" onSubmit={ handleLogin }>
        <input className="input" type="email" placeholder="email" name="email" value={ email } onChange={ (e) => setEmail(e.target.value) }/>
        
        <input className="input" type="password" placeholder="password" name="password" value={ password } onChange={ (e) => setPassword(e.target.value) }/>

        <button type="submit">
            login
        </button>
    </form>
  );
}
