import useDocumentTitle from '../components/useDocumentTitle'
import NavBar from '../components/navBar'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import profile from '../components/images/profile.svg'
import InputMask from 'react-input-mask'
import ShapeBottom from '../components/shapeBottom'

const Main = styled.main`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    padding: 1vw 5vw;
    margin-top: 3vw;
`;

const Data = styled.div`
    display: flex;
    flex-direction: row;
    gap: 3vw;
`;

const H3 = styled.h3`
    color: #FED7AA;
    font-family: 'Poppins', sans-serif;
    font-size: 2.5rem;
    font-weight: 900;
`;

const FormProfilePic = styled.form`
    display: inline-block;
    position: relative;
    height: 8vw;
    border-radius: 50%;
    border: 5px solid transparent;

    &:hover {
        border: 5px solid #292524;
        cursor: pointer;
    }
`;

const ProfilePic = styled.img`
    width: 8vw;
    height: 8vw;
    border-radius: 50%;
    object-fit: cover;
`;

const InputFile = styled.input`
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;

    &:hover {
        border: 5px solid #292524;
        cursor: pointer;
    }
`;

const FormAccountUpdate = styled.form`
    margin-top: 2vw;
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

const InputDob = styled(InputMask)`
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

const InputBio = styled.textarea`
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

    &:hover {
        background-color: #FED7AA;
        color: #EA580C;
        transition-duration: 500ms;
    }
`;

export default function Account() {
    useDocumentTitle('atualizar conta')

    const [token] = useState(localStorage.getItem('auth_token'))
    const [user, setUser] = useState(null)
    const [newProfilePic, setNewProfilePic] = useState(null)
    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newDob, setNewDob] = useState('')
    const [newBio, setNewBio] = useState('')
    
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
    
    let dob = ''
    if (user.dob) {
        const [year, month, day] =  user.dob.split('-')
        dob = `${day}/${month}/${year}`
    }

    function HandleProfilePic(e) {
        e.preventDefault()
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            const base64_profile_pic = reader.result
            const profilePic = JSON.stringify({
                'base64_profile_pic': base64_profile_pic
            })
            const url = `${process.env.REACT_APP_API_URL}/account/update-profile-pic`
            const options = {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: profilePic
            }
            const updatePic = async () => {
                try {
                    const res = await fetch(url, options)
                    const json = await res.json()
            
                    if (!res.ok) {
                        return alert(`Falha ao atualizar a foto de perfil: ${res}`)
                    }
                    setNewProfilePic(json.data['profile_pic'])
                }
                catch (error) {
                    console.error(`Erro ao atualizar a foto de perfil: ${error}`)
                }
            }
            updatePic()
        }
    }

    const handleAccountUpdate = (e) => {
        e.preventDefault()
        let dobFormated = user.dob
        if (newDob) {
            const [day, month, year] =  newDob.split('/')
            dobFormated = `${year}-${month}-${day}`
        }
        const url = `${process.env.REACT_APP_API_URL}/account/update`
        const data = JSON.stringify({
            name: newName ? newName : user.name,
            email: newEmail ? newEmail : user.email,
            dob: dobFormated,
            bio: newBio ? newBio : user.bio,
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
        const updateAccount = async () => {
            try {
                const res = await fetch(url, options)
                if (!res.ok) {
                    return alert('Falha ao atualizar os dados da conta.', res)
                }
                alert('Os dados da conta foram atualizados.')
            }
            catch (error) {
                console.error(`Erro ao buscar os dados da conta: ${error}`)
            }
        }
        updateAccount()
    }
    
    return (
        <Main>
            <NavBar/>

            <Container>
                <H3>atualizar conta</H3>
                <Data>
                    <FormProfilePic>
                        <ProfilePic
                            src={newProfilePic ?
                                `${process.env.REACT_APP_STORAGE_URL}/${newProfilePic}` :
                                (user.profile_pic ?
                                    `${process.env.REACT_APP_STORAGE_URL}/${user.profile_pic}` : profile
                                )}/>
                        <InputFile type='file' name='profilePic' id='file' title='Editar foto de perfil.' accept='.jpeg, .png, .jpg' onChange={(e) => HandleProfilePic(e)}/>
                    </FormProfilePic>
                    <FormAccountUpdate onSubmit={handleAccountUpdate}>
                        <Input
                            type='text'
                            name='name'
                            placeholder={user.name}
                            value={newName || user.name}
                            onChange={(e) => setNewName(e.target.value)}/>
                        <Input
                            type='email'
                            name='email'
                            placeholder={user.email}
                            value={newEmail || user.email}
                            onChange={(e) => setNewEmail(e.target.value)}/>
                        <InputDob
                            type='dob'
                            name='dob'
                            mask='99/99/9999'
                            placeholder={dob ? dob : 'data de nascimento'}
                            value={dob !== null ? (newDob || dob) : null}
                            onChange={(e) => setNewDob(e.target.value)}/>
                        <InputBio
                            type='bio'
                            name='bio'
                            placeholder={user.bio ? user.bio : 'bio'}
                            value={newBio || user.bio}
                            onChange={(e) => setNewBio(e.target.value)}/>
                        <Button type='submit'>salvar</Button>
                    </FormAccountUpdate>
                </Data>
            </Container>
            <ShapeBottom/>
        </Main>
    )
}
