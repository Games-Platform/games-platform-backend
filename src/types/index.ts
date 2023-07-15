export interface IUser {
  id: string;
  email: string;
  username: string;
}

export enum EAuth {
  INVALID_CRENEDTIALS = 'User or password is incorrect',
  USER_EXIST = 'User with this email already exist',
  USER_NOT_EXIST = "This user doesn't exist yet",
  VALIDATE_USERNAME = 'Username must be more then 2 symbols',
  VALIDATE_PASSWORD = 'Password must be more than 8 symbols',
}
