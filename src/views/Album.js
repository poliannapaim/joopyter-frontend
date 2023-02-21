import useDocumentTitle from '../components/useDocumentTitle'
import NavBar from '../components/navBar'
import styled from 'styled-components'
import ShapeBottomAbsolute from '../components/shapeBottomAbsolute'
import { useEffect, useState } from 'react'
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Main = styled.main`
    width: 100vw;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    padding: 1vw 5vw;
    margin-top: 6.5vw;
    display: flex;
    flex-direction: row;
    align-items: start;
    gap: 3vw;
`;

const H3 = styled.h3`
    color: #FED7AA;
    font-family: 'Poppins', sans-serif;
    font-size: 2.5rem;
    font-weight: 900;
    line-height: 0;
    width: 35vw;
`;

const Data = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3vw;
`;

const Message = styled.h6`
    width: auto;
    color: #DC2626;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #FED7AA;

    &:hover {
        text-decoration: underline;
    }
`;

const Info = styled.div`
    display: flex;
    flex-direction: row;
    gap: 3vw;
`;

const CoverPic = styled.img`
    width: 8vw;
    height: 8vw;
    border-radius: 8%;
`;

const ReleaseDate = styled.p`
    color: #E7E5E4;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    margin: 0;
    line-height: normal;
`;

const EditButton = styled(FaRegEdit)`
    color: #FED7AA;
    font-size: 1.2rem;
    background-color: transparent;
`;

const Button = styled.button`
    width: auto;
    padding: 1vw 1.5vw;
    background-color: #1C1917;
    color: #DC2626;
    font-size: 1.2rem;
    margin-left: 0.5vw;
    cursor: pointer;
    border: 0;
`;

const Tracks = styled.table`
    background-color: #292524;
    border: 1vw solid #292524;
    border-radius: 10px;
`;

const TrackHead = styled.th`
    color: #E7E5E4;
    font-family: 'Poppins', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    padding: 0.5vw;
    text-align: start;

    &:first-child {
        width: 3vw;
        text-align: center;
        padding-right: 2vw;
    }
`;

const TrackData = styled.td`
    color: #E7E5E4;
    font-family: 'Poppins', sans-serif;
    font-size: 1.2rem;
    font-weight: 400;
    padding: 0.5vw;
    text-align: start;

    &:first-child {
        text-align: center;
        padding-right: 2vw;
    }
`;

export default function Album() {
    useDocumentTitle('álbum')

    const id = (window.location).href.split('/').pop()
    const [token] = useState(localStorage.getItem('auth_token'))
    const [error, setError] = useState(null)
    const [tries, setTries] = useState(0)
    const [album, setAlbum] = useState(null)
    const [tracks, setTracks] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const reqAlbum = async () => {
            if (!token) {
                return
            }
            setError(null)
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/v2/albums/${id}`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                const json = await res.json()
                if (!res.ok) {
                    return alert('Falha ao buscar os dados do álbum.')
                }
                setAlbum(json.data.album)
                setTracks(json.data.tracks)
            } catch (error) {
                console.error(`Erro ao buscar os dados do álbum: ${error}`)
                setError(error)
            }
        }
        reqAlbum()
    }, [token, id, setError, tries])

    if (error) {
        return (
            <>
                <H3>Erro ao buscar os dados do álbum.</H3>
                <Button onClick={() => setTries(tries + 1)}>Tentar novamente</Button>
            </>
        )
    }

    if (!album) {
        return <></>
    }

    const [year, month, day] =  album.release_date.split('-')
    const formatedReleaseDate = `${day} · ${month} · ${year}`

    const listTracks = tracks.length ? tracks.map(tr => (
        <Tracks>     
            <thead>
                <tr>
                    <TrackHead>#</TrackHead>
                    <TrackHead>título</TrackHead>
                </tr>
            </thead>
            <tbody>
                <tr key={tr.id}>
                    <TrackData>{tr.number}</TrackData>
                    <TrackData>{tr.title}</TrackData>
                </tr>
            </tbody>
        </Tracks>
    )) : (
        <Tracks>
            <Message>Você ainda não possui músicas neste álbum. <StyledLink to={`/album/${album.id}/upload-tracks`}>Adicione!</StyledLink></Message>
        </Tracks>
    )

    const handleAlbumDelete = (e) => {
        e.preventDefault()
        if (window.confirm('você realmente deseja deletar o álbum?') === true) {
            const url = `http://127.0.0.1:8000/api/v2/albums/${album.id}`
            const options = {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const deleteAlbum = async () => {
                try {
                    const res = await fetch(url, options)
                    if (!res.ok) {
                        return alert(`Falha ao deletar o álbum: ${res}`)
                    }
                    alert('O álbum foi deletado.')
                    navigate('/dashboard')
                }
                catch (error) {
                    console.error(`Erro ao deletar o álbum: ${error}`)
                }
            }
            deleteAlbum()
        }
    }

    return (
        <Main>
            <NavBar/>

            <Container>
                <CoverPic src={`http://127.0.0.1:8000/storage/${album.cover_pic}`}/>

                <Data>
                    <Info>
                        <div>
                            <H3>{album.title}</H3>
                            <ReleaseDate>{formatedReleaseDate}</ReleaseDate>
                        </div>

                        <div>
                            <Link to={`/album/${album.id}/edit`} title={'Editar o seu álbum.'}><EditButton/></Link>
                            <Button type='button' onClick={handleAlbumDelete} title={'Deletar o seu álbum.'}><FaRegTrashAlt/></Button>
                        </div>
                    </Info>
                    {listTracks}
                </Data>
            </Container>
            <ShapeBottomAbsolute/>
        </Main>
    )
}