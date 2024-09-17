import { NextFunction, Request, Response } from "express";
import Admin from "../models/Admin";
import bcrypt from "bcryptjs";
import { error } from "console";

const saltRounds = process.env.SALT || 10;

const adminController = {
	createAdmin: async (req: Request, res: Response, next: NextFunction) => {
		const { first_name, last_name, username, email, password, confirmPassword, role } = req.body;
		try {
			if (!(first_name && email && password)) {
				throw new Error('First name, email and password are required')
			}
			if (password !== confirmPassword) {
				return res.status(403).send({ message: 'Password do not match, ensure that password match to continue.'})
			}
			const exists = await Admin.findOne({ where: { email }});
			if (exists) {
				return res.status(200).send({ message: `Admin ${email} already exists, login with email and password.` });
			};
			const hashedPassword =  await bcrypt.hash(password, saltRounds);
			const admin = await Admin.create({
				first_name, last_name, username, email, password: hashedPassword,  role 
			});
			return res.status(201).send({ message: 'Admin created successfully', admin });
		} catch (error) {
			return next(error);
		}
	},

	updateAdmin: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { admin_id } = req.params;
			const { first_name, last_name, username, email, role } = req.body;
			const admin = await Admin.findByPk(admin_id);
			if (!admin) {
				return res.status(404).send({ message: 'Admin not found' });
			}
			let updateFields = {
				first_name,
				last_name,
				username,
				email,
				role
			}
			await admin.update(updateFields);

			const updatedData = await Admin.findByPk(admin_id, {
				attributes: { exclude: ['password', 'createdAt']}
			});
			return res.status(200).send({ message: 'Admin data updated successfully!', updatedData });
		} catch (err) {
      return next(error);
		}
	},

	findAdmin: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { admin_id } = req.params;
			const admin = await Admin.findByPk(
				admin_id,
				{ attributes: { exclude: ['password'] },
			});
			if (!admin) {
				return res.status(404).send({ message: 'Admin record not found'})
			}
			return res.status(200).send({ message: 'Admin found!', admin });
		} catch (error) {
			return next(error)
		}
	},

	findAllAdmin: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const admin = await Admin.findAll({ attributes: { exclude: ['password']}});
			if (!admin) {
				return res.status(404).send({ message: 'Admin record not found'})
			}
			return res.status(200).send({ message: 'Admin record(s) found!', admin });
		} catch (error) {
			return next(error)
		}
	},

	deleteAdmin: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const admin_id = req.params;
			const record = await Admin.destroy({ where:  admin_id });
			if (record < 1) {
				return res.status(404).send({
					status: 'error',
					message: 'Query record not found',
					data: null,
					error: null
				})
			};
			return res.status(200).send({
				status: 'success',
				message: 'Admin record deleted successfully!',
				data: record,
				error: null
			});
		} catch (error) {
			return next(error)
		}
	}
}

export default adminController;