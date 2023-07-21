'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Post, { foreignKey: 'id_author' });
      this.hasMany(models.Followers, { foreignKey: 'id_follower' });
      this.hasMany(models.Followers, { foreignKey: 'id_user' });
      this.hasMany(models.Following, { foreignKey: 'id_following' });
      this.hasMany(models.Following, { foreignKey: 'id_user' });
      this.hasMany(models.Message, { foreignKey: 'id_author' });
      this.hasMany(models.Message, { foreignKey: 'id_receiver' });
      this.hasMany(models.Comment, { foreignKey: 'id_user' });
      this.hasMany(models.CommentLike, { foreignKey: 'id_user' });
      this.hasMany(models.MessageLike, { foreignKey: 'id_user' });
      this.hasMany(models.PostLike, { foreignKey: 'id_user' });
    }
  }
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    pseudo: {
      type: DataTypes.STRING,
      unique: true
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    cover_picture: DataTypes.STRING,
    is_admin: DataTypes.BOOLEAN,
    description: DataTypes.STRING,
    city: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    underscored: true
  });
  return User;
};