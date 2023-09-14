import { useState } from 'react'
import './App.css'
import styled from 'styled-components'
import { Link, Route, Routes } from 'react-router-dom';
import Login from './component/Login/Login';

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

function App() {

  return (
    <StyledContainer>
      <StyledHeader className="App">
        <StyledNavBar>
          <StyledItem><StyledLink to="/login">Login</StyledLink></StyledItem>
          <StyledItem><StyledLink to="/">Chat room</StyledLink></StyledItem>
        </StyledNavBar>
        <StyledNavBar>
          {/* <NavBarUser></NavBarUser> */}
        </StyledNavBar>
      </StyledHeader>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route exact path="/" component={} />
        <Route exact path="/user" component={} /> */}
      </Routes>
    </StyledContainer>
  )
}

export default App
