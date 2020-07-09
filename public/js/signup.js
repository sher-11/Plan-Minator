$("#submit-signup").on('click', function () {
    submitUserData();
});

function submitUserData() {
    if (document.getElementById("username").value.length == 0) {
        swal("", "Username cannot be left blank", "warning")
        return false;
    }
    if (document.getElementById("email").value.length == 0) {
        swal("", "Email cannot be left blank", "warning")
        return false;
    }
    if (document.getElementById("password").value.length == 0) {
        swal("", "Password cannot be left blank", "warning")
        return false;
    }
    if (document.getElementById("confirm-password").value.length == 0) {
        swal("", "Confirm Password cannot be left blank", "warning")
        return false;
    }
    if ($('#password').val() !== $('#confirm-password').val()) {
        swal("", "Password entered do not match", "error")
        return false;
    }
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var email = $("#email").val();
    if (emailRegex.test(email) == false) {
        swal("", "Please enter a valid email id", "error")
        return false
    }
    $("#submit-signup").addClass("disabled")
    $.post('/signup/user-details', {
        "username": $('#username').val(),
        "email": $('#email').val(),
        "password": $('#password').val(),
        "confirmPassword": $('#confirm-password').val()
    }, function (data) {
        if (data._id) {
            windowConfirmBox({
                icon: "success",
                type: "success",
                onConfirm: function () {
                    window.location = "/"
                },
                message: "User successfully signed Up"
            });
        } else {
            if (data.message) {
                windowConfirmBox({
                    icon: "error",
                    type: "error",
                    onConfirm: function () { },
                    message: data.message
                });
                $('#submit-signup').removeClass('disabled')

            } else {
                windowConfirmBox({
                    icon: "error",
                    type: "error",
                    onConfirm: function () { },
                    message: "Same username already exists"
                });
                $('#submit-signup').removeClass('disabled')
            }
        }
    });
};

$("#confirm-password,#password, #username, #email").on({
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