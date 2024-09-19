import { DataTypes, Model } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from './index';


class Quality extends Model {}
Quality.init({
	quality_id: {
		type: DataType.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey:true
	},
	quality: {
		type: DataType.STRING,
		allowNull: false
	}
}, {
	sequelize,
	modelName: 'Quality',
	tableName: 'qualities',
	paranoid: true,
});

export default Quality;