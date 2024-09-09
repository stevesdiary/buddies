import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index";


class Admin extends Model {}

Admin.init({
	admin_id: {
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
	role: {
		type: DataTypes.ENUM('super', 'regular'),
		defaultValue: 'regular',
	},
}, {
		sequelize,
		modelName: 'Admin',
		tableName: 'admin',
});

export default Admin;