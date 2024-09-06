// import { Model, DataTypes, Optional, UUID } from "sequelize";
// import { sequelize } from "./index";
// import bcrypt from "bcryptjs";
// import { v4 as uuid } from "uuid";

// models/User.ts
import { DataTypes, Model, Sequelize, UUID } from 'sequelize';
import { sequelize } from './index';  // Adjust the import according to your project structure

class User extends Model {}

// Define the User model with correct data types
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
  },
  age: {
    type: DataTypes.INTEGER,  // Corrected to INTEGER for MySQL compatibility
  },
  education_level: {
    type: DataTypes.STRING,
  },
  profession: {
    type: DataTypes.STRING,
  },
  hobbies_and_interests: {
    type: DataTypes.JSON,  // Can also use DataTypes.ARRAY(DataTypes.STRING) for PostgreSQL
  },
  qualities: {
    type: DataTypes.JSON,  // Can also use DataTypes.ARRAY(DataTypes.STRING) for PostgreSQL
  },
  subscribed: {
    type: DataTypes.TINYINT,
    defaultValue: false,
  },
}, {
  sequelize,  // Pass the connection instance
  modelName: 'User',
  tableName: 'users',
});

export default User;

