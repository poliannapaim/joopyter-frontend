import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import logo from './images/logo.svg'
import profile from './images/profile.svg'
import { useNavigate } from 'react-router-dom'
import { IoPersonOutline, IoLockClosedOutline, IoMusicalNotesOutline, IoTrashOutline, IoLogOutOutline } from 'react-icons/io5'

const Nav = styled.nav`
    width: 100%;
    height: 4vw;
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: space-between;
`;

const NavLogo = styled.img`
    width: 2vw;
    padding-left: 2vw;
`;

const NavBrand = styled.h3`
    color: #FED7AA;
    font-family: 'Poppins', sans-serif;
    font-size: 1.8rem;
    font-weight: 900;
`;

const StyledLink = styled(Link)`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5vw;
    text-decoration: none;
`;

const DropDown = styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;
    padding-right: 2vw;
`;

const DropDownButton = styled.button`
    width: 2.5vw;
    height: 2.5vw;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-size: cover;
    border: 0;

    &:hover {
        cursor: pointer;
    }
`;

const DropDownName = styled.h5`
    color: #E7E5E4;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    margin: 0;
    align-self: center;
`;

const Divider = styled.hr`
    width: 6vw;
    border: 0;
    border-top: 1px solid #57534E;
`;

const DropDownLinks = styled.ul`
    position: absolute;
    width: 12vw;
    margin-top: 3vw;
    margin-right: -5px;
    padding: 1vw;
    background: #292524;
    border: 1px solid #57534E;
    border-radius: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.8vw;    
`;

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const getDropdownLinks = () => setIsOpen(!isOpen);

    const [token, setToken] = useState(localStorage.getItem('auth_token'))
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    
    useEffect(() => {
        if (!token) {
            setUser(null)
            return
        }
        const makeRequest = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                const json = await res.json()
                if (!res.ok) {
                    return alert('Falha ao buscar a conta.')
                }
                setUser(json)
            } catch (error) {
                console.error(`Erro ao buscar conta: ${error}`)
            }
        }
        makeRequest()
    }, [token])

    const handleLogout = () => {
        localStorage.removeItem('auth_token')
        setToken(null)
        navigate('/')
    }

    if (!token) {
        return <h1>Você não está logado.</h1>
    }
    
    return (
        <Nav>
            <StyledLink to='/dashboard'>
                <NavLogo src={logo} alt='logo'/>
                <NavBrand>joopyter</NavBrand>
            </StyledLink>

            <DropDown>
                <DropDownButton onClick={getDropdownLinks} style={{backgroundImage: user?.profile_pic ? `url(${process.env.REACT_APP_STORAGE_URL}/${user.profile_pic})` : `url(${profile})`}}/>

                {isOpen && (
                    <DropDownLinks>
                        <DropDownName>{user?.name.split(" ")[0]}</DropDownName>
                        <Divider/>
                        <Link to='/account' className='auth-link'>
                            <IoPersonOutline/>
                            atualizar conta
                        </Link>
                        <Link to='/security' className='auth-link'>
                            <IoLockClosedOutline/>
                            segurança
                        </Link>
                        <Link to='/upload-album' className='auth-link'>
                            <IoMusicalNotesOutline/>
                            registrar álbum
                        </Link>
                        <Link to='/trashed-albums' className='auth-link'>
                            <IoTrashOutline/>
                            álbuns deletados
                        </Link>
                        <button type='button' className='button-logout' onClick={handleLogout}>
                            <IoLogOutOutline/>
                            sair
                        </button>
                    </DropDownLinks>
                )}
            </DropDown>
        </Nav>
    )
}
