'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'UserId' });
      this.hasMany(models.Comment);
    }
  }
  Photo.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "kolom tidak boleh kosong"
        }
      }
    },
    caption: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          args: true,
          msg: "caption tidak boleh kosong"
        }
      }
    },
    poster_image_text: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          args: true,
          msg: "poster email tidak boleh kosong atau harus terisi"
        },
        isUrl: {
          args: true,
          msg: "URL TIDAK BENAR"
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};