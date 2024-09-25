import { DataTypes, Model } from "sequelize";
import { sequelize } from './index';


class Quality extends Model {}
Quality.init({
	quality_id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey:true
	},
	quality: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	sequelize,
	modelName: 'Quality',
	tableName: 'qualities',
	paranoid: true,
});

export default Quality;