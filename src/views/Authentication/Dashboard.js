import useDocumentTitle from '../../components/useDocumentTitle'
import NavBar from '../../components/navBar'
import styled from 'styled-components'

const Main = styled.main`
    width: 100vw;
    display: flex;
    flex-direction: column;
`;

export default function Dashboard() {
    useDocumentTitle('joopyter')
    
    return (
        <Main>
            <NavBar />
        </Main>
    )
}
