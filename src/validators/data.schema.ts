import Joi from 'joi';
const roles = process.env.ROLES?.split('|') || ''


const adminSchema = Joi.object ({
	admin_id: Joi.string().required().uuid({ version: 'uuidv4' }).label('Admin_id'),
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

const userSchema = Joi.object({
	user_id: Joi.string().required().uuid({ version: 'uuidv4' }).label('user_id'),
	first_name: Joi.string().min(3).max(20).required().label('First_name'),
	last_name: Joi.string().min(3).max(20).required().label('Last_name'),
	username: Joi.string().alphanum().min(3).max(20).required().label('Username'),
	email: Joi.string().email().required().label('Email'),
	phone_number: Joi.string()
    .pattern(/^(?:\+?234|0)\d{10}$/)
    .required()
    .label('Phone number'),
	password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).label('Password'),
	confirmPassword: Joi.ref('password'),
	country: Joi.string().required().label('Country'),
	state_or_province: Joi.string().label('State or Province'),
	state_of_origin: Joi.string().required().label('state of origin'),
	gender: Joi.string().required().label('Gender'),
	date_of_birth: Joi.number().min(2006)
	
});

const idSchema = Joi.object({
	id: Joi.string().required().uuid({ version: 'uuidv4' }).label('User or Admin id')
})
export default { adminSchema, userSchema, idSchema };