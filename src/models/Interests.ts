import { DataTypes, Model } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from './index';


class Interest extends Model {}
Interest.init({
	interest_id: {
		type: DataType.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey:true
	},
	interest: {
		type: DataType.STRING,
		allowNull: false
	}
}, {
	sequelize,
	modelName: 'Interest',
	tableName: 'interests',
	paranoid: true,
});

export default Interest