const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ['com', 'net', 'jp', 'co'] },
});
const newPassword = Joi.string().min(6).max(40).required();
const pin = Joi.number().integer().min(100000).max(999999).required();
const password = Joi.string().min(6).max(40).required();
const name = Joi.string().min(3).max(40).required();
const role = Joi.string();
const level = Joi.string();
const fcmToken = Joi.string();
const classroom = Joi.string();
const send = Joi.boolean();
const country = Joi.string().min(2).max(40).required();
const gender = Joi.string().required();
const createdBy = Joi.objectId();
const confirmPassword = Joi.string().required().valid(Joi.ref('password'));
const active = Joi.boolean();

const updatePassValidation = (req, res, next) => {
  const schema = Joi.object({ email, pin, newPassword });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: 'error', message: value.error.message });
  }
  next();
};

const reqPinValidation = (req, res, next) => {
  const schema = Joi.object({ email });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: 'error', message: value.error.message });
  }
  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({ email, password });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: 'error', message: value.error.message });
  }
  next();
};

const registerValidation = (req, res, next) => {
  const schema = Joi.object({
    name,
    email,
    password,
    confirmPassword,
    role,
    gender,
    send,
    active,
    level,
    classroom,
    createdBy,
    fcmToken,
  });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: 'error', message: value.error.message });
  }
  next();
};

module.exports = {
  reqPinValidation,
  updatePassValidation,
  loginValidation,
  registerValidation,
};
