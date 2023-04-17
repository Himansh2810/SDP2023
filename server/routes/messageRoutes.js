const { addMessage, getAllMessage, deleteMessage }=require("../controllers/messageController");

const router=require("express").Router();

router.post("/addmsg",addMessage);
router.post("/getmsg",getAllMessage);
router.post("/delmsg",deleteMessage);

module.exports = router;