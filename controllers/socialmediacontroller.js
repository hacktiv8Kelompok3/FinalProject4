const { SocialMedia } = require("../models")

class socialmediaController{
    static async getAllSosmed(req, res) {
        try {
            const { id } = req.UserData

            const data = await SocialMedia.findAll({
                where: {
                    UserId: id
                }
            })

            res.status(200).json(data)
        } catch (error) {
            res.status(400).json(error)
        }
    }

    static async createSosmed(req, res) {
        try {
            const {
                name,
                social_media_url
            } = req.body

            const { id } = req.UserData

            const data = await SocialMedia.create({
                name,
                social_media_url,
                UserId: id
            })
            if(!data) {
                throw {
                    code: 404,
                    msg: "data tidak boleh kosong"
                }
            }

            const response = {
                id: data.id,
                name: data.name,
                social_media_url: data.social_media_url,
                UserId: id
            }

            res.status(200).json(response)
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const validasiErorr = {};
                error.errors.map((er) => {
                    validasiErorr[er.path] = er.message;
                });
                return res.status(400).json({"error":validasiErorr});
            }else{
                res.status(error?.code || 500).json(error)
            }
        }
    }

    static async updateSosmed(req, res) {
        try {
            const { id } = req.params

            const { 
                name,
                social_media_url
            } = req.body

            const data = await SocialMedia.update({
                name,
                social_media_url
            }, {
                where: {
                    id
                }, returning: true
            })
            if(!data) {
                throw {
                    code: 404,
                    message: "Data tidak di temukan"
                }
            }
            const userView = {
                id:data[1][0].id,
                name: data[1][0].name,
                social_media_url: data[1][0].social_media_url,
                UserId: data[1][0].UserId,
                createdAt: data[1][0].createdAt,
                updatedAt: data[1][0].updatedAt
            }
            res.status(200).json({"social_media":userView}) 
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const validasiErorr = {};
                error.errors.map((er) => {
                    validasiErorr[er.path] = er.message;
                });
                return res.status(400).json({"error":validasiErorr});
            }else{
                res.status(error?.code || 500).json(error)
            }
        }
    }

    static async deleteSosmed(req, res) {
        try {
            const { id } = req.params

            const data = await SocialMedia.destroy({
                where: {
                    id
                }
            })

            res.status(200).json({
                message: `Data ${id} Berhasil di hapus`
            })
        } catch (error) {
            res.status(400).json(error)
        }
    }
}

module.exports = socialmediaController