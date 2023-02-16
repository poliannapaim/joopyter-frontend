import useDocumentTitle from '../components/useDocumentTitle'
import NavBar from '../components/navBar'
import styled from 'styled-components'
import GetAlbums from '../components/getAlbums'
import ShapeBottom from '../components/shapeBottom'

const Main = styled.main`
    width: 100vw;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    padding: 1vw 5vw;
    margin-top: 3vw;
`;

export default function Dashboard() {
    useDocumentTitle('joopyter')
    
    return (
        <Main>
            <NavBar/>
            <Container>
                <GetAlbums/>

            </Container>
            <ShapeBottom/>
        </Main>
    )
}
