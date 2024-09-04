import { Model, DataTypes, Optional, UUID } from "sequelize";
import { sequelize } from "./index";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

function calculateAge(dateOfBirth: Date): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

interface UserAttributes {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  country: string;
  stateOrProvince: string;
  stateOfOrigin: string;
  educationLevel: string;
  professionOrIndustry: string;
  hobbiesAndInterests: string;
  desiredQualities: string;
  gender: string;
  dateOfBirth: Date;
  age: number;
  subscribed: boolean;
}

// Optional fields for creation
interface UserCreationAttributes extends Optional<UserAttributes, "userId"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public userId!: string;
  public firstName!: string;
  public lastName!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public country!: string;
  public stateOrProvince!: string;
  public stateOfOrigin!: string;
  public gender!: string;
  public dateOfBirth!: Date;
  public age!: number;
  public educationLevel!: string;
  public professionOrIndustry!: string;
  public hobbiesAndInterests!: string;
  public desiredQualities!: string;
  public subscribed!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Password Hashing
  // async setPassword(password: string) {
  //   const salt = await bcrypt.genSalt(10);
  //   this.password = await bcrypt.hash(password, salt);
  // }

  // Password Match
  // async matchPassword(enteredPassword: string): Promise<boolean> {
  //   return await bcrypt.compare(enteredPassword, this.password);
  // }
}

User.init(
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    firstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
    lastName: {
			type: DataTypes.STRING,
			allowNull: false
		},
    username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
    email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
    password: {
			type: DataTypes.STRING,
			allowNull: false
		},
    country: {
			type: DataTypes.STRING,
			allowNull: false
		},
    stateOrProvince: {
			type: DataTypes.STRING,
			allowNull: false
		},
    gender: {
			type: DataTypes.STRING,
			allowNull: false
		},
    dateOfBirth: {
			type: DataTypes.DATE,
			allowNull: false
		},
    age: { type:
			DataTypes.NUMBER,
			allowNull: false
		},
    subscribed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    stateOfOrigin: {
			type: DataTypes.STRING,
			allowNull: false
		},
    educationLevel: {
			type: DataTypes.STRING,
			allowNull: false
		},
    professionOrIndustry: {
			type: DataTypes.STRING,
			allowNull: false
		},
    hobbiesAndInterests: {
			type: DataTypes.STRING,
			allowNull: false
		},
    desiredQualities: {
			type: DataTypes.STRING,
			allowNull: false
		},
  },
  {
    sequelize,
		tableName: "User",
    modelName: "User",
    hooks: {
      beforeCreate: async (user: User) => {
        // await user.setId(user.id)
        // await user.setPassword(user.password);
      },
    },
  }
);

export default User;
