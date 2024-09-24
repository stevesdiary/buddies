import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';
import User from './User';
import Quality from './Quality';

class UserQuality extends Model {}

UserQuality.init({
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  quality_id: {
    type: DataTypes.UUID,
    references: {
      model: Quality,
      key: 'quality_id',
    },
  },
}, {
  sequelize,
	tableName: 'user_qualities',
  modelName: 'UserQualities',
  timestamps: false,
});

export default UserQuality;
