import useDocumentTitle from '../components/useDocumentTitle'
import NavBar from '../components/navBar'
import styled from 'styled-components'
import ShapeBottom from '../components/shapeBottom'
import { useEffect, useState } from 'react'

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

const CoverPic = styled.img`
    width: 8vw;
    height: 8vw;
    border-radius: 8%;
`;

const FormTracksUpdate = styled.form`
    margin-top: 2vw;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    margin-left: 2vw;
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

export default function UpdateTracks() {
    useDocumentTitle('edit your tracks')

    const id = (window.location).href.split('/').pop()
    const [token] = useState(localStorage.getItem('auth_token'))
    const [tracks, setTracks] = useState(null)
    const [coverPic, setCoverPic] = useState(null)
    const [newNumber, setNewNumber] = useState('')
    const [newTitle, setNewTitle] = useState('')

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
            setTracks(json.data.tracks)
            setCoverPic(json.data.album.cover_pic)
        }
        reqAlbum()
    }, [token, id])

    if (!tracks) {
        return <H3>Por favor, faça o login para acessar as tracks do álbum.</H3>
    }

    const listTracks = tracks.map(tr => 
        <div>
            <InputNumber
                type='number'
                name='number[]'
                placeholder={tr.number}
                value={newNumber || tr.number}
                onChange={(e) => setNewNumber(e.target.value)}/>
            <Input
                type='text'
                name='text[]'
                placeholder={tr.title}
                value={newTitle || tr.title}
                onChange={(e) => setNewTitle(e.target.value)}/>
        </div>
    )

    // const handleTracksUpdate = (e) => {
    //     e.preventDefault()
    //     const url = `http://127.0.0.1:8000/api/v2/albums/${id}`
    //     const data = JSON.stringify({
    //         number: newNumber ? newNumber : album.title,
    //         title: newTitle ? newTitle : album.title,
    //     })
    //     const options = {
    //         method: 'PUT',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${token}`
    //         },
    //         body: data
    //     }
    //     const updateTrack = async () => {
    //         try {
    //             const res = await fetch(url, options)
    //             if (!res.ok) {
    //                 return alert('Falha ao atualizar dados da conta.', res)
    //             }
    //             alert('Os dados da conta foram atualizados.')
    //         }
    //         catch (err) {
    //             console.error('error', err)
    //         }
    //     }
    //     updateTrack()
    // }

    return (
        <Main>
            <NavBar/>

            <Container>
                <H3>edit your tracks</H3>
                <Data>
                    <CoverPic
                        src={`http://127.0.0.1:8000/storage/${coverPic}`}/>
                    <FormTracksUpdate >
                    {/* onSubmit={handleTracksUpdate} */}
                        {listTracks}
                        <Button type='submit'>save</Button>
                    </FormTracksUpdate>
                </Data>
            </Container>
            <ShapeBottom/>
        </Main>
    )
}
