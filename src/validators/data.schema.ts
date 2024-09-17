import Joi from 'joi';
const roles = process.env.ROLES?.split('|') || ''


const createAdminSchema = Joi.object ({
	admin_id: Joi.string().optional().uuid({ version: 'uuidv4' }).label('Admin_id'),
	first_name: Joi.string().min(3).max(20).required().label('First_name'),
	last_name: Joi.string().min(3).max(20).required().label('Last_name'),
	username: Joi.string().alphanum().min(3).max(20).required().label('Username'),
	phone_number: Joi.string()
    .pattern(/^(?:\+?234|0)\d{10}$/)
    .required()
    .label('Phone number'),
	email: Joi.string().email().required().label('Email'),
	password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).label('Password'),
	confirmPassword: Joi.ref('password'),
	role: Joi.string().required().valid(...roles).label('Role')
});

const createUserSchema = Joi.object({
	user_id: Joi.string().optional().uuid({ version: 'uuidv4' }).label('user_id'),
	first_name: Joi.string().min(3).max(20).required().label('First_name'),
	last_name: Joi.string().min(3).max(20).required().label('Last_name'),
	username: Joi.string().alphanum().min(3).max(20).required().label('Username'),
	email: Joi.string().email().required().label('Email'),
	phone_number: Joi.string()
    .pattern(/^(?:\+?234|0)\d{10}$/)
    .required()
    .label('Phone number'),
	password: Joi.string()
    .min(8)
    .max(35)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])/)
    .messages({
      'string.min': 'Password must be at least {#limit} characters long',
      'string.max': 'Password must not exceed {#limit} characters',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@.#$!%*?&^)'
    })
    .required(),
	confirmPassword: Joi.ref('password'),
	country: Joi.string().required().label('Country'),
	state_or_province: Joi.string().label('State or Province'),
	state_of_origin: Joi.string().required().label('state of origin'),
	gender: Joi.string().required().label('Gender'),
	date_of_birth: Joi.date().iso().required().label('Date of Birth'),
	age: Joi.number().optional().label('Age'),
	education_level: Joi.string().required().label('Education level'),
	profession: Joi.string().required().label('Profession'),
	hobbies_and_interests: Joi.array().required().label('Hobbies and interests'),
	qualities: Joi.array().required().label('Qualities'),
	subscribed: Joi.boolean().optional()
});

const updateUserSchema = Joi.object({
	user_id: Joi.string().optional().uuid({ version: 'uuidv4' }).label('user_id'),
	first_name: Joi.string().min(3).max(20).required().label('First_name'),
	last_name: Joi.string().min(3).max(20).required().label('Last_name'),
	username: Joi.string().alphanum().min(3).max(20).required().label('Username'),
	email: Joi.string().email().required().label('Email'),
	phone_number: Joi.string()
    .pattern(/^(?:\+?234|0)\d{10}$/)
    .required()
    .label('Phone number'),
	country: Joi.string().required().label('Country'),
	state_or_province: Joi.string().label('State or Province'),
	state_of_origin: Joi.string().required().label('state of origin'),
	gender: Joi.string().required().label('Gender'),
	date_of_birth: Joi.date().iso().required().label('Date of Birth'),
	age: Joi.number().optional().label('Age'),
	education_level: Joi.string().required().label('Education level'),
	profession: Joi.string().required().label('Profession'),
	hobbies_and_interests: Joi.array().required().label('Hobbies and interests'),
	qualities: Joi.array().required().label('Qualities'),
	subscribed: Joi.boolean().optional(),
	role: Joi.string().optional().label('Role')
});

const userIdSchema = Joi.object({
	user_id: Joi.string().uuid().required().messages({
    'any.required': '"User id" is required',
    'string.guid': '"User id" must be a valid UUID'
  }),
})
const adminIdSchema = Joi.object({
	admin_id: Joi.string().uuid().required().messages({
    'any.required': '"Admin id" is required',
    'string.guid': '"Admin id" must be a valid UUID'
  })
})

export default { createAdminSchema, createUserSchema, userIdSchema, adminIdSchema, updateUserSchema };

