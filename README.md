
My Planner app is a prototype of trello app. It has its own authentication module which helps the user to sign up and further authenticate him/her on log in. That means in order to use My planner app, user need to signup and then login using the credentials which will route him/her to the home page of the app, from where the boards can be accessed.

As soon as the user logs in he/she is routed to the home page of the app which consists of two sections: Your boards and Shared boards. On user login, the app checks if a board is already created by the user,if not, it prompts the user to create a board to help him/her to get started. While creating a board, the user gets the option to create a personal board or a shared board as per convinience.

Your board(s) section of the homepage consists of the total boards created by the user.
Shared board(s) section consists of the boards whose access is shared with other users/team members selected by the board owner while creating the board

To create a personal board, the user need not provide any input on the Teams Option prompted while creating the board.
In order to create a shared board, the user needs to create a team which will have the access to the board.The team members can be added to the team using the autocomplete functionality provided from the Board creation page.As soon as the board is created , it can be seen in the Your board(s) section of the board owner and also in the shared board(s) section,if shared with others. 
Each board is provided with an option to archive which is present in the form of an icon on the board icon itself. 

On clicking the board thumbnail, the user is routed to the the respective Board which loads the board's configuration(lists,tasks,task data)if it is an existing board. If new, the user can just see an empty board presnt where she he/she gets the optionality to add lists and tasks to the list. The user can click on the (+) icon to create a new list. Upon clicking the (+) icon, the user gets a prompt to enter the List Name (eg: To Do) and once created, the user can add tasks to it by clicking on (+Add Another Card) provided at the bottom of the list.
As soon as the tasks are created ,the task creator can further add details to the card where he/she can add the tasks description,edit the task name, can set the completion date of the task, assign it to any member of the team. The task modal also consists of the created By and 
Task history which displays the task creator and the history of the task. Once a task is assigned, it can not be editted anymore by the task creator, the access shifts to the member the task is assigned to who can futher update details on the card.The cards are provided with an option to archive instead of delete,whose access is restricted only to the user who created the task. That means only the user who has created the task,can archive it.

NOTE::-BETA-: The cards are provided with a functionality to drag and drop from one list to another.

Further more, an archive section can be observed on the top right side of the boards page, which displays the lists of the tasks that has been archived by the tasks owner on task completion/as per convinience.
