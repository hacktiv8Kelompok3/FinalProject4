const { Comment } = require('../models')

const authorizationComment = async (req, res, next) => {
 
    try {
        
        const CommentId = req.params.commentid
        const UserId = req.UserData.id
        const comment = await Comment.findOne({
            where: {
                id: CommentId
            }
        })

        console.log(comment);

        if (!comment) {
            return res.status(404).json({
                name : "Data not found",
                message : `Comment with id ${CommentId} not found`
            })
        }

        if (comment.UserId === UserId){
            return next()
        } else {
            return res.status(403).json({
                name : 'Authorization error',
                message : ` User with id ${UserId}  do not have permission with comment id ${CommentId}`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }

}

module.exports = authorizationComment