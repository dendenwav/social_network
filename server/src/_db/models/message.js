'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'id_author' });
      this.belongsTo(models.User, { foreignKey: 'id_receiver' });
      this.hasMany(models.MessageSelectedFile, { foreignKey: 'id_message' });
      this.hasMany(models.MessageLike, { foreignKey: 'id_message' });
      
    }
  }
  Message.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    id_author: DataTypes.INTEGER,
    id_receiver: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Message',
    underscored: true
  });
  return Message;
};