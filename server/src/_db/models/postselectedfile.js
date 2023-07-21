'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostSelectedFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.SelectedFile, { foreignKey: 'id_selected_file' });
      this.belongsTo(models.Post, { foreignKey: 'id_post' });
    }
  }
  PostSelectedFile.init({
    id_selected_file: DataTypes.INTEGER,
    id_post: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PostSelectedFile',
    underscored: true
  });
  return PostSelectedFile;
};