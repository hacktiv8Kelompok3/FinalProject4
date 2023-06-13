const { Comment, Photo, User } = require("../models");

class commentcontroller {
  static async getAllComments(req, res) {
    try {
      const comments = await Comment.findAll({
        include: [
          {
            model: Photo,
            attributes: ["id", "title", "caption", "poster_image_text"],
          },
          {
            model: User,
            attributes: ["id", "username", "profile_image_url", "phone_number"],
          },
        ],
      });

      res.status(200).json(comments);
    } catch (error) {
      res.status(400).json(error);
      console.log(error);
    }
  }

  static async postComment(req, res) {
    try {
      const { comment, PhotoId } = req.body;

      const { id } = req.UserData;

      const data = await Comment.create({
        comment,
        UserId: id,
        PhotoId,
      });

      if (!data) {
        throw {
          code: 404,
          message: "kolom tidak boleh kosong",
        };
      }

      const response = {
        id: data.id,
        comment: data.comment,
        UserId: data.UserId,
        PhotoId: data.PhotoId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      res.status(201).send(response);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const validasiErorr = {};
        error.errors.map((er) => {
          validasiErorr[er.path] = er.message;
        });
        return res.status(400).json({ error: validasiErorr });
      } else {
        res.status(error?.code || 500).json(error);
      }
    }
  }

  static async updateComment(req, res) {
    try {
      const { commentid } = req.params;
      const { comment } = req.body;

      const [numAffectedRows, affectedRows] = await Comment.update(
        {
          comment,
        },
        {
          where: {
            id: commentid,
          },
          returning: true,
        }
      );

      if (numAffectedRows === 0) {
        res.status(404).json({ error: "Comment not found" });
      } else {
        const updatedComment = affectedRows[0].toJSON();
        res.status(200).json({ comment: updatedComment });
      }
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError" ||
        error.name === "SequelizeForeignKeyConstraintError"
      ) {
        const validasiErorr = {};
        error.errors.map((er) => {
          validasiErorr[er.path] = er.message;
        });
        return res.status(400).json({ error: validasiErorr });
      } else {
        res.status(error?.code || 500).json(error);
      }
    }
  }

  static async deleteComment(req, res) {
    try {
      const { commentid } = req.params;

      const data = await Comment.destroy({
        where: {
          id: commentid,
        },
      });

      res
        .status(200)
        .send({ message: "your comment has been successfully deleted" });
    } catch (error) {}
  }
}

module.exports = commentcontroller;
