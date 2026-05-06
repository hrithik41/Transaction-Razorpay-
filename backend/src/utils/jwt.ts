import jwt from "jsonwebtoken";

export const generateTokens = (id: number) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const accessExpires = process.env.JWT_ACCESS_EXPIRES_IN;
  const refreshExpires = process.env.JWT_REFRESH_EXPIRES_IN;

  const accessToken = jwt.sign({ id }, accessSecret!, { expiresIn: accessExpires as any });
  const refreshToken = jwt.sign({ id }, refreshSecret!, { expiresIn: refreshExpires as any });

  return [accessToken, refreshToken];
};


export const verifyAccessRefreshToken = (token: any, type: string) => {
  const secret = type==="access"?process.env.JWT_ACCESS_SECRET:process.env.JWT_REFRESH_SECRET;
  let verify=jwt.verify(token, secret!) as any;
  return verify;
};