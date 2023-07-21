'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessageSelectedFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.SelectedFile, { foreignKey: 'id_selected_file' });
      this.belongsTo(models.Message, { foreignKey: 'id_message' });
    }
  }
  MessageSelectedFile.init({
    id_selected_file: DataTypes.INTEGER,
    id_message: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MessageSelectedFile',
    underscored: true
  });
  return MessageSelectedFile;
};