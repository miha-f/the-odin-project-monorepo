export type Friend = {
    username: string,
    id: number,
}

export type Incoming = {
    id: number,
    sender_id: number,
    sender_username: string,
    receiver_id: number,
    status: string,
    created_at: string,
    responded_at: string,
}

export type Outgoing = {
    id: number,
    sender_id: number,
    receiver_id: number,
    receiver_username: string,
    status: string,
    created_at: string,
    responded_at: string,
}
