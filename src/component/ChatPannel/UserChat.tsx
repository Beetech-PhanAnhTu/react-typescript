import styled from "styled-components";
// import { useFetchReceiverUser } from "../../hooks/useFetchReceiverUser";
import React, { useContext } from "react";
import { useFetchReceiverUser } from "../../hooks/useFetchReceiverUser";
import { IUserChat } from "../../context/ChatContextType";
import { ChatContext } from "../../context/ChatContext";

const StyledAvatarUser = styled.a`
    display: block;
    background-repeat: no-repeat;
    width: 60px;
    height: 60px;
    background-size: cover;
    border-radius: 30px;
    border: 1px solid #eaeaea;
    top: 10px;
    left: 10px;
    cursor: pointer;
    background-image: url(https://graph.facebook.com/100006582316470/picture?width=130&height=130);
`;

const StyledUserChat = styled.div`
    flex: 1;
    height: 70px;
    overflow: hidden;
    position: relative;
    margin: 0 5px;
    cursor: pointer;
`;

const StyledUserName = styled.div`
    position: absolute;
    top: 5px;
    left: 17px;
    color: #000;
    font-size: 1.5em;
`;

const StyledItemUser = styled.li`
    display: flex;
    height: 80px;
    position: relative;
    border-radius: 2px;
    padding: 10px;
    margin: 15px 0;
    background-color: #f0f0f0;
    box-shadow: 0 1px 3px 0 #707070, 0 1px 1px 0 #adadad;
    transition: box-shadow 0.15s ease-in-out;
    margin-left: 15px;
    margin-right: 15px;
`;

const StyledNotification = styled.span`
    position: absolute;
    top: 43px;
    left: 143px;
    width: 24px;
    height: 24px;
    background-color: aqua;
    text-align: center;
    border-radius: 50%;
    color: #fff;
`;

const StyledStatus = styled.div`
    position: absolute;
    top: 10px;
    left: 3px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #37d316;
`;

interface UserChatProps {
    chat: IUserChat;
    user: any;
}


const UserChat:React.FC<UserChatProps> = (chat) => {
    const {receiverUser} = useFetchReceiverUser(chat, null);
    
    const {userOnline} = useContext(ChatContext);

    //unread message notification
    // const unreadMessageNotification = () => {
    //     return notifications?.filter((notification) => notification.isRead === false);
    // }
    // const userUnreadMessageNotification = unreadMessageNotification()?.filter((noti) => noti.senderId === receiverUser?._id);

    return (
        <div>
            <StyledItemUser role="button">
                <StyledAvatarUser></StyledAvatarUser>
                <StyledUserChat>
                    {userOnline?.map((user, index) => (
                        user?.userId === receiverUser?._id ? (
                            <React.Fragment key={index}>
                                <StyledStatus></StyledStatus>
                            </React.Fragment>
                        ) : null
                    ))}
                    <StyledNotification>1</StyledNotification>
                    <StyledUserName>{receiverUser?.name}</StyledUserName>
                </StyledUserChat>
            </StyledItemUser>
        </div>
    );
}
export default UserChat;