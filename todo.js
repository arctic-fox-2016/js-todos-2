let fs = require("fs")
let filePath = "data.json"

class List {
  constructor(data) {
    // Initialize list
    this.list = JSON.parse(data)
    this.arguments = []

    // Get arguments from console
    process.argv.forEach((val, index) => {
      if (index > 1)
        this.arguments.push(val)
    })

    // Switch cases based on arguments passed
    switch (true) {
      case /list/.test(this.arguments[0]):
      this.listTasks()
      break
      case /add/.test(this.arguments[0]):
      this.addTask()
      break
      case /tag/.test(this.arguments[0]):
      this.tagTask()
      break
      case /filter/.test(this.arguments[0]):
      this.filterTask()
      break
      case /complete/.test(this.arguments[0]):
      this.updateTask("completed")
      break
      case /delete/.test(this.arguments[0]):
      this.updateTask("deleted")
      break
      case /emptybin/.test(this.arguments[0]):
      this.emptyBin()
      break
      case /help/.test(this.arguments[0]):
      default:
      this.errorMessage()
    }
  }

  // List all tasks based on parameters
  listTasks() {
    let param = this.arguments[0].split(":")[1]
    let sortBy = this.arguments[1]

    switch (param) {
      case "outstanding":
        switch (sortBy) {
          case "desc":
            this.list.sort(function(a,b) {return (a.created_date < b.created_date) ? 1 : ((b.created_date < a.created_date) ? -1 : 0);} )
            break
          case "asc":
          default:
            this.list.sort(function(a,b) {return (a.created_date > b.created_date) ? 1 : ((b.created_date > a.created_date) ? -1 : 0);} )
        }
        break
      case "completed":
        switch (sortBy) {
          case "desc":
            this.list.sort(function(a,b) {return (a.completed_date < b.completed_date) ? 1 : ((b.completed_date < a.completed_date) ? -1 : 0);} )
            break
          case "asc":
          default:
            this.list.sort(function(a,b) {return (a.completed_date > b.completed_date) ? 1 : ((b.completed_date > a.completed_date) ? -1 : 0);} )
        }
        break
    }

    this.viewTasks()
  }

  // Add task to To-Do list
  addTask() {
    let taskStr = ""
    let taskObj = {}
    let id = 0

    for (var i = 0; i < this.list.length; i++) {
      id = Math.max(this.list[i].id, id)
    }

    for (var j = 1; j < this.arguments.length; j++) {
      taskStr += this.arguments[j]
    }

    if (taskStr == "") {
      console.log(`Please enter a new task: add <new_task>`)
    } else {
      taskObj.id = id + 1
      taskObj.task = taskStr
      taskObj.status = "in progress"
      taskObj.created_date = this.getDate()
      taskObj.completed_date = "00-00-0000"
      taskObj.tags = []
      this.list.push(taskObj)
      this.viewTasks()
      console.log(`Added "${taskStr}" to your To-Do list.\n`)
      this.writeFile()
    }
  }

  // Apply tag to an existing task
  tagTask() {
    let found = false
    let tagArr = []
    let count = 0
    let dupArr = []
    let dupCount = 0

    for (let i = 0; i < this.list.length; i++) {
      if(this.list[i].id == this.arguments[1]) {
        for (let j = 2; j < this.arguments.length; j++) {
          if (this.list[i].tags.indexOf(this.arguments[j]) == -1) {
            this.list[i].tags.push(this.arguments[j])
            tagArr.push(this.arguments[j])
            count++
          } else {
            dupArr.push(this.arguments[j])
            dupCount++
          }
        }

        if (count + dupCount == 0) {
          console.log(`Please add at least one tag.\n`)
        } else {
          if (dupCount > 0)
            console.log(`${dupCount} duplicate tags found: "${dupArr}"`)
          if (count > 0) {
            console.log(`${count} unique tags found: "${tagArr}"`)
            this.writeFile()
            this.viewTasks()
            console.log(`Tagged Task ID ${this.pad(this.list[i].id)}: "${this.list[i].task}" with tags: ${tagArr}.\n`)
          } else {
            console.log(`No tags added to the task.\n`)
          }
        }
        found = true
      }
    }
    if (found == false) {
      console.log(`Please select a valid Task ID.\n`)
    }
  }

  filterTask() {
    let listArr = []
    let tagArr = []
    let count = 0
    for (let k = 1; k < this.arguments.length; k++) {
      for (let i = 0; i < this.list.length; i++) {
        for (let j = 0; j < this.list[i].tags.length; j++) {
          if (this.list[i].tags[j] == this.arguments[k]) {
            if (listArr.indexOf(this.list[i]) == -1) {
              listArr.push(this.list[i])
              count++
            }
          }
        }
      }
      tagArr.push(this.arguments[k])
    }
    this.list = listArr
    this.viewTasks()

    if (count > 0) {
      console.log(`Found ${count} tasks with tags in: "${tagArr}"\n`)
    } else {
      console.log(`No tasks found with tags in: "${tagArr}"\n`)
    }
  }

  // Mark task on To-Do list as complete
  updateTask(status) {
    let found = false
    let id = this.arguments[1]
    if (id != null && id.match(/\d/) != null) {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].id == id && this.list[i].status == "in progress") {
          this.list[i].status = status
          this.list[i].completed_date = this.getDate()
          this.viewTasks()
          console.log(`Task ID ${this.pad(this.list[i].id)}: "${this.list[i].task}" is marked as ${status}.\n`)
          this.writeFile()
          found = true
          break
        }
      }
      if (found == false)
        console.log(`Please select a Task ID with status "in progress."`)
    } else {
      this.errorMessage()
    }
  }

  emptyBin() {
    let count = 0
    for (var i = 0; i < this.list.length; i++) {
      if (this.list[i].status == "deleted") {
        this.list.splice(i, 1)
        count++
        i--
      }
    }
    if (count > 0) {
      this.viewTasks()
      console.log(`Permanently removed "${count}" tasks from your To-Do list.\n`)
      this.writeFile()
    } else {
      console.log(`No file with status "deleted" was found.\n`)
    }
  }

  getDate() {
    let date = new Date()
    return date.getFullYear() + "-" + this.pad(date.getMonth()) + "-" + this.pad(date.getDate())
  }

  pad(n) {
    return (n < 10) ? ("0" + n) : n;
  }

  sort(param) {
    this.list.sort(function(a,b) {return (a.created_date > b.created_date) ? 1 : ((b.created_date > a.created_date) ? -1 : 0);} )
  }

  // View all tasks in list
  viewTasks() {
    console.log(`\x1Bc`)
    console.log(`-----------------------------------------------------------------------------------`)
    console.log(`You have ${this.list.length} tasks`)
    console.log(`-----------------------------------------------------------------------------------`)
    if (this.list.length != 0) {
      console.log(`ID      Created Date    Completed Date   Task (Status)`)
      for (var i = 0; i < this.list.length; i++) {
        console.log(`[${this.pad(this.list[i].id)}]:   ${this.list[i].created_date}      ${this.list[i].completed_date}       ${this.list[i].task} (${this.list[i].status})`)
      }
      console.log(`-----------------------------------------------------------------------------------`)
    }
    console.log(`'node todo.js help' for help`)
    console.log()
  }

  errorMessage() {
    console.log(`\x1Bc`)
    console.log(`-----------------------------------------------------------------------------------`)
    console.log(`Welcome to To-Do List Makerer`)
    console.log(`-----------------------------------------------------------------------------------`)
    console.log()
    console.log(`List all tasks in To-Do list`)
    console.log(`  list                           List all tasks`)
    console.log(`  list:outstanding asc|desc      List all outstanding tasks asc/desc`)
    console.log(`  list:completed asc|desc        List all completed tasks asc/desc`)
    console.log()
    console.log(`Add a new task to To-Do list`)
    console.log(`  add <Task>                     Add a new task`)
    console.log()
    console.log(`Add tags to a task`)
    console.log(`  tag <Task ID> <tag 1> <tag 2>  Add tags to an existing task`)
    console.log()
    console.log(`Filter tasks based on tags`)
    console.log(`  filter <tag 1> <tag 2>         Add tags to an existing task`)
    console.log()
    console.log(`Mark a task as complete from To-Do list (In Progress only)`)
    console.log(`  complete <Task ID>             Complete task`)
    console.log()
    console.log(`Delete a task from To-Do list (In Progress only)`)
    console.log(`  delete <Task ID>               Delete task`)
    console.log()
    console.log(`Delete a task from To-Do list (In Progress only)`)
    console.log(`  emptybin                       Permanently remove all deleted tasks`)
    console.log()
  }

  writeFile() {
    fs.writeFile(filePath, JSON.stringify(this.list), (err) => {
      if (err) throw err;
    });
  }
}

// Read from data.json
fs.readFile(filePath, (err, data) => {
  if (err) throw err;

  // If data is loaded, load the list
  let list = new List(data)
});
