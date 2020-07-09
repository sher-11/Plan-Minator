var TaskInputName,
	ExtractTaskID,
	ArchiveListName,
	taskID,
	canArchive,
	canEdit;

$(document).ready(function () {
	$(".modal").modal();
	$("select").formSelect();
	$(".sidenav").sidenav();
	$("#listModal").modal({
		onOpenEnd: function () {
			$("#listName, #taskName").focus();
			$("#listName, #taskName").val("");
		},
	});
	$(".sidenav").sidenav({
		edge: "right"
	});

	$.get("/api/list", function (data) {
		if (!data) { } else {
			for (var i in data) {
				dynamicList(i, data[i]);
			}
		}
	});
});

function dynamicList(listName, taskArray) {
	ArchiveListName = listName;
	var listHtml = "";
	var listContainerID = "list-" + generateRandomNumber();
	var listBody = "listBody-" + generateRandomNumber();
	var taskTilteID = "tasktitle-" + generateRandomNumber();
	listHtml +=
		'<div class="board-list" ondrop="dropIt(event)" ondragover="allowDrop(event)" id = "' +
		listContainerID +
		'"><div class="list-title">' +
		listName +
		'<a href="#" class="black-text right list-archive" list-header="' +
		listName +
		'" list-headerID= "' +
		listContainerID +
		'"><i class="material-icons">archive</i></a></div><div id ="' +
		listBody +
		'" class="add-task" ></div><div>';

	listHtml +=
		'<a href = "#"><div class = "add-card" style="display:block">+ Add another card</div></a>';

	listHtml +=
		'<div style= "display:none" class ="task-creator" ><textarea id ="' +
		taskTilteID +
		'" class="list-card-composer-textarea task-title" dir="auto" autofocus placeholder="Enter a title.." style="overflow: hidden; overflow-wrap: break-word; resize: none; height: 54px;"></textarea><div><a parent ="' +
		listName +
		'" class= "create-task waves-effect waves-light btn left" style="margin-left:73px" appendID="' +
		listBody +
		'">Create</a><a class = "waves-effect waves-light btn hide-inputDiv right"> Close</a></div><div>';

	listHtml += "</div></div>";

	$("#boardlists").append(listHtml);
	listHtml = "";
	if (taskArray.length != 0) {
		taskArray.forEach((elem) => {
			addTask(elem, listBody);
		});
	}
}

function addTask(task, titleID) {
	taskID = "task-" + generateRandomNumber();
	var taskHtml = "";
	taskHtml +=
		'<div  id="' +
		taskID +
		'" class="card add-task" draggable="true" taskName="' +
		task +
		'" ondragstart="dragStart(event)" >' +
		task +
		'<a class="edit-task" href="#"><i class="material-icons right black-text" >create</i></a></div>';
	$("#" + titleID + "").append(taskHtml);
}

$("#submitListName").click(function () {
	var listName = $("#listName").val();
	if (listName != "") {
		addList(listName);
		$("#listName").val("");
	} else {
		alert("List Name empty");
	}
});

function addList(listName) {
	ArchiveListName = listName;
	var listHtml = "";
	var listContainerID = "list-" + generateRandomNumber();
	var listBody = "listBody-" + generateRandomNumber();
	var taskTilteID = "tasktitle-" + generateRandomNumber();
	listHtml +=
		'<div class="board-list" ondrop="dropIt(event)" ondragover="allowDrop(event)" id = "' +
		listContainerID +
		'"><div class="list-title">' +
		listName +
		'<a href="#" class="black-text right list-archive" list-header="' +
		listName +
		'" list-headerID= "' +
		listContainerID +
		'" ><i class="material-icons">archive</i></a></div><div id ="' +
		listBody +
		'" class="add-task" ></div><div>';

	listHtml +=
		'<a href = "#"><div class = "add-card" style="display:block">+ Add another card</div></a>';

	listHtml +=
		'<div style= "display:none" class ="task-creator"><textarea id ="' +
		taskTilteID +
		'" class="list-card-composer-textarea task-title" dir="auto" autofocus placeholder="Enter a title.." style="overflow: hidden; overflow-wrap: break-word; resize: none; height: 54px;"></textarea><div><a parent ="' +
		listName +
		'" class= "create-task waves-effect waves-light btn left" style="margin-left:73px" appendID="' +
		listBody +
		'">Create</a><a class = "waves-effect waves-light btn hide-inputDiv right"> Close</a></div><div>';

	listHtml += "</div></div>";

	$("#boardlists").append(listHtml);
	listHtml = "";
	$.post(
		"/api/save_list", {
		listName: listName,
	},
		(data) => {
			if (!data) {
				swal("", "failed to save the list", "error");
			}
		}
	);
}

$("body").on("click", ".add-card", function () {
	$(this).hide();
	$(this).parent().siblings().show();
});

$("body").on("click", ".create-task", function () {
	var titleID = $(this).parent().siblings().attr("id");
	var taskTitle = $("#" + titleID).val();
	if (taskTitle != "") {
		var attr = $(this).attr("appendID");
		taskID = "task-" + generateRandomNumber();
		var taskHtml = "";
		taskHtml +=
			'<div  id="' +
			taskID +
			'" class="card add-task" draggable="true" taskName="' +
			taskTitle +
			'"  ondragstart="dragStart(event)">' +
			taskTitle +
			'<a class="edit-task" href="#"><i class="material-icons right black-text" >create</i></a></div>';
		$("#" + attr + "").append(taskHtml);
		$("#" + titleID).val("");
		$(".task-creator").hide();
		$(".add-card").show();
		$.post(
			"/api/save_task", {
			taskName: taskTitle,
			listName: $(this).attr("parent"),
		},
			(data) => {
				if (!data) {
					swal("", "Failed to save the task", "error");
				}
			}
		);
	} else {
		swal("", "Empty task can not be created", "warning");
	}
});

$("body").on("click", ".hide-inputDiv", function () {
	var titleID = $(this).parent().siblings().attr("id");
	$("#" + titleID).val("");
	$(".task-creator").hide();
	$(".add-card").show();
});

$("body").on("click", ".edit-task", function () {
	setTimeout(function () { $('.modal-task').scrollTop(0); }, 50)
	let title = $(this).parent().attr("taskName");
	ExtractTaskID = $(this).parent().attr("id");
	$("#task").val(title);
	TaskInputName = title;
	fetchTaskDetails(TaskInputName);
	$("#editTaskModal").modal("open");
});

$("#taskName").on("click", function () {
	$(this).prop("readonly", false);
});

$("#listName").on({
	keyup: function (e) {
		if (e.which == 13) {
			var listName = $("#listName").val();
			if (listName != "") {
				addList(listName);
				$("#listName").val("");
			} else {
				swal("", "List Name can not be left blank", "warning");
				return;
			}
			$(".modal").modal("close");
		}
	},
});

function generateRandomNumber() {
	const RANDOM_CONST = 10000000000000;
	return parseInt(Math.random() * RANDOM_CONST);
}

$("body").on("click", "#submitTaskDetails", (data) => {
	$.post(
		"/api/update-taskDetails", {
		presentTaskName: TaskInputName,
		taskName: $("#task").val(),
		createdBy: $("#createdBy").val(),
		description: $("#tArea").val(),
		assignedTo: $("#assignedTo").val(),
		status: $("#status").val(),
		completionDate: $("#completeDate").val()
	},
		(data) => {
			if (data) {
				swal("", "Updated task successfully", "success");
			} else {
				swal("", "error", "error");
			}
		}
	);
});

function fetchTaskDetails(name) {
	var liContent = ""
	$.get("/api/fetchTaskDetails?taskName=" + name, (data) => {
		canArchive = data.canArchive;
		canEdit = data.canEdit
		$("#tArea").val(data.data[0].description || "");
		$("#createdBy").val(data.data[0].createdBy || "");
		$("#assignedTo").val(data.data[0].assignedTo || "");
		$("#status").val(data.data[0].status || "");
		$("#status").formSelect();
		$("#completeDate").val(data.data[0].completionDate || "");
		data.data[0].taskHistory.forEach((n) => {
			$("#taskHistoryUL").empty()
			liContent += '<li>' + n + '</li>'
			$("#taskHistoryUL").append(liContent);
		})
		if (canEdit == false) {
			$("#submitTaskDetails").addClass("disabled")
		} else {
			$("#submitTaskDetails").removeClass("disabled")
		}
	});
}
$("#archive").on("click", () => {
	if (canArchive === true) {
		swal({
			title: "Are you sure?",
			text: "Do you want to archive it?",
			icon: "warning",
			dangerMode: true,
			buttons: {
				cancel: "No",
				delete: "Yes",
			},
		}).then((willArchive) => {
			if (willArchive) {
				$.post(
					"/api/archive-task", {
					taskName: TaskInputName,
					archive: true,
				},
					(data) => {
						if (data.success) {
							$(".modal").modal("close");
							$("#" + ExtractTaskID).hide();
							swal("", data.success, "success");
						} else {
							swal("", data.message, "error");
						}
					}
				);
			} else {
				swal("Task archive cancelled", {
					title: "Cancelled",
					icon: "error",
				});
			}
		});
	} else {
		swal("", "You Do not have the access to delete the task", "error")
	}
});

$("#archiveTask").on("click", () => {
	$("#archivedTaskNames").empty()
	$.get("/api/fetchArchivedTask", (data) => {
		if (data.success) {
			var task = data.success;
			task.forEach((n) => {
				var taskHTML = `
              <li>
                <a href="#"><i class="material-icons">radio_button_checked</i>${n.taskName}</a>
              </li>`
				$("#archivedTaskNames").append(taskHTML);

			});
		} else { }
	});
});

$("body").on("click", ".list-archive", () => {
	$.post(
		"/api/archive-list", {
		listName: ArchiveListName,
	},
		(err, data) => {
			if (data.success) { } else { }
		}
	);
});

function allowDrop(ev) {
	ev.preventDefault();
}

function dragStart(ev) {
	ev.dataTransfer.setData("text/plain", ev.target.id);

}

function dropIt(ev) {
	ev.preventDefault();
	let sourceId = ev.dataTransfer.getData("text/plain");

	let sourceIdEl = document.getElementById(sourceId);
	let sourceIdParentEl = sourceIdEl.parentElement;
	let targetEl = document.getElementById(ev.target.id);
	let targetParentEl = targetEl.parentElement;
	if (targetParentEl.id !== sourceIdParentEl.id) {
		if (targetEl.className === sourceIdEl.className) {
			return
		} else {
			targetEl.appendChild(sourceIdEl);
		}
	} else {
		let holder = targetEl;
		let holderText = holder.textContent;
		targetEl.textContent = sourceIdEl.textContent;
		sourceIdEl.textContent = holderText;
		holderText = "";
	}
}