'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Photo, { foreignKey: "PhotoId" });
      this.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Comment.init({
    comment: {
      type : DataTypes.TEXT,
      validate : {
        notEmpty : {
          args: true,
          msg: "comment tidak boleh kosong"
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,

    },
    PhotoId: {
      type:DataTypes.INTEGER,
      validate: {
        notEmpty : {
          args: true,
          msg: "PhotoId tidak boleh kosong"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};