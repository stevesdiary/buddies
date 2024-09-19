import { NextFunction, Request, Response } from "express";
import Interest from '../models/Interests';
import { error } from "console";

const interestController = {
	createInterest: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const  { interest } = req.body;
			if (!interest) {
				return res.status(400).json({ message: 'Please enter an interest or hobby' });
			}
			const interestExists = await Interest.findOne({ where: { interest: interest }});
			if ( interestExists ) {
				return res.status(201).json({ message: `Interest ${interest} already exists` });
			}
			const newInterest = await Interest.create({ interest: interest });
			return res.status(201).json({
				status: 'success',
				message: `Interest ${interest} has been added to the list`,
				data: newInterest,
				error: null
			});
		} catch (error) {
			return next(error);
		}
	},

	getInterests: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const interests = await Interest.findAll({ attributes: { exclude: ['createdAt', 'updatedAt']}});
			if(interests.length === 0) {
				res.status(404).send({ message: 'Record(s) not found'})
			}
			res.status(200).json({
				status: 'success',
				message: 'Here are the interest records', 
				data: interests,
				error: null
			});
		} catch (error) {
			return next(error);
		}
	},
	getOneInterest: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { interest_id } = req.params;
			const interest = await Interest.findByPk( interest_id, { attributes: {exclude: ['createdAt', 'updatedAt'] } });
			if ( !interest ) {
				res.status(404).json({ message: 'Record not found'})
			}
			res.status(200).json({
				status: 'success',
				message: `Record found!`,
				data: interest,
				error: null
			});
		} catch (error) {
			return next(error);
		}
	},
	deleteInterest: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { interest_id } = req.params;
			const deleteInterest = await Interest.destroy( { where: {interest_id}} );
			if (deleteInterest < 1) {
        return res.status(404).send({
          status: "error",
          message: `Record with id: ${interest_id} not found`,
          data: null,
          error: null,
        });
      }
      return res.status(200).send({
        status: "success",
        message: "User deleted successfully.",
        data: deleteInterest,
        error: null,
      });
		} catch (error) {
			return next(error);
		}
	}
}

export default interestController;