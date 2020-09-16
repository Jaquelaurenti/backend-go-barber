import { getRepository } from 'typeorm'
import path from 'path';
import fs from 'fs';

import User from '../models/User';
import uploadconfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User>{
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne(user_id);
    if(!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    } else {
      if(user.avatar) {

        // deletar o avatar que ele já possui
        const userAvatarFilePath = path.join(uploadconfig.directory, user.avatar);
        // garante que eu vou usar função em formato de promise e não callback
        // stat = verifia se o arquivo existe
        const userAvatarFileExists = fs.promises.stat(userAvatarFilePath);

        if(userAvatarFileExists) {
          await fs.promises.unlink(userAvatarFilePath);
        }
      }
      // atualizo o avatar se não houver um avatar!!
      user.avatar = avatarFileName;
      // atualizo as informações do avatar do usuário
      await usersRepository.save(user);
      return user;
    }

  }

}

export default UpdateUserAvatarService;
