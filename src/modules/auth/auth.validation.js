import joi from "joi";

export const registerSchema = joi
  .object({
    name: joi.string().required().min(3).max(20),
    email: joi.string().email().required(),
    password: joi
      .string()
      .regex(/^[A-Z][a-z0-9]{4,10}$/)
      .required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

export const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();
