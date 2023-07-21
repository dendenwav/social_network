'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SelectedFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.MessageSelectedFile, { foreignKey: 'id_selected_file' });
      this.hasMany(models.PostSelectedFile, { foreignKey: 'id_selected_file' });
    }
  }
  SelectedFile.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: DataTypes.STRING,
    extension: DataTypes.STRING,
    size: DataTypes.FLOAT,
    data: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SelectedFile',
    underscored: true
  });
  return SelectedFile;
};