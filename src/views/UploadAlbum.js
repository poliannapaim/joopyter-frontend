import useDocumentTitle from '../components/useDocumentTitle'
import NavBar from '../components/navBar'
import styled from 'styled-components'
import ShapeBottomAbsolute from '../components/shapeBottomAbsolute'
import { useState } from 'react'
import InputMask from 'react-input-mask'
import profile from '../components/images/profile.svg'
import { useNavigate } from 'react-router-dom'

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

const DivCoverPic = styled.div`
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

const DivInputs = styled.div`
    margin-top: 2vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2vw;
`;

const InputFile = styled.input`
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;

    &:hover {
        border: 5px solid #292524;
        cursor: pointer;
    }
`;

const FormAlbumUpdate = styled.form`
    margin-top: 2vw;
    display: flex;
    flex-direction: row;
    gap: 3vw;
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

    &:hover {
    background-color: #FED7AA;
    color: #EA580C;
    transition-duration: 500ms;
    }
`;

export default function UploadAlbum() {
    useDocumentTitle('registrar álbum')

    const [token] = useState(localStorage.getItem('auth_token'))
    const [coverPic, setCoverPic] = useState(null)
    const [title, setTitle] = useState('')
    const [releaseDate, setReleaseDate] = useState('')
    const navigate = useNavigate()

    function HandleCoverPic(e) {
        e.preventDefault()
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            const base64_cover_pic = reader.result
            setCoverPic(base64_cover_pic)
        }
    }

    const handleAlbumUpload = (e) => {
        e.preventDefault()
        const [day, month, year] =  releaseDate.split('/')
        const releaseDateFormated = `${year}-${month}-${day}`
        
        const url = `${process.env.REACT_APP_API_URL}/albums`
        const data = JSON.stringify({
            title,
            release_date: releaseDateFormated,
            base64_cover_pic: coverPic,
        })
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: data
        }
        const uploadAlbum = async () => {
            try {
                const res = await fetch(url, options)
                const json = await res.json()
                if (!res.ok) {
                    return alert(`Falha ao criar novo álbum: ${res}`)
                }
                alert('O novo álbum foi criado.')
                navigate(`/album/${json.data['id']}/upload-tracks`)
            }
            catch (error) {
                console.error(`Erro ao criar novo álbum: ${error}`)
            }
        }
        uploadAlbum()
    }

    return (
        <Main>
            <NavBar/>

            <Container>
                <H3>registrar álbum</H3>
                <FormAlbumUpdate onSubmit={handleAlbumUpload}>
                    <DivCoverPic>
                        <CoverPic
                            src={coverPic ? coverPic : profile}/>
                        <InputFile type='file' name='coverPic' id='file' title='Enviar foto de capa do álbum.' accept='.jpeg, .png, .jpg' onChange={(e) => HandleCoverPic(e)}
                        />
                    </DivCoverPic>
                    <DivInputs>
                        <Input
                            type='text'
                            name='title'
                            placeholder={title || 'Título do álbum'}
                            value={title || ''}
                            onChange={(e) => setTitle(e.target.value)}/>
                        <InputReleaseDate
                            type='dob'
                            name='dob'
                            mask='99/99/9999'
                            placeholder={releaseDate || 'Data de lançamento'}
                            value={releaseDate || ''}
                            onChange={(e) => setReleaseDate(e.target.value)}/>
                        <Button type='submit'>salvar</Button>
                    </DivInputs>
                </FormAlbumUpdate>
            </Container>
            <ShapeBottomAbsolute/>
        </Main>
    )
}
