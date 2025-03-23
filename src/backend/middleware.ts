import Joi from "joi";

const signupValidation = (req: any, res: any, next: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const loginValidation = (req: any, res: any, next: any) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).max(100).required(),
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    next();
  };

export  {
signupValidation,
loginValidation,
};