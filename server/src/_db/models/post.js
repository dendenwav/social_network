'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'id_author' });
      this.hasMany(models.Comment, { foreignKey: 'id_post' });
      this.hasMany(models.PostLike, { foreignKey: 'id_post' });
      this.hasMany(models.PostSelectedFile, { foreignKey: 'id_post' });
      this.hasMany(models.PostTag, { foreignKey: 'id_post' });
    }
  }
  Post.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    id_author: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
    underscored: true
  });
  return Post;
};