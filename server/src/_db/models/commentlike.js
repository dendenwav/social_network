'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Comment, { foreignKey: 'id_comment' });
      this.belongsTo(models.User, { foreignKey: 'id_user' });
    }
  }
  CommentLike.init({
    id_user: DataTypes.INTEGER,
    id_comment: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CommentLike',
    underscored: true
  });
  return CommentLike;
};