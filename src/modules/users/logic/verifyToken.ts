import jwt, { VerifyOptions } from 'jsonwebtoken';

type VerifyTokenParams = {
  token: string;
  secret: string;
  issuer: string;
};

export function verifyToken(props: VerifyTokenParams): Promise<any> {
  const { token, secret, issuer } = props;

  const options: VerifyOptions = { issuer };

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (error, decoded) => {
      if (error) return reject(error);

      resolve(decoded);
    });
  });
}
