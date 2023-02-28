import { useNavigate, useParams } from 'react-router-dom'
import NavBar from '../components/navBar'
import ShapeBottom from '../components/shapeBottom'
import ShapeBottomAbsolute from '../components/shapeBottomAbsolute'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { IoRemoveOutline, IoAddOutline } from 'react-icons/io5'
import useDocumentTitle from '../components/useDocumentTitle'

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

const AlbumInfo = styled.p`
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
    align-content: stretch;
    gap: 2vw;
`;

const Tracks = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    align-self: flex-start;
    
    gap: 2vw;
`;

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
    align-self: center;

    &:hover {
    background-color: #FED7AA;
    color: #EA580C;
    transition-duration: 500ms;
    }
`;

const RemoveButton = styled(IoRemoveOutline)`
    color: #DC2626;
    font-size: 1.5rem;
    background-color: transparent;
    cursor: pointer;
`;

const AddButton = styled(IoAddOutline)`
    color: #FED7AA;
    font-size: 1.5rem;
    background-color: transparent;
    cursor: pointer;
`;

export default function UploadTracks() {
    useDocumentTitle('adicionar músicas')

    const [token] = useState(localStorage.getItem('auth_token'))
    let { albumId } = useParams()
    const [album, setAlbum] = useState(null)
    const [formInputs, setFormInputs] = useState([{number: '', title: ''}])
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
                setAlbum(json.data.album)
            } catch (error) {
                console.error(`Erro ao buscar o álbum: ${error}`)
            }
        }
        reqAlbum()
    }, [token, albumId, navigate])

    if (!album) {
        return <></>
    }

    const [year] = album.release_date.split('-')

    const handleChange = (i, e) => {
        let newFormInputs = [...formInputs]
        newFormInputs[i][e.target.name] = e.target.value
        setFormInputs(newFormInputs)
    }
    
    const removeInputs = (i) => {
        let newFormInputs = [...formInputs]
        newFormInputs.splice(i, 1)
        setFormInputs(newFormInputs)
    }
    
    const addInputs = () => {
        setFormInputs([...formInputs, {number: '', title: ''}])
    }
    
    const handleTracksUpload = (e) => {
        e.preventDefault()
        
        const url = `${process.env.REACT_APP_API_URL}/albums/${albumId}/tracks`
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formInputs)
        }
        const uploadTracks = async () => {
            try {
                const res = await fetch(url, options)
                if (!res.ok) {
                    return alert(`Falha adicionar músicas ao álbum: ${res}`)
                }
                alert('As músicas foram adicionadas ao álbum.')
                navigate(`/album/${albumId}`)
            }
            catch (error) {
                console.error(`Erro ao adicionar músicas ao álbum: ${error}`)
            }
        }
        uploadTracks()
    }
    
    const getShapeBottom = formInputs.length > 4 ? <ShapeBottom/> : <ShapeBottomAbsolute/>

    return (
        <Main>
            <NavBar/>

            <Container>
                <H3>adicionar músicas</H3>
                <AlbumInfo>{album.title} ({year})</AlbumInfo>
                <Data>
                    <FormTracksUpdate onSubmit={handleTracksUpload}>
                        {formInputs.map((el, i) => (
                            <Tracks key={i}>
                                <div>
                                    <InputNumber
                                        type='number'
                                        name='number'
                                        placeholder={el.number || 'nº'}
                                        value={el.number || ''}
                                        onChange={(e) => handleChange(i, e)}/>
                                </div>
                                <div>
                                    <Input
                                        type='text'
                                        name='title'
                                        placeholder={el.title || 'Título da música'}
                                        value={el.title || ''}
                                        onChange={(e) => handleChange(i, e)}/>
                                </div>
                                {formInputs.length > 1 ? <RemoveButton onClick={() => removeInputs(i)}/> : null}
                                
                                { i !== formInputs.length-1 ? null : <AddButton onClick={() => addInputs()}/> }
                            </Tracks>
                                
                        ))}
                        <Button type='submit'>salvar</Button>
                    </FormTracksUpdate>
                </Data>
            </Container>
            {getShapeBottom}
        </Main>
    )
}