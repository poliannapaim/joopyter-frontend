import useDocumentTitle from '../components/useDocumentTitle'
import NavBar from '../components/navBar'
import styled from 'styled-components'
import ShapeBottom from '../components/shapeBottom'
import { useEffect, useState } from 'react'
import InputMask from 'react-input-mask'

const Main = styled.main`
    width: 100vw;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    padding: 1vw 5vw;
    margin-top: 3vw;
`;

const H3 = styled.h3`
    color: #FED7AA;
    font-family: 'Poppins', sans-serif;
    font-size: 2.5rem;
    font-weight: 900;
`;

const Data = styled.div`
    display: flex;
    flex-direction: row;
    gap: 3vw;
`;

const FormCoverPic = styled.form`
    display: inline-block;
    position: relative;
`;

const CoverPic = styled.img`
    width: 8vw;
    height: 8vw;
    border-radius: 8%;
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

const FormAlbumUpdate = styled.form`
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

const InputReleaseDate = styled(InputMask)`
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
    width: 8vw;
    background-color: #14B8A6;
    padding: 0.8vw;
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

export default function UpdateAlbum() {
    useDocumentTitle('edit your album')

    const id = (window.location).href.split('/').pop()
    const [token] = useState(localStorage.getItem('auth_token'))
    const [album, setAlbum] = useState(null)
    const [newCoverPic, setNewCoverPic] = useState(null)
    const [newTitle, setNewTitle] = useState('')
    const [newReleaseDate, setNewReleaseDate] = useState('')

    useEffect(() => {
        const reqAlbum = async () => {
            const res = await fetch(`http://127.0.0.1:8000/api/v2/albums/${id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            const json = await res.json()
            if (!res.ok) {
                return alert('Falha ao buscar o album.')
            }
            setAlbum(json.data.album)
        }
        reqAlbum()
    }, [token, id])

    if (!album) {
        return <H3>Por favor, faça o login para acessar o album.</H3>
    }
    
    const [year, month, day] =  album.release_date.split('-')
    const releaseDate = `${day}/${month}/${year}`

    function HandleCoverPic(e) {
        e.preventDefault()
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            const base64_cover_pic = reader.result
            const coverPic = JSON.stringify({
                'base64_cover_pic': base64_cover_pic
            })
            const url = `http://127.0.0.1:8000/api/v2/albums/${id}/update-cover-pic`
            const options = {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: coverPic
            }
            const updateCoverPic = async () => {
                try {
                    const res = await fetch(url, options)
                    const json = await res.json()

                    if (!res.ok) {
                        return alert('Falha ao atualizar a capa do álbum.', res)
                    }
                    setNewCoverPic(json.data['cover_pic'])
                }
                catch (err) {
                    console.error('error', err)
                }
            }
            updateCoverPic()
        }
    }

    const handleAlbumUpdate = (e) => {
        e.preventDefault()
        let releaseDateFormated = album.release_date
        if (newReleaseDate) {
            const [day, month, year] =  newReleaseDate.split('/')
            releaseDateFormated = `${year}-${month}-${day}`
        }
        const url = `http://127.0.0.1:8000/api/v2/albums/${id}`
        const data = JSON.stringify({
            title: newTitle ? newTitle : album.title,
            release_date: releaseDateFormated
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
        const updateAlbum = async () => {
            try {
                const res = await fetch(url, options)
                if (!res.ok) {
                    return alert('Falha ao atualizar dados da conta.', res)
                }
                alert('Os dados da conta foram atualizados.')
            }
            catch (err) {
                console.error('error', err)
            }
        }
        updateAlbum()
    }

    return (
        <Main>
            <NavBar/>

            <Container>
                <H3>edit your album</H3>
                <Data>
                    <FormCoverPic>
                        <CoverPic
                            src={newCoverPic ?
                                (`http://127.0.0.1:8000/storage/${newCoverPic}`) :
                                (`http://127.0.0.1:8000/storage/${album.cover_pic}`)}/>
                        <InputFile type='file' name='coverPic' id='file' accept='.jpeg, .png, .jpg' onChange={(e) => HandleCoverPic(e)}/>
                    </FormCoverPic>
                    <FormAlbumUpdate onSubmit={handleAlbumUpdate}>
                        <Input
                            type='text'
                            name='title'
                            placeholder={album.title}
                            value={newTitle || album.title}
                            onChange={(e) => setNewTitle(e.target.value)}/>
                        <InputReleaseDate
                            type='dob'
                            name='dob'
                            mask='99/99/9999'
                            placeholder={releaseDate}
                            value={newReleaseDate || releaseDate}
                            onChange={(e) => setNewReleaseDate(e.target.value)}/>
                        <Button type='submit'>save</Button>
                    </FormAlbumUpdate>
                </Data>
            </Container>
            <ShapeBottom/>
        </Main>
    )
}
