const { OAuth2Client } = require('google-auth-library');
const GOOGLEID = process.env.CLIENT_GOOGLE_KEY;
const client = new OAuth2Client(GOOGLEID);

exports.verifyGoogle = async function(userToken) {
    const ticket = await client.verifyIdToken({
        idToken: userToken,
        audience: GOOGLEID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return payload
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
}