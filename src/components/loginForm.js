import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Form() {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()

        const url = `${process.env.REACT_APP_API_URL}/login`
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
                    return alert('Falha ao autenticar email e senha.', res)
                }
                const token = json['token']
                localStorage.setItem('auth_token', token)
                navigate('/dashboard')
            }
            catch (err) {
                console.error('error', err)
            }
        }
        makeRequest()
    }

  return (
    <form className='form' onSubmit={handleLogin}>
        <input className='input' type='email' placeholder='email' name='email' value={email || ''} onChange={(e) => setEmail(e.target.value)}/>
        <input className='input' type='password' placeholder='senha' name='password' value={password || ''} onChange={(e) => setPassword(e.target.value)}/>

        <button className='button' type='submit'>entrar</button>
    </form>
  )
}
 