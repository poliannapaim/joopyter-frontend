import useDocumentTitle from '../components/useDocumentTitle'
import NavBar from '../components/navBar'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import InputMask from 'react-input-mask'
import ShapeBottomAbsolute from '../components/shapeBottomAbsolute'
import { useParams, Link, useNavigate } from 'react-router-dom'

const Main = styled.main`
    width: 100vw;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    width: fit-content;
    padding: 1vw 5vw;
    margin-top: 3vw;
    display: flex;
    flex-direction: column;
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
    height: 8vw;
    border-radius: 8%;
    border: 5px solid transparent;

    &:hover {
        border: 5px solid #292524;
        cursor: pointer;
    }
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
    font-weight: 600;
    align-self: flex-end;
    margin-top: 3vw;

    &:hover {
        text-decoration: underline;
    }
`;

export default function UpdateAlbum() {
    useDocumentTitle('editar álbum')
    
    let { albumId } = useParams()
    const [token] = useState(localStorage.getItem('auth_token'))
    const [album, setAlbum] = useState(null)
    const [newCoverPic, setNewCoverPic] = useState(null)
    const [newTitle, setNewTitle] = useState('')
    const [newReleaseDate, setNewReleaseDate] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const reqAlbum = async () => {
            if (!token) {
                return
            }
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/albums/${albumId}`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                const json = await res.json()
                if (!res.ok) {
                    if (res.status === 403) {
                        return navigate('/')
                    }
                    return alert(`Falha ao buscar o álbum: ${res}`)
                }
                setAlbum(json.data.album)
            } catch (error) {
                console.error(`Falha ao buscar o álbum: ${error}`)
            }
        }
        reqAlbum()
    }, [token, albumId, navigate])

    if (!album) {
        return <></>
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
            const url = `${process.env.REACT_APP_API_URL}/albums/${albumId}/update-cover-pic`
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
                        return alert(`Falha ao atualizar a capa do álbum: ${res}`)
                    }
                    setNewCoverPic(json.data['cover_pic'])
                }
                catch (error) {
                    console.error(`Falha ao atualizar a capa do álbum: ${error}`)
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
        const url = `${process.env.REACT_APP_API_URL}/albums/${albumId}`
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
                    return alert(`Falha ao atualizar os dados do álbum: ${res}`)
                }
                alert('As alterações foram salvas.')
            }
            catch (error) {
                console.error(`Falha ao atualizar os dados do álbum: ${error}`)
            }
        }
        updateAlbum()
    }

    return (
        <Main>
            <NavBar/>

            <Container>
                <H3>editar álbum</H3>
                <Data>
                    <FormCoverPic>
                        <CoverPic
                            src={newCoverPic ?
                                (`${process.env.REACT_APP_STORAGE_URL}/${newCoverPic}`) :
                                (`${process.env.REACT_APP_STORAGE_URL}/${album.cover_pic}`)}/>
                        <InputFile type='file' name='coverPic' id='file' title='Editar capa do álbum.' accept='.jpeg, .png, .jpg' onChange={(e) => HandleCoverPic(e)}/>
                    </FormCoverPic>
                    <FormAlbumUpdate onSubmit={handleAlbumUpdate}>
                        <Input
                            type='text'
                            name='title'
                            placeholder={album.title}
                            value={newTitle || album.title}
                            onChange={(e) => setNewTitle(e.target.value)}/>
                        <InputReleaseDate
                            type='text'
                            name='release_date'
                            mask='99/99/9999'
                            placeholder={releaseDate}
                            value={newReleaseDate || releaseDate}
                            onChange={(e) => setNewReleaseDate(e.target.value)}/>
                        <Button type='submit' title='Salvar as alterações e editar as músicas.'>{'salvar'}</Button>
                    </FormAlbumUpdate>
                </Data>
                <StyledLink to={`/album/${album.id}/edit-tracks`}>editar músicas</StyledLink>
            </Container>
            <ShapeBottomAbsolute/>
        </Main>
    )
}
