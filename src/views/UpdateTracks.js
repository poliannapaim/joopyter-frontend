import useDocumentTitle from '../components/useDocumentTitle'
import NavBar from '../components/navBar'
import styled from 'styled-components'
import ShapeBottom from '../components/shapeBottom'
import { useEffect, useState } from 'react'
import ShapeBottomAbsolute from '../components/shapeBottomAbsolute'
import { Link, useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { IoTrashOutline } from 'react-icons/io5'

const Main = styled.main`
    width: 100%;
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
    margin-bottom: 4vw;
`;

const Message = styled.h6`
    width: auto;
    color: #DC2626;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    margin-top: 3vw;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #FED7AA;

    &:hover {
        text-decoration: underline;
    }
`;

const AlbumInfo = styled.p`
    color: #FED7AA;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
    line-height: 0;
    width: fit-content;
    text-transform: uppercase;
    margin-left: 3vw;
`;

const Data = styled.div`
    display: flex;
    flex-direction: row;
    gap: 3vw;
    margin-left: 3vw;
`;

const FormTracksUpdate = styled.form`
    margin-top: 2vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2vw;
`;

const Tracks = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2vw;
`

const InputNumber = styled.input`
    background-color: #1C1917;
    width: 3vw;
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
const Input = styled(InputNumber)`
    width: 18vw;
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

const RemoveButton = styled(IoTrashOutline)`
    color: #DC2626;
    font-size: 1.5rem;
    background-color: transparent;
    cursor: pointer;
`;

export default function UpdateTracks() {
    useDocumentTitle('editar as músicas')

    let { albumId } = useParams()
    const [token] = useState(localStorage.getItem('auth_token'))
    const [tracks, setTracks] = useState(null)
    const [albumInfo, setAlbumInfo] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            return
        }
        const reqAlbum = async () => {
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
                setTracks(json.data.tracks)
                setAlbumInfo(json.data.album)
            } catch (error) {
                console.error(`Erro ao buscar o álbum: ${error}`)
            }
        }
        reqAlbum()
    }, [token, albumId, navigate])

    if (!tracks) {
        return <></>
    }
    
    const [year] =  albumInfo.release_date.split('-')

    const handleChange = (e, i) => {
        let newInput = [...tracks]
        newInput[i][e.target.name] = e.target.value
        setTracks(newInput)
    }

    const handleTracksUpdate = (e) => {
        e.preventDefault()
        const url = `${process.env.REACT_APP_API_URL}/albums/${albumId}/tracks`
        const options = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(tracks)
        }
        const updateTracks = async () => {
            try {
                const res = await fetch(url, options)
                if (!res.ok) {
                    return alert(`Falha ao atualizar as músicas do álbum: ${res}`)
                }
                alert('As músicas foram atualizadas.')
                navigate(0)
            }
            catch (error) {
                console.error(`Erro ao atualizar as músicas do álbum: ${error}`)
            }
        }
        updateTracks()
    }

    const handleTrackDelete = (e, id) => {
        e.preventDefault()
        if (window.confirm('Você realmente deseja deletar essa música?') === true) {
            const url = `${process.env.REACT_APP_API_URL}/albums/${albumId}/tracks/${id}`
            const options = {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const deleteTrack = async () => {
                try {
                    const res = await fetch(url, options)
                    if (!res.ok) {
                        return alert(`Falha ao deletar a música: ${res}`)
                    }
                    alert('A música foi deletada.')
                    navigate(0)
                }
                catch (error) {
                    console.error(`Erro ao deletar a música: ${error}`)
                }
            }
            deleteTrack()
        }
    }

    const listTracks = tracks.length ? 
        <FormTracksUpdate onSubmit={handleTracksUpdate}>
            {tracks.map((el, i) => (
                <Tracks key={i}>
                    <InputNumber
                        type='number'
                        name='number'
                        placeholder={el.number}
                        value={el.number}
                        onChange={(e) => handleChange(e, i)}/>
                    <Input
                        type='text'
                        name='title'
                        placeholder={el.title}
                        value={el.title}
                        onChange={(e) => handleChange(e, i)}/>
                    <RemoveButton onClick={(e) => handleTrackDelete(e, el.id)} title={'Deletar a música.'}/>
                </Tracks>   
            ))}  
            <Button type='submit'>salvar</Button>
        </FormTracksUpdate>
    : (
        <Message>Você ainda não possui músicas neste álbum. <StyledLink to={`/album/${albumId}/upload-tracks`}>Adicione!</StyledLink></Message>
    )
    
    const getShapeBottom = tracks.lenght > 4 ? <ShapeBottomAbsolute/> : <ShapeBottom/>

    return (
        <Main>
            <NavBar/>

            <Container>
                <H3>editar as músicas</H3>
                <AlbumInfo>álbum: {albumInfo.title} ({year})</AlbumInfo>
                <Data>
                    {listTracks}
                </Data>
            </Container>
            {getShapeBottom}
        </Main>
    )
}
