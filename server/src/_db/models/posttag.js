'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Tag, { foreignKey: 'id_tag' });
      this.belongsTo(models.Post, { foreignKey: 'id_post' });
    }
  }
  PostTag.init({
    id_tag: DataTypes.INTEGER,
    id_post: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PostTag',
    underscored: true
  });
  return PostTag;
};