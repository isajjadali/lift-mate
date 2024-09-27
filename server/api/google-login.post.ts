import{OAuth2Client} from "google-auth-library";
import { google } from "googleapis";
import { validator } from "sequelize/types/lib/utils/validator-extras";

// get runtime config variables
const config= useRuntimeConfig();

// create google client
const googleclientid= config.googleClientid
const client = new OAuth2Client(googleclientid);

// api event handler
export default defineEventHandler(async(event) => {
    const body = await readBody(event);
    const token= body.token;

if(!token){
   throw createError({
    statusCode: 400,
    statusMessage: 'no token or invalid token provided'
   })
}

    const user = verify(token).catch(console.error);

    return user;
  })

//   @desc verify jason web token and user data if token is valid
//   @param token jason web token from google
//   @returns

async function verify(token: string) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleclientid,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

return payload;

//   const userid = payload['sub'];
  // If the request specified a Google Workspace domain:
  // const domain = payload['hd'];
}
