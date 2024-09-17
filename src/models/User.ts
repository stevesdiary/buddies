import { DataTypes, Model, Sequelize, UUID } from 'sequelize';
import { sequelize } from './index';

class User extends Model {
	// date_of_birth: string | number | Date;
	// age: number;
}
User.init({
  user_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
  },
  state_or_province: {
    type: DataTypes.STRING,
  },
  state_of_origin: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.STRING,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
  },
  education_level: {
    type: DataTypes.STRING,
  },
  profession: {
    type: DataTypes.STRING,
  },
  hobbies_and_interests: {
    type: DataTypes.JSON,
  },
  qualities: {
    type: DataTypes.JSON,
  },
  subscribed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  role: {
    type: DataTypes.ENUM,
    values: ['basic', 'premium'],
    defaultValue: 'basic'
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  // paranoid: true,
});

export default User;

