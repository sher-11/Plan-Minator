var express = require("express");
var router = express.Router();
var Board = require("../models/board");
var List = require("../models/list");
var Task = require("../models/task");
var User = require("../models/user")
var Team = require("../models/team");
var async = require("async");

var isAuthenticated = require("../middlewares/middleware")
router.use(isAuthenticated.sessionCheck())


router.get("/", async (req, res) => {
    try {
        console.log("query", req.query)
        let boardName = req.query.boardName
        var whatToFind = {
            boardName: boardName,
            archived: false
        }
        req.session.boardName = boardName;
        Board.findOne(whatToFind, (err, data) => {
            console.log(data)
            if (data.length != 0) {
                res.render("board", { boardName: boardName });
            } else {
                res.render("error")
            }

        })

    } catch (err) {
        res.send({ message: "Failed to load the board" });
    }
});


router.get("/board_list", (req, res, next) => {
    res.render("boardList");
});

router.get("/about", (req, res) => {
    res.send("Welcome to My Planner app");
});

module.exports = router;
