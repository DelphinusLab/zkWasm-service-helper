export class SignedRequest {
    user_address;
    // Nonce not necessary for every request, usually included for requests which modify state
    nonce;
    signature;
    constructor(user_address) {
        this.user_address = user_address;
    }
    setSignature(signature) {
        this.signature = signature;
    }
}
