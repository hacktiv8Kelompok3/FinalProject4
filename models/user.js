'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require("../helpers/bcrypt")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Photo);
      this.hasMany(models.Comment);
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Full name can't be empty!"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          args: true,
          msg:"Format email not valid!"
        },
        notEmpty: {
          args: true,
          msg: "Email can't be empty!"
        },
      },
      unique: {
        args: true,
        msg: "Email already use!"
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Username can't be empty"
        }
      },
      unique: {
        args: true,
        msg: "Username already use!"
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          args: true,
          msg:"Password can't be empty"
        }
      }
    }, 
    profile_image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg:"Url can't be empty"
        },
        isUrl: {
          args: true,
          msg:"Format url not valid!"
        }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg:"Age can't be empty"
        },
        isNumeric: {
          args: true,
          msg:"Age must numeric"
        }
      }
    },
    phone_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg:"Phone Number  can't be empty"
        },
        isNumeric: {
          args: true,
          msg:"Phone number must be a number!"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, opt) => {
        const hashedPass = hashPassword(user.password)
        user.password = hashedPass
      },
      beforeUpdate: (user, opt) => {
        const hashedPass = hashPassword(user.dataValues.password)
        user.dataValues.password = hashedPass
      }
    }
  });
  return User;
};