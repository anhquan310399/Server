const axios = require('axios').default;
exports.verifyFacebook = async function(accessToken) {
    const data = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}`)
        .then(res => { return res.data })
        .catch(err => {
            data = null;
            console.log("Verify access token facebook");
            console.log(err);
        })
    return data;
}