import useDocumentTitle from '../components/useDocumentTitle'
import NavBar from '../components/navBar'
import styled from 'styled-components'
import GetAlbums from '../components/getAlbums'
import ShapeBottomAbsolute from '../components/shapeBottomAbsolute'

const Main = styled.main`
    width: 100%;
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
            <ShapeBottomAbsolute/>
        </Main>
    )
}
