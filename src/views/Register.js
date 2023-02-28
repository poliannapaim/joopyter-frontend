import useDocumentTitle from '../components/useDocumentTitle'
import styled from 'styled-components'
import logo from '../components/images/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Main = styled.main`
    width: 100vw;
    height: 100vh;
    display: flex;
`;

const Logo = styled.div`
    width: 50vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    gap: 2vw;
    align-items: center;
    justify-content: center;

    & > img {
        width: 7vw;
    }

    & > h1 {
        color: #FED7AA;
        font-family: 'Poppins', sans-serif;
        font-size: 3.5rem;
        font-weight: 900;
    }
`;

const Container = styled.div`
    width: 50vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2vw;
`;

const RegisterForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2vw;
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
    vertical-align: top;

    &:hover {
        background-color: #FED7AA;
        color: #EA580C;
        transition-duration: 500ms;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #FED7AA;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 400;

    &:hover {
        text-decoration: underline;
    }
`;

function Register() {
    useDocumentTitle('register')

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const navigate = useNavigate()

    const handleRegister = (e) => {
        e.preventDefault()

        const url = `${process.env.REACT_APP_API_URL}/register`
        const data = JSON.stringify({
            name,
            email,
            password,
            'password_confirmation': passwordConfirmation
        })
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        }

        const register = async () => {
            const res = await fetch(url, options)
            if (!res.ok) {
                alert(`Falha ao criar a conta: ${res}`)
            }
            alert('Conta criada!')
            navigate('/');
        }
        register()
    }

    return (
        <Main>
            <Logo>
                <img src={logo} alt='Logomarca da Joopyter.'/>
                <h1>joopyter</h1>
            </Logo>

            <Container>
                <RegisterForm onSubmit={handleRegister}>
                    <Input
                        type='text'
                        name='name'
                        placeholder={'nome'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>
                    <Input
                        type='email'
                        name='email'
                        placeholder={'email'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                    <Input
                        type='password'
                        name='password'
                        placeholder={'senha'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                    <Input
                        type='password'
                        name='password_confirmation'
                        placeholder={'confirme a senha'}
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}/>

                    <Button type='submit'>{'criar conta'}</Button>
                </RegisterForm>
                <StyledLink to={'/'}>já possui uma conta? entre</StyledLink>
            </Container>
        </Main>
    )
}
  
export default Register
