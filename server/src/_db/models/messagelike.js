'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessageLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Message, { foreignKey: 'id_message' });
      this.belongsTo(models.User, { foreignKey: 'id_user' });
    }
  }
  MessageLike.init({
    id_user: DataTypes.INTEGER,
    id_message: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MessageLike',
    underscored: true
  });
  return MessageLike;
};