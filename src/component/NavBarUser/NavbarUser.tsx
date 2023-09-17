import styled from "styled-components";
import { ChatContext } from "../../context/ChatContext";
import { useContext } from "react";
import { AuthContextUser } from "../../context/AuthContext";

const StyledUserListCreateChat = styled.ul`
    list-style: none;
    padding: 0;
`;
const StyledUserItem = styled.a`
  cursor: pointer;
  padding: 10px 30px;
  background-color: aqua;
  margin-left: 15px;
  border-radius: 10%;
  box-shadow: 0px 3px #888888;
  color: #888888;
`;

const NavBarUser:React.FC = () =>{
    const {listUserCreateChat, HandleCreateChatUser} = useContext(ChatContext);
    const {user} = useContext(AuthContextUser);
    
    return (
        <StyledUserListCreateChat>
            { listUserCreateChat && listUserCreateChat?.map((u, index) => {
                    return (
                        <StyledUserItem key={index} onClick={
                            (e) => {
                                e.preventDefault();
                                HandleCreateChatUser(u?._id, user?._id)
                            }
                        }>{u?.name}</StyledUserItem>
                    )
                })
            }
        </StyledUserListCreateChat>
    );
}

export default NavBarUser;