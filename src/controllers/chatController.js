var chatDB = require("../models/chat.js");

exports.initChatRoom = (user1, user2) => {
    let chat = new chatDB({
        users = [user1._id, user2._id]
    })
    chat.save()
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err.message);
            return null;
        })
}

exports.chatMessage = (roomID, content, user) => {
    chatDB.findById(roomID)
        .then(chat => {
            let message = {
                content: content,
                idUser: user._id,
                time: new Date()
            }
            chat.messages.push(message);
            chat.save()
                .then(async() => {
                    return {
                        ...message,
                        user: user
                    }
                })
                .catch(err => {
                    console.log('chatMessage', err.message);
                    return null;
                })
        });
}

exports.getRoomChat = (req, res) => {

}