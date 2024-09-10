import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import  userSchema  from '../validators/data.schema';
import { ValidationError } from "sequelize";

const saltRounds = 10;

function calculateAge(date_of_birth: string | Date): number {
	const birthDate = new Date(date_of_birth);
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	const dayDiff = today.getDate() - birthDate.getDate();
	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
			age--;
	}
	return age;
}

const userController = {
  createUser: async (req: Request, res: Response) => {
    try {
			const {
        first_name,
        last_name,
        username,
        email,
        phone_number,
        password,
        country,
        state_or_province,
        state_of_origin,
        education_level,
        profession,
        hobbies_and_interests,
        qualities,
        gender,
        date_of_birth,
        subscribed,
      } = req.body;
      
      const userExists = await User.findOne({ where: { email }});
      
      if (userExists) {
        return res.status(409).json({ message: `User ${first_name} already exists. You can log in with your email or username and password.` });
      };

      let hashedPassword = await bcrypt.hash(password, saltRounds);
			let age = calculateAge(date_of_birth);
      if (age < 18) {
        console.log('You are underage');
        return res.status(403).json({ message: "You are under-age, this service is for adults" });
      }

      const userData = {
				first_name,
        last_name,
        username,
        email,
        phone_number,
        password: hashedPassword,
        country,
        state_or_province,
        state_of_origin,
        education_level,
        profession,
        hobbies_and_interests,
        qualities,
        gender,
        date_of_birth,
				age: age,
        subscribed,
			};
      
      const userRecord = await User.create(userData)

      if (userRecord) {
        const sanitizedUser = await User.findOne({ 
					where: { email },
          attributes: { exclude: ["password", "date_of_birth"] },
        }
				);
        return res.status(201).json({ message: `User ${first_name} created successfully`, user: sanitizedUser });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred!", error: err });
    }
  },

  getAllUsers: async (req: Request, res: Response) => {
    try {
      const allUsers = await User.findAll({
				attributes: { exclude: ["password", "date_of_birth"] },
			});
      if (!allUsers.length) {
        return res.status(404).json({ message: "No records found" });
      }
      return res.status(200).json({ message: "Records found", data: allUsers });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred while fetching users.", error: error });
    }
  },

	getOneUser: async (req: Request, res: Response) => {
		try {
			const { user_id }= req.params;
			const user = await User.findByPk(
				user_id ,
				// attributes: { exclude: ['password', 'date_of_birth'] }
    );
			if (!user) {
				return res.status(404).json({ message: `Record not found for ${user_id}`});
			}
			return res.status(200).send({ message: 'User found!', data: user })
		} catch (error) {
			console.error(error);
		return res.status(500).json({ message: "An error occurred while updating the user.", error: error });
		}
	},

	updateUser: async (req: Request, res: Response) => {
		try {
			const user_id = req.params.user_id;
			const {
				first_name,
        last_name,
        username,
        country,
        state_or_province,
        state_of_origin,
        education_level,
        profession,
        hobbies_and_interests,
        qualities,
        date_of_birth,
        subscribed,
			} = req.body;
			let dob = calculateAge(req.body.date_of_birth);
			const user  = await User.findByPk(user_id)
			if (!user) {
				return res.status(404).json({ message: `User not found.`});
			}
			let updatedFields = {
				first_name,
        last_name,
        username,
        country,
        state_or_province,
        state_of_origin,
        education_level,
        profession,
        hobbies_and_interests,
        qualities,
        date_of_birth,
				age: dob,
        subscribed,
			};
			await user.update(updatedFields);

			const updatedUser = await User.findByPk(user_id, {
				attributes: { exclude: ["password"] },
			});
			return res.status(200).json({ message: 'User updated successfully', data: updatedUser})
		} catch (error) {
			return res.status(500).send({ message: 'Error occured', error: error});
		}
	},

	deleteUser: async (req: Request, res: Response) => {
		try {
			const user_id = req.params.user_id;
			const removeUser = await User.destroy({ where: { user_id } });
			if (removeUser < 1) {
				return res.status(404).send({
          status: 'error',
          message: `User with id: ${user_id} was not found`,
          data: null,
          error: null
        });
			}
			return res.status(200).send({
        status: 'success',
        message: 'User deleted successfully.',
        data: removeUser,
        error: null,
      });
			
			// return res.status(403).send("User not deleted due to an error");
		} catch (error) {
			return res.status(500).send({ message: 'Error occured', error: error});
		}
	}
};

export default userController;
