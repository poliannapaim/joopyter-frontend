import NavBar from '../components/navBar'
import useDocumentTitle from '../components/useDocumentTitle'
import styled from 'styled-components'
import ShapeBottomAbsolute from '../components/shapeBottomAbsolute'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Main = styled.main`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    width: 23vw;
    padding: 1vw 5vw;
    margin-top: 3vw;
    display: flex;
    flex-direction: column;
    align-items: stretch;
`;

const H3 = styled.h3`
    color: #FED7AA;
    font-family: 'Poppins', sans-serif;
    font-size: 2.5rem;
    font-weight: 900;
`;

const FormSecurityUpdate = styled.form`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 2vw;
    margin-left: 3vw;
    width: 18vw;
`;

const Input = styled.input`
    background-color: #1C1917;
    width: 18vw;
    padding: 0.8vw;
    border: 0px;
    border-bottom: 1px solid #57534E;
    color: #E7E5E4;
    font-family: 'Poppins', sans-serif;
    font-size: 1.2rem;
    font-weight: 400;

    &:focus {
       outline: none;
       border-bottom: 1px solid #FED7AA;
    }
`;

const Button = styled.button`
    width: auto;
    padding: 1vw 1.5vw;
    background-color: #14B8A6;
    cursor: pointer;
    border: 0;
    border-radius: 0.5vw;
    color: #E7E5E4;
    font-family: 'Poppins', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    align-self: center;
    margin-bottom: 3vw;

    &:hover {
        background-color: #FED7AA;
        color: #EA580C;
        transition-duration: 500ms;
    }
`;

const ButtonDelete = styled.button`
    align-self: flex-end;
    background-color: transparent;
    width: auto;
    color: #DC2626;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    border: 0;
    
    &:hover {
        text-decoration: underline;
    }
`;


export default function Security() {
    useDocumentTitle('segurança')
    
    const [token] = useState(localStorage.getItem('auth_token'))
    const [user, setUser] = useState(null)
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            setUser(null)
            return
        }
        const reqUser = async () => {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            const json = await res.json()
            if (!res.ok) {
                return alert('Falha ao buscar os dados da conta.')
            }
            setUser(json)
        }
        reqUser()
    }, [token])

    if (!user) {
        return <></>
    }

    const handlePasswordUpdate = (e) => {
        e.preventDefault()
        const url = `${process.env.REACT_APP_API_URL}/account/update-password`
        const data = JSON.stringify({
            old_password: oldPassword,
            password,
            password_confirmation: passwordConfirmation
        })
        const options = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: data
        }
        const updatePassword = async () => {
            try {
                const res = await fetch(url, options)
                if (!res.ok) {
                    return alert('Falha ao alterar a senha.', res)
                }
                alert('A senha foi alterada.')
            }
            catch (error) {
                console.error(`Erro ao alterar a senha: ${error}`)
            }
        }
        updatePassword()
    }

    const handleAccountDelete = (e) => {
        e.preventDefault()
        if (window.confirm('Tem certeza que deseja excluir a sua conta?') === true) {
            const url = `${process.env.REACT_APP_API_URL}/account/delete`
            const options = {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const deleteAccount = async () => {
                try {
                    const res = await fetch(url, options)
                    if (!res.ok) {
                        return alert(`Falha ao deletar a conta: ${res}`)
                    }
                    alert('A conta foi deletada.')
                    navigate('/')
                }
                catch (error) {
                    console.error(`Erro ao deletar a conta: ${error}`)
                }
            }
            deleteAccount()
        }
    }

    return (
        <Main>
            <NavBar/>
            
            <Container>
                <H3>alterar senha</H3>
                
                <FormSecurityUpdate onSubmit={handlePasswordUpdate}>
                        <Input
                            type='password'
                            name='old_password'
                            placeholder={'senha antiga'}
                            value={oldPassword || ''}
                            onChange={(e) => setOldPassword(e.target.value)}/>
                        <Input
                            type='password'
                            name='password'
                            placeholder={'nova senha'}
                            value={password || ''}
                            onChange={(e) => setPassword(e.target.value)}/>
                        <Input
                            type='password'
                            name='password_confirmation'
                            placeholder={'confirmar nova senha'}
                            value={passwordConfirmation || ''}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}/>
                        <Button type='submit'>salvar</Button>
                    </FormSecurityUpdate>
                    <ButtonDelete type='button' onClick={handleAccountDelete}>excluir conta</ButtonDelete>
            </Container>
            <ShapeBottomAbsolute/>
        </Main>
    )
}