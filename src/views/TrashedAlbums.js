import styled from 'styled-components'
import NavBar from '../components/navBar'
import ShapeBottomAbsolute from '../components/shapeBottomAbsolute'
import useDocumentTitle from '../components/useDocumentTitle'
import { useEffect, useState } from 'react'
import ShapeBottom from '../components/shapeBottom'
import { useNavigate } from 'react-router-dom'

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
`;

const TATable = styled.table`
    background-color: #292524;
    border: 1vw solid #292524;
    border-radius: 10px;
    border-spacing: 0;
`;

const TAHead = styled.th`
    color: #FED7AA;
    font-family: 'Poppins', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    padding: 1vw 3vw;
    text-align: center;
    border-bottom: 1px solid #57534E;
    
    &:first-child {
        text-align: start;
    }
`;

const TAData = styled.td`
    color: #E7E5E4;
    font-family: 'Poppins', sans-serif;
    font-size: 1.2rem;
    font-weight: 400;
    padding: 1vw 3vw;
    text-align: center;
    border-bottom: 1px solid #57534E;
    
    &:first-child {
        text-align: start;
    }
`;

const ButtonRestore = styled.button`
    text-decoration: none;
    color: #14B8A6;
    font-family: 'Poppins', sans-serif;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    background-color: transparent;
    border: 0;

    &:hover {
        text-decoration: underline;
    }
`;

const ButtonRemove = styled(ButtonRestore)`
    color: #DC2626;
`;

export default function TrashedAlbums() {
    useDocumentTitle('álbuns deletados')

    const token = localStorage.getItem('auth_token')
    const [trashedAlbums, setTrashedAlbums] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const reqTrashedAlbums = async () => {
            if (!token) {
                return
            }
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/albums/trashed`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                const json = await res.json()
                if (!res.ok) {
                    return alert('Falha ao buscar os álbuns deletados.')
                }
                setTrashedAlbums(json.data)
            } catch (error) {
                console.error(`Erro ao buscar os álbuns deletados: ${error}`)
            }
        }
        reqTrashedAlbums()
    }, [token])

    if (!trashedAlbums) {
        return <></>
    }

    const formatReleaseDate = (releaseDate) => {
        const [year, month, day] = releaseDate.split('-')
        return `${day}/${month}/${year}`
    }

    const formatDeletedAt = (deletedAt) => {
        if (!deletedAt) {
            return '__/__/___'
        }
        const newFormat = deletedAt.substr(0, 10)
        const [year, month, day] = newFormat.split('-')
        return `${day}/${month}/${year}`
    }

    const handleRestore = (e, id) => {
        e.preventDefault()

        const restoreAlbum = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/albums/${id}/restore`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                if (!res.ok) {
                    return alert(`Falha ao restaurar o álbum: ${res}`)
                }
                alert('Álbum restaurado!')
                navigate(0)
            } catch (error) {
                console.error(`Erro ao restaurar o álbum: ${error}`)
            }
        }
        restoreAlbum()
    }

    const handleRemove = (e, id) => {
        e.preventDefault()

        if (window.confirm('Você realmente deseja remover permanentemente o álbum?') === true) {
            const removeAlbum = async () => {
                try {
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/albums/${id}/delete-permanently`, {
                        method: 'DELETE',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    if (!res.ok) {
                        return alert(`Falha ao remover permanentemente o álbum: ${res}`)
                    }
                    alert('Álbum removido permanentemente!')
                    navigate(0)
                } catch (error) {
                    console.error(`Erro ao remover permanentemente o álbum: ${error}`)
                }
            }
            removeAlbum()
        }
    }

    const getTrashedAlbums = trashedAlbums.length ?
        trashedAlbums.map(ta => (
            <tbody key={ta.id}>
                <tr>
                    <TAData>{ta.title}</TAData>
                    <TAData>{formatReleaseDate(ta.release_date)}</TAData>
                    <TAData>{formatDeletedAt(ta.deleted_at)}</TAData>
                    <TAData><ButtonRestore onClick={(e) => handleRestore(e, ta.id)}>restaurar</ButtonRestore></TAData>
                    <TAData><ButtonRemove onClick={(e) => handleRemove(e, ta.id)}>remover</ButtonRemove></TAData>
                </tr>
            </tbody>
        )) : <></>

    const getShapeBottom = trashedAlbums.length > 6 ? <ShapeBottom/> : <ShapeBottomAbsolute/>

    return (
        <Main>
            <NavBar/>

            <Container>
                <H3>álbuns deletados</H3>
                <TATable>     
                    <thead>
                        <tr>
                            <TAHead>título</TAHead>
                            <TAHead>data de lançamento</TAHead>
                            <TAHead>deletado em</TAHead>
                            <TAHead></TAHead>
                            <TAHead></TAHead>
                        </tr>
                    </thead>
                    {getTrashedAlbums}
                </TATable>
            
            </Container>
            {getShapeBottom}
        </Main>
    )
}