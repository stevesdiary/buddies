import e, { Request, Response } from "express";
import User from "../models/User";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

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
// let dob = calculateAge(req.body.date_of_birth);
const userController = {
  createUser: async (req: Request, res: Response) => {
    try {
			interface userCreationData {
				user_id: string;
				first_name: string;
				last_name: string;
				username: string;
				email: string;
				password: string;
				country: string;
				state_or_province: string;
				state_of_origin: string;
				gender: string;
				date_of_birth: Date;
				age: number;
				education_level: string;
				profession: string;
				hobbies_and_interests: string[];
				qualities: string[];
				subscribed: boolean;
			}
			const {
        first_name,
        last_name,
        username,
        email,
        password,
				confirmPassword,
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
			
      if (!first_name || !last_name || !username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "Please fill in all required fields." });
      }

      const userExists = await User.findOne({ where: { email } });
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&^]{8,15}$/;

      if (userExists) {
        return res.status(409).json({ message: `User ${first_name} already exists. You can log in with your email or username and password.` });
      }

      if (!passwordRegex.test(password)) {
        return res.status(403).json({
          message:
            "Password must be at least 8 characters long, maximum of 15 characters, and include at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.",
        });
      }

      if (password !== confirmPassword) {
        return res.status(409).json({ message: "Passwords do not match. Please check and try again." });
      }
      let hashedPassword = await bcrypt.hash(password, saltRounds);
			let dob = calculateAge(req.body.date_of_birth);

      const userRecord = await User.create({
				first_name,
        last_name,
        username,
        email,
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
				age: dob,
        subscribed,
			});

      if (userRecord) {
        const sanitizedUser = await User.findOne({ 
					where: { email },
          attributes: { exclude: ["password"] },
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
      const allUsers = await User.findAll()
			// 	where: { attributes: { exclude: ["password"] }}
			// });
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
			const user_id = req.params.user_id;
			const email = req.params.email;
			const user = await User.findOne({ where: {email: email} });
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
			const email = req.params.email;
			const removeUser = await User.destroy({ where: { email } });
			if (!removeUser) {
				return res.status(404).send(`User ${email} was not found`);
			}
			if (removeUser !== 1) {
				return res.status(200).send("User deleted successfully.");
			}
			return res.status(403).send("User not deleted due to an error");
		} catch (error) {
			return res.status(500).send({ message: 'Error occured', error: error});
		}
	}
};

export default userController;
