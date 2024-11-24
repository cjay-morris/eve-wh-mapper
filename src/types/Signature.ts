export interface Signature {
    id: string
    type: string
}

export interface SignaturePushRequest {
    sigs: Signature[]
    system: string
}
