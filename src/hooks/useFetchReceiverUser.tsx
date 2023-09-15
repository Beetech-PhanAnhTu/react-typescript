import axios from "axios";
import {useEffect, useState } from "react"

export interface IreceiverUser {
    _id: string,
    name: string,
    email: string,
    password: string,
    createdAt: string,
    updatedAt: string
}

export const useFetchReceiverUser = (chat: any, user: any | null) => {
    
    const [receiverUser, setReceiverUser] = useState<IreceiverUser>();

    const ReceiveId = user == null ? chat?.chat?.members.find((id: string) => id !== chat?.user?._id) :
        chat?.members.find((id: string) => id !== user?._id)

    useEffect(() => {
        const getUser = async () => {
            if (!ReceiveId) return null;
            const response = await axios.get(`http://localhost:5000/api/users/find/${ReceiveId}`)
            setReceiverUser(response?.data);
        }
        getUser();
    }, [ReceiveId])

    return { receiverUser };
}