import styled from 'styled-components'
import { keyframes } from 'styled-components'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Album = styled.div`
    margin-bottom: 5vw;
`;

const H3 = styled.h3`
    color: #FED7AA;
    font-family: 'Poppins', sans-serif;
    font-size: 2.5rem;
    font-weight: 900;
`;

const Albums = styled.div`
    display: flex;
    flex-direction: row;
    gap: 3vw;
  flex-wrap: wrap;
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

    &:hover {
        filter: grayscale(1);
        transition-duration: 500ms;
    }
`;

const Title = styled.h6`
    width: 8vw;
    color: #E7E5E4;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    margin-top: 0.5vw;

    &:hover {
        color: #FED7AA;
        text-decoration: underline;
    }
`;

const Message = styled(Title)`
    width: auto;
    color: #EA580C;

    &:hover {
        color: #EA580C;
        text-decoration: none;
    }
`;

const ReleaseDate = styled.p`
    width: 8vw;
    color: #E7E5E4;
    font-family: 'Poppins', sans-serif;
    font-size: 0.8rem;
    font-weight: 400;
    margin: 0;
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

const skeletonLoading = keyframes`
    0% {
        background-color: hsl(12, 6%, 20%);
    }
    100% {
        background-color: hsl(12, 6%, 15%);
    }
`;

const H3Skeleton = styled.h3`
    width: 20vw;
    height: 3.5vw;
    font-size: 2.5rem;
    font-weight: 900;
    animation: ${skeletonLoading} 1s linear infinite alternate;
`;

const CoverPicSkeleton = styled.div`
    width: 8vw;
    height: 8vw;
    border-radius: 8%;
    animation: ${skeletonLoading} 1s linear infinite alternate;
`;

const TitleSkeleton = styled.h6`
    width: 7vw;
    height: 1vw;
    margin: 0;
    margin-top: 0.5vw;
    font-size: 1rem;
    animation: ${skeletonLoading} 1s linear infinite alternate;
`;

const ReleaseDateSkeleton = styled.p`
    width: 6vw;
    height: 0.7vw;
    margin: 0;
    margin-top: 0.5vw;
    animation: ${skeletonLoading} 1s linear infinite alternate;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #FED7AA;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    align-self: flex-end;

    &:hover {
        text-decoration: underline;
    }
`;

export default function GetAlbums() {
    const [token] = useState(localStorage.getItem('auth_token'))
    const [isFetching, setIsFetching] = useState(false)
    const [tries, setTries] = useState(0)
    const [error, setError] = useState(null)
    const [albums, setAlbums] = useState(null)

    useEffect(() => {
        if (!token) {
            return
        }
        const reqAlbums = async () => {
            setIsFetching(true)
            setError(null)
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/albums`, {
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
            } catch (error) {
                console.error(`Erro ao buscar álbuns: ${error}`)
                setError(error)
            }
            setIsFetching(false)
        }
        reqAlbums()
    }, [token, setIsFetching, setError, tries])

    if (error) {
        return (
            <>
                <H3>Erro ao buscar os álbuns.</H3>
                <Button onClick={() => setTries(tries + 1)}>Tentar novamente</Button>
            </>
        )
    }

    if (isFetching) {
        return (
            <Album>
                <H3Skeleton/>
                <Albums>
                    <div>
                        <CoverPicSkeleton/>
                        <TitleSkeleton/>
                        <ReleaseDateSkeleton/>
                    </div>
                    <div>
                        <CoverPicSkeleton/>
                        <TitleSkeleton/>
                        <ReleaseDateSkeleton/>
                    </div>
                    <div>
                        <CoverPicSkeleton/>
                        <TitleSkeleton/>
                        <ReleaseDateSkeleton/>
                    </div>
                </Albums>
            </Album>
        )
    }

    if (!albums) {
        return <></>
    }
    
    const formatReleaseDate = (releaseDate) => {
        const [year, month, day] =  releaseDate.split('-')
        return `${day} · ${month} · ${year}`
    }

    const listAlbums = albums.length ? albums.map(al => 
        <AlbumInfo key={al.album.id} to={`/album/${al.album.id}`}>
            <CoverPic src={`${process.env.REACT_APP_STORAGE_URL}/${al.album.cover_pic}`}/>
            <Title>{al.album.title}</Title>
            <ReleaseDate>{formatReleaseDate(al.album.release_date)}</ReleaseDate>
        </AlbumInfo>
    ) : (
        <Message>Você ainda não possui álbuns. <StyledLink to={`/upload-album`}>Adicione!</StyledLink></Message>
    )

    return (
        <Album>
            <H3>seus álbuns</H3>
            <Albums>
                {listAlbums}
            </Albums>
        </Album>
    )
}
