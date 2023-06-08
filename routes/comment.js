const router = require("express").Router()
const comment = require("../controllers/commentcontroller")
const authentication = require("../middleware/authentication")
const authorizationComment = require('../middleware/authorizationComment')

router.get("/", comment.getAllComments)
router.use(authentication)
router.post("/", comment.postComment)
router.put("/:commentid", authorizationComment, comment.updateComment)
router.delete("/:commentid", authorizationComment, comment.deleteComment)


module.exports = router