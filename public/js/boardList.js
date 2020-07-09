var UserEmails,
    html = "",
    boardname,
    teamMembers = [];

var stepper = document.querySelector(".stepper");
var stepperInstace = new MStepper(stepper, {
    firstActive: 0,
});

$(document).ready(function () {
    $(".modal").modal();
    $(".tabs").tabs();

    $.get("/api/boardNames", function (data) {
        if (data.length == 0) {
            $("#stepper-card").show();
        } else {
            createCards(data, "cardContainer");
        }
    });

    $.get("/api/get-teamboard", (data) => {
        if (data.success) {
            createCards(data.success, "teamsContainer")
        } else if (data.message) { } else { }
    })

    $("#newBoard").on("click", () => {
        $("#stepper-card").show();
        $("#boardToggle").hide();
    });

    $.get('/api/fetchAllUsers', (data) => {
        if (data.length != 0) {
            UserEmails = data
            autocomplete(document.getElementById("members"), UserEmails);
        } else { }
    })

    $("body").on("click", ".ready", () => {
        window.location = "/board/board_list";
    });

    $("#boardName").keyup(() => {
        if ($("#boardName").val() == 0) {

            $(".boardname-submit").addClass("disabled")
            return false;
        } else {
            $(".boardname-submit").removeClass("disabled")
        }
    })

    $("body").on("click", ".boardname-submit", () => {
        $.post(
            "/api/create", {
            boardName: $(".boardName").val(),
        },
            (data) => {
                if (data.success) { } else if (data.error) {
                    swal("", data.error, "warning");
                } else if (data.message) {
                    swal("", data.message, "error")
                } else {
                    swal("", "Board not created", "error");
                }
            }
        );
    });

    $("#selectName").on("click", () => {
        var memberName = $("#members").val();
        teamMembers.push(memberName)
        var names = '';
        names += '<li>' + memberName + '</li>'
        $("#namesContainerUL").append(names)
        $("#members").val("")
    });

    function createCards(data, containerName) {
        data.forEach((element) => {
            boardname = element.boardName;
            var boardID = "board-" + generateRandomNumber();

            html += `
                  <div class="col m2" id = "${boardID}"> 
                  <div class="board-card blue-grey darken-1 card-size">

                  <a href="#" id="archive" title="Archive Board" board-name= "${boardname}" board-id = "${boardID}" ><i class="material-icons right white-text">archive</i></a>

                      <div class="board-card-content white-text">
                      <span class="board-card-title">${boardname}</span>
                      <a href = "#" title="Open Board" class = "board" board-title="${boardname}"><i
                    class="material-icons white-text">input</i></a>
                      </div>
                  </div>
                  </div>`;
        });
        $("#" + containerName).append(html);
        html = ""
        $(".board").click(function () {
            var board = $(this).attr('board-title')
            window.location = "/board?boardName=" + board;
        });
        $("#loader").hide()
        $("#teamBoard").show();
        $("#boardToggle").show()
    }
});


$("#submitTeamDetails").on("click", (e) => {
    e.preventDefault();
    $.post("/api/create-team", {
        teamName: $("#teamName").val(),
        members: teamMembers
    }, (data) => {
        if (data) { } else {
            console.log("error while saving the team members")
        }
    })
})

$("body").on("click", "#archive", function () {
    var boardname = $(this).attr("board-name")
    var boardId = ($(this).attr("board-id"))
    $.post(
        "/api/archive-board", {
        boardName: boardname,
    },
        (data) => {
            if (data.success) {
                $("#" + boardId).hide();
            } else { }
        }
    );
});

function generateRandomNumber() {
    const RANDOM_CONST = 10000000000000;
    return parseInt(Math.random() * RANDOM_CONST);
}
