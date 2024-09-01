import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from './index';
import bcrypt from 'bcryptjs';

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
  id: number;
  username: string;
  email: string;
  password: string;
	country: string;
	stateOrProvince: string;
	role: string;
	gender: string;
	dateOfBirth: Date;
	age: number;
	subscribed: boolean;
}

// Optional fields for creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
	public country!: string;
	public stateOrProvince!: string;
	public role!: string;
	public gender!: string;
	public dateOfBirth!: Date;
	public age!: number;
	public subscribed!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Password Hashing
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);
  }

  // Password Match
  async matchPassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

User.init({
	id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	username: { type: DataTypes.STRING, allowNull: false, unique: true },
	email: { type: DataTypes.STRING, allowNull: false, unique: true },
	password: { type: DataTypes.STRING, allowNull: false },
	country: { type: DataTypes.STRING, allowNull: false },
	stateOrProvince: { type: DataTypes.STRING, allowNull: false },
	role: { type: DataTypes.STRING, allowNull: false },
	gender: { type: DataTypes.ENUM, allowNull: false },
	dateOfBirth: '',
	age: '',
	subscribed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  sequelize,
  modelName: 'User',
  hooks: {
    beforeCreate: async (user: User) => {
      await user.setPassword(user.password);
    }
  }
});

export default User;
