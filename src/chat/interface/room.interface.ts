export interface MessageInterface {
    _id: string
    text: string,
    sender: string,
    isRead: boolean,
    createdAt?: string
}

export interface ChatRoomInterface {
    name: string,
    users: [string],
    admin: string,
    messages: [MessageInterface],
    createdAt?: string
}

