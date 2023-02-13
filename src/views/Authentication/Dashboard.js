import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
    const [token, setToken] = useState(localStorage.getItem('auth_token'))
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    
    useEffect(() => {
        if (!token) {
            setUser(null)
            return
        }
        const makeRequest = async () => {
            const res = await fetch('http://127.0.0.1:8000/api/v1/user', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            const json = await res.json()
            if (!res.ok) {
                return alert('falha ao buscar usuário.')
            }
            setUser(json)
        }
        makeRequest()
    }, [token])

    const handleLogout = () => {
        localStorage.removeItem('auth-token')
        setToken(null)
        navigate('/')
    }

    if (!user) {
        return <h1>usuário não logado</h1>
    }

    return (
        <div>
            <h1>nome: {user.name}</h1>
            <h1>email: {user.email}</h1>
            <h1>aniversário: {user.dob}</h1>
            {user.profile_pic ? (
                <img src={`http://127.0.0.1:8000/storage/${user.profile_pic}`} width="150px" height="auto" alt="" />
            ) : (
                <h1>sem foto de perfil</h1>
            )}
            <div>
                <button type="button" onClick={handleLogout}>sair</button>
            </div>
        </div>
    )
}