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

router.get("/boardNames", async (req, res) => {
    try {
        var whatToFind = {
            createdBy: req.session.email,
            archived: false
        }
        await Board.find(whatToFind,
            function (err, data) {
                if (data) {
                    res.send(data);
                } else {
                    throw next(err);
                }
            }
        );
    } catch (err) {
        res.send({
            message: "Error occured"
        });
    }
});


router.get("/get-teamboard", (req, res, next) => {
    var arrayBoardID = [];
    try {
        var whomToFind = {
            "members": {
                "$in": [req.session.email]
            }
        }
        async.waterfall([
            function (callback) {
                Team.find(whomToFind,
                    function (err, team) {
                        if (err) return next(err);
                        callback(null, team);
                    }
                );
            },
            (team, callback) => {
                team.forEach((elem) => {
                    arrayBoardID.push(elem.boardID)
                })
                var toFind = {
                    _id: {
                        "$in": arrayBoardID
                    },
                    archived: false
                }
                Board.find(toFind, function (err, data) {
                    res.json({
                        success: data
                    })
                })
            },
        ]);
    } catch (err) {
        res.send({
            message: "An error occured"
        });
    }
});

router.post("/create", async (req, res, next) => {
    try {
        var body = req.body.boardName;
        var email = req.session.email;
        await Board.findOne({
            boardName: body,
            archived: false
        },
            function (err, data) {
                if (data) {
                    res.send({
                        error: "Board name already exists"
                    });
                } else {
                    var board = new Board();
                    board.boardName = body;
                    board.createdBy = email;
                    board.save(function (err, data) {
                        if (err) return next(err);
                        req.session.boardID = data._id
                        res.send({
                            success: data
                        });
                    });
                }
            }
        );
    } catch (err) {
        res.send({
            message: "Error occured"
        });
    }
});

router.post("/create-team", (req, res) => {
    try {
        var teamName = req.body.teamName;
        var members = req.body.members
        Team.find({
            teamName: teamName
        }, (err, data) => {
            if (data.length != 0) {
                console.log("team with same name exists")
            } else {
                var team = new Team()
                team.teamName = teamName;
                team.members = members;
                team.boardID = req.session.boardID
                team.save((err, data) => {
                    if (err) throw (err)
                    res.send(data)
                })
            }
        })

    } catch (error) {
        res.json({
            message: "An error occured"
        })
    }
})

router.get("/list", (req, res, next) => {
    var counter = 0;
    var responseBody = {};
    try {
        var findQuery = req.session.boardName;
        async.waterfall([
            function (callback) {
                Board.findOne({
                    boardName: findQuery,
                },
                    function (err, board) {
                        if (err) return next(err);
                        callback(null, board);
                    }
                );
            },
            (board, callback) => {
                var whatToFind = {
                    boardID: board._id
                }
                List.find(whatToFind, function (err, data) {
                    data.forEach((n) => {
                        var whereToFind = {
                            listID: n._id,
                            archived: false
                        };
                        Task.find(whereToFind, (err, result) => {
                            if (result.length == 0) {
                                responseBody[n.listName] = [];
                                console.log("no tasks found");
                            } else {
                                var taskArray = [];
                                result.forEach((elem) => {
                                    taskArray.push(elem.taskName);
                                    responseBody[n.listName] = taskArray;
                                });
                            }
                            if (++counter == data.length) {
                                res.send(responseBody);
                            }
                        });
                    });
                }).sort([
                    ["createdAt", 1]
                ]);
            },
        ]);
    } catch (err) {
        res.send({
            message: "Error occured"
        });
    }
});

router.post("/save_list", async (req, res) => {
    try {
        var boardName = req.session.boardName;
        async.waterfall([
            function (callback) {
                Board.findOne({
                    boardName: boardName,
                },
                    function (err, board) {
                        if (err) return next(err);
                        callback(null, board);
                    }
                );
            },
            async (board, callback) => {
                var list = new List();
                list.boardID = board._id;
                list.listName = req.body.listName;
                list.createdBy = req.session.email;
                await list.save((err, data) => { });
            },
        ]);
    } catch (err) {
        res.send({
            message: "Error occured"
        });
    }
});

router.post("/save_task", async (req, res) => {
    try {
        var listName = req.body.listName;
        async.waterfall([
            function (callback) {
                List.findOne({
                    listName: listName,
                },
                    function (err, list) {
                        if (err) return next(err);
                        callback(null, list);
                    }
                );
            },
            async (list, callback) => {
                var task = new Task();
                var taskHistory = [];
                taskHistory.push(`Task- ${req.body.taskName}, created by ${req.session.username}`)
                task.listID = list._id;
                task.taskName = req.body.taskName;
                task.createdBy = req.session.email;
                task.taskHistory = taskHistory;
                await task.save((err, data) => {
                    res.send(data);
                });
            },
        ]);
    } catch (err) {
        res.send({
            message: "Error occured"
        });
    }
});

router.post("/update-taskDetails", async (req, res) => {
    try {
        var findBy = req.body.presentTaskName;

        Task.findOneAndUpdate({
            taskName: findBy
        },
            req.body,
            async (err, data) => {
                res.json({
                    success: data
                })
            }
        );
    } catch (error) {
        res.send({
            message: "Error occured"
        });
    }
});

router.get("/fetchTaskDetails", (req, res) => {
    try {
        var taskname = req.query.taskName;
        Task.find({
            taskName: taskname
        }, (err, data) => {
            if (data) {
                var canArchive = req.session.email == data[0].createdBy;
                var canEdit;
                if (data[0].assignedTo != "" && data[0].assignedTo != undefined) {
                    if (data[0].assignedTo == req.session.email) {
                        canEdit = true;
                    } else {
                        canEdit = false;
                    }
                } else {
                    canEdit = true
                }
                res.json({
                    data: data,
                    canArchive: canArchive,
                    canEdit: canEdit
                });
            } else {
                console.log("Failed to fetch the task");
            }
        });
    } catch (error) {
        res.send({
            message: "Error occured"
        });
    }
});

router.post("/archive-task", (req, res) => {
    try {
        var whereToFind = {
            taskName: req.body.taskName,
        };
        var whatToUpdate = {
            archived: req.body.archive,
        };
        Task.findOneAndUpdate(whereToFind, whatToUpdate, (err, data) => {
            if (data) {
                res.json({
                    success: "Archived successfully"
                });
            } else {
                res.json({
                    message: "Unable to archive"
                });
            }
        });
    } catch (error) {
        res.send({
            message: "Error occured"
        });
    }
});

router.get("/fetchArchivedTask", (req, res) => {
    try {
        var whatToFetch = {
            archived: true,
        };
        Task.find(whatToFetch, (err, data) => {
            if (data) {
                res.send({
                    success: data
                });
            } else {
                res.send({
                    message: "Error"
                });
            }
        });
    } catch (error) {
        res.send({
            message: "Error occured"
        });
    }
});

router.post("/archive-list", (req, res) => {
    try {
        var whatToFind = {
            listName: req.body.listName,
            createdBy: req.session.email,
            archived: true,
        };
        List.find(whatToFind, (err, data) => {
            if (data.length == 0) {
                res.send({
                    message: "no list exists"
                });
            } else {
                console.log("data found");
            }
        });
    } catch {
        res.send({
            message: "error"
        });
    }
});

router.post("/archive-board", (req, res) => {
    try {
        let whatToFind = {
            boardName: req.body.boardName,
        };
        let whatToUpdate = {
            archived: true,
        };
        Board.findOneAndUpdate(whatToFind, whatToUpdate, (err, data) => {
            if (data) {
                res.json({
                    success: "Board deleted"
                })
            } else {
                res.json({
                    error: "Unable to delete the board"
                })
            }
        });
    } catch (error) {
        res.send({
            message: "Error occured"
        });
    }
});

router.get("/fetchAllUsers", (req, res) => {
    try {
        var users = [];
        User.find({}, (err, data) => {
            if (data.length == 0) {
                console.log("No user found")
            } else {
                data.forEach((elem) => {
                    users.push(elem.email)
                })
                res.send(users)
            }
        })
    } catch (error) {
        res.send({
            message: "Error occured"
        })
    }
})

module.exports = router;