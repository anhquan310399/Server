var { OAuth2Client } = require('google-auth-library');
var GOOGLEID = process.env.CLIENT_GOOGLE_KEY;
var client = new OAuth2Client(GOOGLEID);

exports.verifyGoogle = async function(userToken) {
    var ticket = await client.verifyIdToken({
        idToken: userToken,
        audience: GOOGLEID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    var payload = ticket.getPayload();
    var userid = payload['sub'];
    return payload
        // If request specified a G Suite domain:
        //var domain = payload['hd'];
}