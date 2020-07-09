$(document).ready(function () {
    setTimeout(function () { $('#editTaskModal').scrollTop(0); }, 50)
});

$("#signup-submit").on('click', () => {
    window.location = "/signup"
})
$("#login-submit").on('click', function () {
    submitUserData();
})

function submitUserData() {
    if (document.getElementById("email").value.length == 0) {
        swal("", "Email cannot be left blank", "warning")
        return false;
    }
    if (document.getElementById("password").value.length == 0) {
        swal("", "Password cannot be left blank", "warning")
        return false;
    }
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var email = $("#email").val();
    if (emailRegex.test(email) == false) {
        swal("", "Please enter a valid email id", "error")
        return false
    }

    $("#login-submit").addClass("disabled")
    $.post('/user-login', {
        "email": $('#email').val(),
        "password": $('#password').val()
    }, function (data) {
        if (data.success) {
            window.location = "/board/board_list"
        } else if (data.message) {
            windowConfirmBox({
                icon: "error",
                type: "error",
                onConfirm: function () {
                    window.location.reload()
                },
                message: data.message
            });
        } else {
            swal("", "Error", "Error")
        }
    })
}

$("#password, #email").on({
    keyup: function (e) {
        if (e.which == 13) {
            submitUserData();
        }
    }
});

function windowConfirmBox(params) {
    var html = '';
    var icon = '';
    var cancel;
    confirmfunc = params.onConfirm || (function () { });
    cancelfunc = params.onCancel || (function () { });
    switch (params.type) {
        case "confirm":
            icon = "warning";
            cancel = true;
            break;
        case "error":
            icon = "error";
            cancel = false;
            break;
        case "success":
            icon = "success";
            cancel = false;
            break;
    }
    swal({
        title: params.title,
        text: params.message,
        icon: icon,
        buttons: {
            cancel: cancel,
            ok: true
        },
    })
        .then(function (proceed) {
            if (!cancel || proceed) {
                confirmfunc();
            } else {
                cancelfunc();
            }
        });
}