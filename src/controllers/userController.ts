import { Request, Response } from "express";
import User from "../models/User";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

const saltRounds = 10;

const userController = {
  createUser: async (req: Request, res: Response) => {
    try {
			interface userCreationData {
				userId: string;
				firstName: string;
				lastName: string;
				username: string;
				email: string;
				password: string;
				country: string;
				stateOrProvince: string;
				stateOfOrigin: string;
				gender: string;
				dateOfBirth: Date;
				age: number;
				educationLevel: string;
				professionOrIndustry: string;
				hobbiesAndInterests: string[];
				desiredQualities: string[];
				subscribed: boolean;
			}
			const {
        firstName,
        lastName,
        username,
        email,
        password,
				confirmPassword,
        country,
        stateOrProvince,
        stateOfOrigin,
        educationLevel,
        professionOrIndustry,
        hobbiesAndInterests,
        desiredQualities,
        gender,
        dateOfBirth,
				age,
        subscribed,
      } = req.body;
			
      if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "Please fill in all required fields." });
      }

      const userExists = await User.findOne({ where: { email } });
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&^]{8,15}$/;

      if (userExists) {
        return res.status(409).json({ message: `User ${firstName} already exists. You can log in with your password.` });
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
			
      const userRecord = await User.create({
				firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        country,
        stateOrProvince,
        stateOfOrigin,
        educationLevel,
        professionOrIndustry,
        hobbiesAndInterests,
        desiredQualities,
        gender,
        dateOfBirth,
				age,
        subscribed,
			});


      if (userRecord) {
        // Adjust as needed based on the primary key field in your model (e.g., id)
        const sanitizedUser = await User.findByPk(userRecord.userId, {
          attributes: { exclude: ["password"] },
        });
        return res.status(201).json({ message: `User ${firstName} created successfully`, user: sanitizedUser });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred!", error: err });
    }
  },

  getAllUsers: async (req: Request, res: Response) => {
    try {
      const allUsers = await User.findAll();
      if (!allUsers.length) {
        return res.status(404).json({ message: "No records found" });
      }
      return res.status(200).json({ message: "Records found", data: allUsers });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred while fetching users.", error: error });
    }
  },
};

export default userController;
