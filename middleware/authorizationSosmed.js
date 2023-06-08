const { SocialMedia } = require('../models')

const authorizationComment = async (req, res, next) => {
 
    try {
        
        const SosmedId = req.params.id
        const UserId = req.UserData.id
        const sosmed = await SocialMedia.findOne({
            where: {
                id: SosmedId
            }
        })

        console.log(sosmed);

        if (!sosmed) {
            return res.status(404).json({
                name : "Data not found",
                message : `Photo with id ${SosmedId} not found`
            })
        }

        if (sosmed.UserId === UserId){
            return next()
        } else {
            return res.status(403).json({
                name : 'Authorization error',
                message : ` User with id ${UserId}  do not have permission with sosmed user id ${SosmedId}`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }

}

module.exports = authorizationComment