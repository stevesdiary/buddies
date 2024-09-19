import { NextFunction, Request, Response } from "express";
import Quality from '../models/Qualities';
import { error } from "console";

const qualitiesControlller = {
	// createQuality: async (req: Request, res: Response, next: NextFunction) => {
	// 	try {
	// 		const  { quality } = req.body;
	// 		if (!quality) {
	// 			return res.status(400).json({ message: 'Please enter a quality' });
	// 		}
	// 		const qualityExists = await Quality.create(quality);
	// 		if ( qualityExists ) {
	// 			res.status(201).json({ message: `${quality} has been added to the list`, qualityExists });
	// 		}
	// 	} catch (error) {
	// 		return next(error);
	// 	}
	// },
	createQuality: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { quality } = req.body;
			if (!quality) {
				return res.status(400).json({ message: 'Please enter a quality' });
			}
	
			const existingQuality = await Quality.findOne({ where: { quality: quality } });
			if (existingQuality) {
				return res.status(409).json({ message: `Quality '${quality}' already exists.` });
			}
	
			const newQuality = await Quality.create({ quality: quality });

			res.status(201).json({
				status: 'success',
				message: `Quality '${quality}' has been added to the list`,
				data: newQuality,
				error: null
			});
	
		} catch (error) {
			return next(error);
		}
	},
	

	getQualities: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const qualities = await Quality.findAll({ attributes: ['quality_id', 'quality']});
			if(!qualities) {
				res.status(404).send({ message: 'Record(s) not found'})
			};
			res.status(200).json({
				status: 'success',
				message: 'Here are the qualities record', 
				data: qualities,
				error: null
			});
		} catch (error) {
			return next(error);
		}
	},
	getOneQuality: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { quality_id } = req.params;
			const quality = await Quality.findByPk( quality_id, { attributes: ['quality_id', 'quality']});
			if ( !quality ) {
				res.status(404).json({ message: 'Record not found'})
			}
			res.status(200).json({
				status: 'success',
				message: `Record found!`,
				data: quality,
				error: null
			});
		} catch (error) {
			return next(error);
		}
	},
	deleteQuality: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { quality_id } = req.params;
			const deleteQuality = await Quality.destroy( { where: {quality_id}} );
			if (deleteQuality < 1) {
        return res.status(404).send({
          status: "error",
          message: `Record with id: ${quality_id} not found`,
          data: null,
          error: null,
        });
      }
      return res.status(200).send({
        status: "success",
        message: "User deleted successfully.",
        data: deleteQuality,
        error: null,
      });
		} catch (error) {
			return next(error);
		}
	}
}

export default qualitiesControlller;