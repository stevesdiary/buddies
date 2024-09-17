import Admin from '../models/Admin';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 10

interface LoginRequest extends Request {
	body: {
		email: string;
		password: string;
	},
}

const loginController = {
	adminLogin: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
		const { email, password } = req.body;
		try {
			const admin = await Admin.findOne({ where: { email }});
		if (!admin) {
			res.status(404).json({ message: 'Email not found' });
			return;
		}
		const passwordMatch = await bcrypt.compare(password, admin.dataValues.password);
		if (!passwordMatch) {
			res.status(401).send({ message: 'Password is not correct!'});
			return;
		}
		
		const accessToken = jwt.sign(
			{
				AdminInfo: {
					admin_id: admin.dataValues.admin_id,
					email: email,
					role: admin.dataValues.role,
				},
				exp: expiry,
			},
			process.env.ADMIN_JWT_SECRET as string,
		);
		return res.status(200).send({
			first_name: admin.dataValues.first_name,
			role: admin.dataValues.role,
			token: accessToken,
		})
		} catch (error) {
			return next(error);
		}
	},

	userLogin: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
		const { email, password } = req.body;
		try {
			const user = await User.findOne({ where: { email }});
		if (!user) {
			res.status(404).json({ message: 'Email not found' });
			return;
		}
		const passwordMatch = await bcrypt.compare(password, user.dataValues.password);
		if (!passwordMatch) {
			res.status(401).send({ message: 'Password is not correct!'});
			return;
		}
		
		const accessToken = jwt.sign(
			{
				UserInfo: {
					user_id: user.dataValues.user_id,
					email: email,
					role: user.dataValues.role,
				},
				exp: expiry,
			},
			process.env.USER_JWT_SECRET as string
		);
		return res.status(200).send({
			name: user.dataValues.first_name,
			token: accessToken,
		})
		} catch (error) {
			return next(error);
		}
	}
}

export default loginController;