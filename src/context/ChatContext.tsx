import axios from "axios";
// import { async } from "q";
import React, {createContext, useCallback, useEffect, useRef, useState } from "react";

import { Socket, io } from "socket.io-client";
import { IMessage, IUser, IUserChat, IUserInfo, IUserOnline } from "./ChatContextType";

interface IChatContextType {
    userChat?: IUserChat[];
    setChat: React.Dispatch<React.SetStateAction<IUserChat[] | undefined>>;
    updateCurrentChat?: React.Dispatch<React.SetStateAction<IUserChat>>;
    message?: IMessage[];
    currentChat?: IUserChat | undefined;
    setNewMessage?: React.Dispatch<React.SetStateAction<string>>;
    newMessageSocket?: IMessage,
    handleSendMessage: (newMessage: string, sender: any, currentChatId: string) => void;
    newMessage: string;
    listUserCreateChat?: IUser[],
    HandleCreateChatUser: (firstId: string, secondId: string) => void,
    scrollRef: React.RefObject<HTMLDivElement | null | undefined>;
    userOnline?: IUserOnline[];
    userInfo?: IUserInfo;
}

interface ChatContextProviderProps {
    children: React.ReactNode,
    user: any
}

export const ChatContext = createContext<IChatContextType>({
    userChat: [],
    setChat: () => {},
    updateCurrentChat: () => {},
    message: [],
    currentChat: {
        _id: '',
        members: []
    },
    setNewMessage: () => {},
    newMessageSocket: {
        _id: '',
        chatId: '',
        senderId: '',
        text: '',
    },
    handleSendMessage: () => {},
    newMessage: '',
    HandleCreateChatUser: () => {},
    scrollRef: null as unknown as React.RefObject<HTMLDivElement>,
    userOnline: [],
    userInfo: {
        name: '',
        email: ''
    }
});

export const ChatContextProvider:React.FC<ChatContextProviderProps> = ({children, user}) => {
    const [userChat, setChat] = useState<IUserChat[]>();
    // list friend to create a room chat
    const [listUserCreateChat, setListUserCreateChat] = useState<IUser[]>([]);
    const [currentChat, setCurrentChat] = useState<IUserChat>();
    const [message, setMessage] = useState<IMessage[]>([]);
    const [userOnline, setUserOnline] = useState<IUserOnline[]>([]);

    // //send new message
    const [newMessage, setNewMessage] = useState<string>('');

    const [newMessageSocket, setNewMessageSocket] = useState<IMessage>();

    const [socket, setSocket] = useState(io());

    const scrollRef = useRef<HTMLDivElement | null | undefined>(null);

    // const [notifications, setNotifications] = useState([]);

    // //get User Info
    const [userInfo, setUserInfo] = useState<IUserInfo>();
    

    useEffect(() => {
        (async () => {
            const getUserInfo = currentChat?.members?.find((id) => id !== user?.data?._id);
            if(getUserInfo){
                const response = await axios.get(`http://localhost:5000/api/users/find/${getUserInfo}`);
                setUserInfo(response?.data);
            }
        })();
    }, [currentChat])

    const HandleCreateChatUser = useCallback(async(firstId: string, secondId: string) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/chats`, JSON.stringify({
                firstId: firstId,
                secondId: secondId,
            }),  {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true,
                timeout: 10000
            });
            // console.log(response?.data);
            setChat((prev) => [...(prev ?? []), response?.data]);
        } catch (error: any) {
            // Handle errors from axios or socket.emit if needed
            console.error('Error:', error.message);
        }
    }, [])

    //set state for scroll chat
    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [message])

    // //initialize socket
    useEffect(() => {
        const initSocket: Socket = io("http://localhost:3000")
        setSocket(initSocket);

        //disconnect socket when component unmounted
        return () =>{
            if (initSocket) {
                initSocket.disconnect();
            }
        }
    }, [user])

    // //user connect socket room
    useEffect(() => {
        if(socket === null) return;
        socket.emit("addNewUser", user?._id);

        socket.on('userOnline', (res: any) => {
            setUserOnline(res)
        })
        return () => {
            socket.off('userOnline');
        }
    }, [socket])

    //send message through socket
    useEffect(() => {
        (async () => {
          if (socket === null) return;
          const ReceiveId = currentChat?.members.find((id) => id !== user?._id);
          if (socket) {
            try {
              socket.emit('sendMessage', { ...newMessageSocket, ReceiveId });
            } catch (error: any) {
              // Handle errors from axios or socket.emit if needed
              console.error('Error:', error.message);
            }
          }
      
          return () => {
            socket.off('sendMessage');
          };
        })();
      }, [newMessageSocket]);


    // //receive message through socket
    useEffect(() => {
        console.log("Inside useEffect");
        if (socket === null) {
            console.log("Socket is null");
            return;
        }
        try {
            console.log("trying to receive message");
            socket.on("getMessage", (res: any) => {
                if(currentChat?._id !== res.chatId) return;
                
                setMessage((prev) => [...prev, res]);
            });

            //notifications
            console.log(currentChat);
            // socket.on("getNotification", (res) => {
            //     const isNotification = currentChat?.members?.some((id) => id === res.senderId)
            //     if(isNotification){
            //         setNotifications((prev) => [{...res, isRead: true}, ...prev]);
            //     }else{
            //         setNotifications((prev) => [res, ...prev]);
            //     }
            // })
        } catch (error) {
            console.log("Received error socket:", error);
        }
        
        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        };
    }, [socket, currentChat])

    // //marskUserChatSeenMessage
    // const marskUserChatSeenMessage = useCallback((userUnreadMessageNotification, notifications) => {
    //     const getNotifications = notifications?.map((noti) => {
    //         let notification;

    //         userUnreadMessageNotification?.forEach(notify => {
    //             if(notify?.senderId === noti?.senderId){
    //                 notification = {...notify, isRead: true}
    //             }else{
    //                 notification = noti
    //             }
    //         });

    //         return notification;
    //     })

    //     setNotifications(getNotifications);
    // }, [])

    //fetch list user chat
    useEffect(() => {
        if (user && user?._id){
            const fetchUserChat = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/chats/${user?._id}`, {
                        headers: {'Content-Type': 'application/json'},
                        withCredentials: true,
                        timeout: 10000
                    });
                    setChat(response?.data);
                } catch (error) {
                    // Xử lý lỗi nếu cần
                    console.error('Error:', error);
                }
            };
            fetchUserChat();
        }
    }, [user]);


    // //update chat display
    const updateCurrentChat = useCallback((chat: any) => {
        setCurrentChat(chat);
    }, []);


    // // 
    useEffect(() => {
        (async () => {
            const response = await axios.get(`http://localhost:5000/api/users`)
            const UserchatRoom = response?.data.filter((u: any) => {
                let isChatCreated: boolean | undefined = false;
                if(user?._id === u?._id){
                    return false;
                }

                // //check if users existed chatrôm
                isChatCreated = userChat?.some((chat) => {
                    return chat?.members?.includes(u?._id)
                })
                console.log("isChatCreated", isChatCreated);
                return !isChatCreated;
            })
            setListUserCreateChat(UserchatRoom);
        })();
    }, [userChat]);

    // //get message
    useEffect(() => {
        const getMessage = async () => {
            const response = await axios.get(`http://localhost:5000/api/messages/${currentChat?._id}`);
            setMessage(response?.data);
        };
        getMessage();
    }, [currentChat]);

    // //send message 
    const handleSendMessage = useCallback(async (newMessage: string, sender: any, currentChatId: string) => {
        try {
            const response = await axios.post('http://localhost:5000/api/messages', JSON.stringify({
                chatId: currentChatId,
                senderId: sender?._id,
                text: newMessage
            }), {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true,
                timeout: 10000
            });
            setNewMessageSocket(response?.data);
            //get list message
            setMessage((prev) => [...prev, response?.data]);
            setNewMessage('');
        } catch (error: any) {
            // Handle error
            if (error.response) {
                console.error('Response Error:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('Request Error:', error.request);
            } else {
                console.error('Error:', error.message);
            }
        }
    }, []);


    return <ChatContext.Provider value={{ 
        userChat,
        setChat,
        updateCurrentChat,
        message,
        currentChat,
        // currentChat,
        // updateCurrentChat,
        setNewMessage,
        handleSendMessage,
        newMessageSocket,
        newMessage,
        // handleSendMessage,
        // newMessage,
        listUserCreateChat,
        HandleCreateChatUser,
        scrollRef,
        userOnline,
        userInfo,
        // notifications,
        // marskUserChatSeenMessage,
        // updateCurrentFirstChat
    }}>
        { children }
    </ChatContext.Provider>
}