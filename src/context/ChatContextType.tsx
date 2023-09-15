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
    prev: string
}
