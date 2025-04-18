require("dotenv").config();
const ErrorHandler = require("../middlewares/ErrorHandler");
const Note = require("../models/noteModel");
const userModel = require("../models/userModel");

const createNote = async (req, res, next) => {
    try {
        console.log("checking for req body", req.body)
        const user = req.user;
        const userid =  req.body.userId;

        const { title, content } = req.body;
        if (!title || !content) {
            next(new ErrorHandler(400, "Enter all the fields"));
        }
        console.log("checking for useriD", userid)

        const newNote = new Note({
            title,
            content,
            user: userid,
        });
        await newNote.save();
        // console.log(newNote);
        return res.status(200).json({
            newNote,
            msg: "Note created successfully",
            success: true,
        });

    } catch (error) {
        console.log("eror in create NOte note controller", error)
        next(error);

    }
}


    const getAllNotes = async (req, res, next) => {
        try {
            console.log(req.user)
            const user = req.user;
            const userid = req.headers.userid;
            console.log("checking for user ID", userid)

            const allNotes = await Note.find({ user: userid });

            console.log("checking for all notes", allNotes)

            res.status(200).json({
                allNotes,
                success: true,
                msg: "Notes Fetch Successfully"
            })
        } catch (error) {
            console.log("chekn for error to get all Notes", error)
            next(error);
        }
    };

    const editNotes = async (req, res, next) => {
        try {
            console.log("checking for req body", req.body)
            const { noteID, title, content } = req.body;

            if (!noteID) {
                next(new ErrorHandler(400, "id is required"));

            }

            const note = await Note.findById(noteID);
            if (!note) {
                next(new ErrorHandler(400, "No notes found with provided id"))
            }

            note.title = title;
            note.content = content;
            await note.save();
            return res.status(200).json({
                message: "Note updated successfully",
                note,
                success: true,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };



    const deleteNote = async (req, res, next) => {
        try {
          const noteId = req.params.id;
           console.log("checking with note id for deletion",noteId);
          if (!noteId) {
            next(new ErrorHandler(400, "No note available for this id"));
          }
          await Note.findByIdAndDelete(noteId);
          return res.status(200).json({
            msg: "Note deleted ",
            success: true,
            noteId,
          });
        } catch (error) {
          console.log(error);
          next(error);
        }
      };




module.exports = {
    createNote,
    getAllNotes,
    editNotes,
    deleteNote,
  };