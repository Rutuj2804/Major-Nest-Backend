export interface FeesInterface {
    title: string,
    user: string,
    university: string,
    class: string,
    amount: number,
    _id?: string,
}

export interface AcceptedFeesInterface {
    user: string,
    fee: string,
    _id?: string,
}