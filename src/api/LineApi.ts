import { create } from "domain";
import { createSecureServer } from "http2";
import { User } from '@prisma/client';
import * as userDB from '../infra/user';

const verifyIdToken = async (idToken: string, clientId: string) => {
    const params = new URLSearchParams();
    params.append('id_token', idToken);
    params.append('client_id', clientId);
    const res = await fetch('https://api.line.me/oauth2/v2.1/verify', {
      'method': 'POST',
      'headers': {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      'body': params.toString()
    });
    const payload = JSON.parse(await res.text());

    let user : User={
      id: payload.sub,
      name: payload.name,
      imageUrl: payload.picture
  
    }

   await userDB.createUser(user);

    return {
      id: payload.sub,
      name: payload.name,
      image_url: payload.picture
    }
  }

export { verifyIdToken }
