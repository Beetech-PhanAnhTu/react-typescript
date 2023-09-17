export interface Imembers {
    firstId: string,
    secondId: string
}
export interface IUserChat {
    _id: string,
    members: Imembers[],
}

export interface IMessage {
    _id: string,
    chatId: string,
    senderId: string,
    text: string,
}

export interface IUser {
    _id: string,
    name: string,
    email: string,
    password: string,
}
