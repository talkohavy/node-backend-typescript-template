import jwt, { VerifyOptions } from 'jsonwebtoken';

type VerifyTokenParams = {
  token: string;
  secret: string;
  issuer: string;
};

export function verifyToken({ token, secret, issuer }: VerifyTokenParams): Promise<any> {
  const options: VerifyOptions = { issuer };

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (error, decoded) => {
      if (error) return reject(error);

      resolve(decoded);
    });
  });
}
