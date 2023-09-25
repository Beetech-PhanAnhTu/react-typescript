import { useContext } from 'react';
import styled from 'styled-components'
import { Link, Route, Routes } from 'react-router-dom';
import Login from './component/Login/Login';
import { AuthContextUser } from './context/AuthContext';
import Content from './Content';
import { ChatContextProvider } from './context/ChatContext';
import NavBarUser from './component/NavBarUser/NavbarUser';
import UserInfor from './component/UserInfor/UserInfor';
import ProtectedRoute from './hooks/ProtectedRoute';

const StyledContainer = styled.div`
  height: 800px;
	/* Hide scrollbar for Chrome, Safari and Opera */
	::-webkit-scrollbar {
		display: none;
  }
`;

const StyledNavBar = styled.ul`
  list-style: none;
  display: flex;
`;

const StyledItem = styled.li`
  &hover{
    text-decoration: none; /* Loại bỏ gạch chân khi hover */
    color: #ff0000;
  }
`;

const StyledHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StyledLink = styled(Link)`
  transition: all 0.3s ease 0s;
  padding: 0 20px;
  text-decoration: underline;
  color: #007bff;
`;

const App:React.FC = () => {
  const {user} = useContext(AuthContextUser)

  return (
    <ChatContextProvider user={user}>
      <StyledContainer>
        <StyledHeader className="App">
          <StyledNavBar>
            <StyledItem><StyledLink to="/login">Login</StyledLink></StyledItem>
            <StyledItem><StyledLink to="/">Chat room</StyledLink></StyledItem>
          </StyledNavBar>
        </StyledHeader>
        <Routes>
          <Route path="/login" element={user ? <Content /> : <Login />} />
          <Route path="/" element={<ProtectedRoute user={user}>
            <NavBarUser />
            <Content />
          </ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute user={user}>
            <UserInfor />
          </ProtectedRoute>}/>
        </Routes>
      </StyledContainer>
    </ChatContextProvider>
  )
}

export default App
