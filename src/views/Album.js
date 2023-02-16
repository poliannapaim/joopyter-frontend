import useDocumentTitle from '../components/useDocumentTitle'
import NavBar from '../components/navBar'
import styled from 'styled-components'
import ShapeBottom from '../components/shapeBottom'
import { useEffect, useState } from 'react'
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

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
`;

const Data = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1vw;
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
    width: 8vw;
    color: #E7E5E4;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    margin: 0;
    text-align: center;
`;

const EditButton = styled(FaRegEdit)`
    color: #FED7AA;
    font-size: 1.2rem;
    margin-left: 4vw;
`;

const TrashButton = styled(FaRegTrashAlt)`
    color: #DC2626;
    font-size: 1.2rem;
    margin-left: 1vw;
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
    }

    &:last-child {
        text-align: end;
    }
`;

const TrackData = styled.td`
    color: #E7E5E4;
    font-family: 'Poppins', sans-serif;
    font-size: 1.2rem;
    font-weight: 400;
    padding: 0.5vw;
    text-align: start;
`;

export default function Album() {
    useDocumentTitle('album')

    const id = (window.location).href.split('/').pop()
    const [token] = useState(localStorage.getItem('auth_token'))
    const [album, setAlbum] = useState(null)
    const [tracks, setTracks] = useState(null)

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
            setTracks(json.data.tracks)
        }
        reqAlbum()
    }, [token, id])

    if (!album) {
        return <H3>Por favor, faça o login para acessar o album.</H3>
    }
    const [year, month, day] =  album.release_date.split('-')
    const formatedReleaseDate = `${day} · ${month} · ${year}`

    const listTracks = tracks.map(tr => 
        <tr>
            <TrackData>{tr.number}</TrackData>
            <TrackData>{tr.title}</TrackData>
        </tr>
    )

    return (
        <Main>
            <NavBar/>

            <Container>
                <div>
                    <CoverPic src={`http://127.0.0.1:8000/storage/${album.cover_pic}`}/>
                    <ReleaseDate>{formatedReleaseDate}</ReleaseDate>
                </div>

                <Data>
                    <Info>
                        <H3>{album.title}</H3>

                        <div>
                            <Link to={`/album/edit/${album.id}`} title={'Edit your album.'}><EditButton/></Link>
                            <TrashButton/>
                        </div>
                    </Info>

                    <Tracks>
                        <thead>
                            <tr>
                                <TrackHead>#</TrackHead>
                                <TrackHead>title</TrackHead>
                                <TrackHead><Link to={`/album/edit-tracks/${album.id}`} title={'Edit your tracks.'}><EditButton/></Link></TrackHead>
                            </tr>
                        </thead>
                        <tbody>
                            {listTracks}
                        </tbody>
                    </Tracks>
                </Data>
            </Container>
            <ShapeBottom/>
        </Main>
    )
}
