import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      // o email é do tipo string, ele é um email e é obrigatório.
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create,
);
passwordRouter.post(
  '/reset',
  celebrate({
    // o token é do tipo string, ele é um uuid e é obrigatório.
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      // o confirmation é do tipo string, é obrigatório, e o seu valor só será valido
      // se ele possuir o mesmo valor do campo password
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetPasswordController.create,
);

export default passwordRouter;
