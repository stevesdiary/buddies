import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';
import User from './User';
import Interest from './Interest';

class UserInterest extends Model {}

UserInterest.init({
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  interest_id: {
    type: DataTypes.UUID,
    references: {
      model: Interest,
      key: 'interest_id',
    },
  },
}, {
  sequelize,
	tableName: 'user_interests',
  modelName: 'UserInterest',
  timestamps: false,
});

export default UserInterest;
