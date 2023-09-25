import styled from "styled-components";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const StyledContainer = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const StyledUsername = styled.span`
    text-align: center;
`;
const StyledEmail = styled.span`
    text-align: center;
`;

const StyledTitle = styled.h1`

`;

const UserInfor:React.FC = () =>{
    const {userInfo} = useContext(ChatContext);
    return (
        <StyledContainer>
            <StyledTitle>Thông tin User</StyledTitle>
            <StyledUsername>{userInfo?.name}</StyledUsername>
            <StyledEmail>{userInfo?.email}</StyledEmail>
        </StyledContainer>
    );
}

export default UserInfor;