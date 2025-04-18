const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { authVerifyToken } = require("../middlewares/authVerifyToken");

router.post("/create_note", authVerifyToken, noteController.createNote);
router.get("/get_Notes", authVerifyToken, noteController.getAllNotes);
router.delete("/delete_note/:id", authVerifyToken, noteController.deleteNote);
router.post("/edit_note", authVerifyToken, noteController.editNotes);

module.exports = router;