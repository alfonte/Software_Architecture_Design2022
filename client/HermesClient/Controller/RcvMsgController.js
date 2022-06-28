export default class RcvMsgController {
    constructor(network, loggedUser, crypto, createChat) {
        this.network = network
        this.loggedUser = loggedUser
        this.createChat = createChat
        this.crypto = crypto
    }

    rcvMsg(text, idMittente, timestamp){  
        if(!this.loggedUser.chats.has(idMittente)){
            this.createChat.createChatFromId(idMittente)
            
        }

        this.loggedUser.createMessage(this.crypto.decryptMsg(text, this.loggedUser.prk), idMittente, 0)
        //stora in locale
    }
    
}