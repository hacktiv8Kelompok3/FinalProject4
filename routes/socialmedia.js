const router = require("express").Router()
const socialMedia = require("../controllers/socialmediacontroller")
const authentication = require("../middleware/authentication")
const authorizationSosmed = require('../middleware/authorizationSosmed')


router.use(authentication)

router.get("/", socialMedia.getAllSosmed)
router.post("/create", socialMedia.createSosmed)
router.put("/:id", authorizationSosmed,socialMedia.updateSosmed)
router.delete("/:id", authorizationSosmed,socialMedia.deleteSosmed)

module.exports = router