export const jwtPayload = {
  id: 1,
  name: 'any_name',
  email: 'any_email@mail.com',
  iat: Date.now(),
  exp: Date.now(),
  aud: 'users',
  iss: 'login',
  sub: '1'
}
