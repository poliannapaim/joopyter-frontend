import useDocumentTitle from '../components/useDocumentTitle'
import NavBar from '../components/navBar'
import styled from 'styled-components'
import ShapeBottom from '../components/shapeBottom'
import { useEffect, useState } from 'react'

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

const ButtonBack = styled(Button)`
    margin-right: 2vw;
    background-color: #FED7AA;
    color: #EA580C;
    vertical-align: top;

    &:hover {
    background-color: #EA580C;
    color: #FED7AA;
    transition-duration: 500ms;
    }
`;

export default function UpdateTracks() {
    useDocumentTitle('edit your tracks')

    const id = (window.location).href.split('/').pop()
    const [token] = useState(localStorage.getItem('auth_token'))
    const [tracks, setTracks] = useState(null)
    const [albumInfo, setAlbumInfo] = useState(null)
    const [newNumber, setNewNumber] = useState([])
    const [newTitle, setNewTitle] = useState([])

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
            setAlbumInfo(json.data.album.title)
        }
        reqAlbum()
    }, [token, id])

    if (!tracks) {
        return <H3>Por favor, faça o login para acessar as tracks do álbum.</H3>
    }

    // console.log(tracks)
    const updateNumberChange = id => (e) => {
        let numberArr = []
        numberArr[id] = e.target.value
        console.log(id)
        console.log(e.target.value)
        setNewNumber(numberArr)
    }

    const updateTitleChange = id => (e) => {
        let titleArr = []
        titleArr[id] = e.target.value
        console.log(id)
        console.log(e.target.value)
        setNewTitle(titleArr)
    }

    const listNumbers = tracks.map((tr)=> 
        <div key={tr.id}>
            <InputNumber
            type='number'
            name='number'
            placeholder={tr.number}
            value={newNumber[tr.id] || tr.number}
            onChange={updateNumberChange(tr.id)}/>
        </div>
    )
    const listTitles = tracks.map((tr) => 
        <div key={tr.id}>
            <Input
            type='text'
            name='title'
            placeholder={tr.title}
            value={newTitle[tr.id] || tr.title}
            onChange={updateTitleChange(tr.id)}/>
        </div>

    )

    const handleTracksUpdate = (e) => {
        e.preventDefault()
        console.log(newNumber)
        console.log(newTitle)
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
                    // navigate(`/album/${album.id}`)
    //         }
    //         catch (err) {
    //             console.error('error', err)
    //         }
    //     }
    //     updateTrack()
    }

    return (
        <Main>
            <NavBar/>

            <Container>
                <H3>edit your tracks</H3>
                <AlbumInfo>{albumInfo} (Album)</AlbumInfo>
                <Data>
                    <FormTracksUpdate onSubmit={handleTracksUpdate}>
                        <Tracks>
                            <div>{listNumbers}</div>
                            <div>{listTitles}</div>
                        </Tracks>
                        <div>
                            <ButtonBack type='submit'>{'< back'}</ButtonBack>
                            <Button type='submit'>save</Button>
                        </div>
                    </FormTracksUpdate>
                </Data>
            </Container>
            <ShapeBottom/>
        </Main>
    )
}
