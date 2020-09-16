import { Router } from 'express';
import AuthenticatieUserService from '../services/AuthenticateUserService';


const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const authenticateService = new AuthenticatieUserService();

  const { user, token } = await authenticateService.execute({
    email,
    password,
  });

  delete user.password;

  return res.json({ user, token });
});

export default sessionsRouter;
