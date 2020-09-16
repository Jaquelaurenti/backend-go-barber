import { getRepository } from 'typeorm'
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../config/config';
import AppError from '../errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { email }
    });

    if(!user) {
      throw new AppError('Incorrect email/password combination', 401);
    } else {
      const passwordMatched = await compare(password, user.password);

      if(passwordMatched){

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
          subject: user.id,
          expiresIn,
        });

        return {
          user,
          token,
        }
      } else {
        throw new AppError('Incorrect email/password combination', 401);
      }
    }
  };
}

export default AuthenticateUserService;
