'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Post, { foreignKey: 'id_post' });
      this.belongsTo(models.User, { foreignKey: 'id_user' });
    }
  }
  PostLike.init({
    id_user: DataTypes.INTEGER,
    id_post: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PostLike',
    underscored: true
  });
  return PostLike;
};