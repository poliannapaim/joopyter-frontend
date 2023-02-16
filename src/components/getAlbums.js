import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const H3 = styled.h3`
    color: #FED7AA;
    font-family: 'Poppins', sans-serif;
    font-size: 2.5rem;
    font-weight: 900;
`;

const Albums = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2vw;
`;

const AlbumInfo = styled(Link)`
    width: 8vw;
    display: flex;
    flex-direction: column;
    justify-items: center;
    text-decoration: none;
`;

const CoverPic = styled.img`
    width: 8vw;
    height: 8vw;
    border-radius: 8%;
`;

const Title = styled.h6`
    width: 8vw;
    color: #E7E5E4;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    margin-top: 0.5vw;
`;

const ReleaseDate = styled.p`
    width: 8vw;
    color: #E7E5E4;
    font-family: 'Poppins', sans-serif;
    font-size: 0.8rem;
    font-weight: 400;
    margin: 0;
`;

export default function GetAlbums() {
    const [token] = useState(localStorage.getItem('auth_token'))
    const [albums, setAlbums] = useState(null)

    useEffect(() => {
        const reqAlbums = async () => {
            const res = await fetch('http://127.0.0.1:8000/api/v2/albums', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            const json = await res.json()
            if (!res.ok) {
                return alert('Falha ao buscar os albums da conta.')
            }
            setAlbums(json.data)
        }
        reqAlbums()
    }, [token])

    if (!albums) {
        return <H3>Por favor, faça o login para acessar os albums.</H3>
    }
    
    const formatReleaseDate = (releaseDate) => {
        const [year, month, day] =  releaseDate.split('-')
        return `${day} · ${month} · ${year}`
    }

    const listAlbums = albums.map(al => 
        <AlbumInfo to={`/album/${al.album.id}`}>
            <CoverPic src={`http://127.0.0.1:8000/storage/${al.album.cover_pic}`}/>
            <Title>{al.album.title}</Title>
            <ReleaseDate>{formatReleaseDate(al.album.release_date)}</ReleaseDate>
        </AlbumInfo>
    )

    return (
        <>
            <H3>your albums</H3>
            <Albums>
                {listAlbums}
            </Albums>
        </>
    )
}
