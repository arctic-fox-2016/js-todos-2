const fs = require("fs")

class Task{
  constructor(value){
    this._task = value["task"] || null
    this._isChecked = value["isChecked"] || null
    this._createdDate = value["createdDate"] || null
    this._finishDate = value["finishDate"] || null
    this._tag = value["tag"] || null
  }
}

class ToDo{
  constructor(){
      this.allList = readFile()
    }

  addTask(value){
    var newTask = {
      "task" : value,
      "isChecked" : false,
      "createdDate" : Date(),
      "finishDate" : "",
      "tag" : []
    }

    this.allList.push(newTask)
    writeFile(this.allList)
  }

  deleteTask(id){
    this.allList.splice(id-1,1)
    writeFile(this.allList)
  }

  completeTask(id){
    this.allList[id-1]["isChecked"] = true
    writeFile(this.allList)
  }

  unCompleteTask(id){
    this.allList[id-1]["isChecked"] = false
    writeFile(this.allList)
  }

  cetakToDo(){
    console.log("\n\n------------------")
    console.log("    To Do List")
    console.log("------------------\n")
    for (var i=0; i<this.allList.length; i++){
      var temp = ""
      if (this.allList[i]["isChecked"]) {
        temp += "[x] "
      } else {
        temp += "[ ] "
      }
      temp += i + 1 + ". "
      temp += this.allList[i]["task"] + "\t"
      temp += this.allList[i]["createdDate"] + "\t"
      temp += this.allList[i]["finishDate"] + "\t"
      temp += this.allList[i]["tag"]
      console.log(temp)
    }
    console.log("\n\n");
  }

  help(){
    console.log("\n\nHello, enter a command \n\n")
    console.log("1. help : show this help")
    console.log("2. list : show all the list")
    console.log("3. add <task> : add new task")
    console.log("4. delete <number> : delete list <number>")
    console.log("5. complete <number> : complete list <number>")
    console.log("6. uncomplete <number> : complete task number <number>")
    console.log("7. list:outstanding asc|desc : show all list asc|desc")
    console.log("8. list:completed asc|desc : show all list completed asc|desc")
    console.log("9. list:outstanding asc|desc : show all list asc|desc")
    console.log("10. tag <number> <tag1> <tag2> <tag3>")
    console.log("10. filter:<tag>")
  }

  outstandingAsc(data){
        data.sort(function(a, b) {
          var nameA = a.task.toUpperCase(); // ignore upper and lowercase
          var nameB = b.task.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

      this.cetakToDo()
  }

  completedAsc(){
    this.allList.sort(function(a, b){return a.isCompleted - b.isCompleted})
    this.outstandingAsc(this.allList)
  }

  completedDesc(){
    this.allList.sort(function(a, b) {return b.isCompleted - a.isCompleted})
    this.outstandingAsc(this.allList)
  }

  outstandingDesc(data){
    data.sort(function(a, b) {
      var nameA = a.task.toUpperCase(); // ignore upper and lowercase
      var nameB = b.task.toUpperCase(); // ignore upper and lowercase
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    this.cetakToDo()
  }

  tagIsFound(tag, tags){
    var found = false
    var i = 0
    while(i<tags.length && !found){
      if (tag == tags[i]){
          return true
      } else {
        i++
      }
    }

  }

  addTag(id,tags){
    let existTags = this.allList[id-1]["tag"]

    for (let i=0; i<tags.length; i++){
      if (!this.tagIsFound(tags[i],existTags)){
        this.allList[id-1]["tag"].push(tags[i])
      }
    }
    writeFile(this.allList)
    this.cetakToDo()
  }


  showFilter(argu){
    var tag = argu.slice(8,argu.length)

    console.log("\n\n------------------")
    console.log("    To Do List")
    console.log("------------------\n")
    for (var i=0; i<this.allList.length; i++){
      var listTags = this.allList[i]["tag"]
      var tagStr = ""
      for (let j=0; j<listTags.length; j++){
        tagStr += listTags[j] + " "
      }
      if (tagStr.search(tag) > -1) {
        var temp = ""
        if (this.allList[i]["isChecked"]) {
          temp += "[x] "
        } else {
          temp += "[ ] "
        }
        temp += i + 1 + ". "
        temp += this.allList[i]["task"] + "\t"
        temp += this.allList[i]["createdDate"] + "\t"
        temp += this.allList[i]["finishDate"] + "\t"
        temp += tagStr
        console.log(temp)
      }
    }
    console.log("\n\n");

  }


  cariPerintah(argu){
    if (argu.length>2 && argu[2].slice(0,7) == "filter:") {
      this.showFilter(argu[2])
    }
    else {
    switch (argu[2]) {
      case "help" :
        this.help()
        break;
      case "list" :
        this.cetakToDo()
        break
      case "add" :
        if (argu.length>3) {
          var argu3 = ""
          for (var i=3; i<argu.length; i++ ){
            argu3 += argu[i] + " "
          }
          this.addTask(argu3)
          this.cetakToDo()
        } else {
          console.log("\n\n!!! Nothing to add")
          this.cetakToDo()
        }
        break
        case "delete" :
          if (argu.length>3) {
            var argu3 = ""
            for (var i=3; i<argu.length; i++ ){
              argu3 += argu[i] + " "
            }
            this.deleteTask(argu3)
            this.cetakToDo()
          } else {
            console.log("\n\n!!! Nothing to delete")
            this.cetakToDo()
          }
          break
      case "uncomplete" :
        if (argu.length>3) {
          this.unCompleteTask(argu[3])
          this.cetakToDo()
        } else {
          console.log("\n\n!!! Enter list number")
          this.cetakToDo()
        }
        break
        case "complete" :
          if (argu.length>3) {
            this.completeTask(argu[3])
            this.cetakToDo()
          } else {
            console.log("\n\n!!! Enter list number")
            this.cetakToDo()
          }
          break

        case "list:outstanding" :
          var argu3 = "asc"
          if (argu.length > 3) {
            argu3 = argu[3]
          }

          if (argu3 == "asc") {
            this.outstandingAsc(this.allList)
          } else if (argu3 == "desc")
          {
            this.outstandingDesc(this.allList)
          }

          break
        case "list:completed" :
          var argu3 = "asc"
          if (argu.length > 3) {
            argu3 = argu[3]
          }

          if (argu3 == "asc") {
            this.completedAsc(this.allList)
          } else if (argu3 == "desc")
          {
            this.completedDesc(this.allList)
          }
          break

          case "tag" :
            if (argu.length < 5){
              this.cetakToDo()
              console.log ("!!! Nothing to tag\n\n")
            } else {
              let tempTags = []
              for (let i=4; i<argu.length; i++){
                tempTags.push(argu[i])
              }
              this.addTag(argu[3],tempTags)
            }
            break
      default :
        this.help()
    }
    }
  }
}

function writeFile(data){
  fs.writeFile('data.json', JSON.stringify(data), (err) => {
    if (err) throw err;
  });
}

function readFile(){
  return JSON.parse(fs.readFileSync('data.json', "utf8"))
}

let myToDo = new ToDo()

//  myToDo.allList = JSON.parse(data)
myToDo.cariPerintah(process.argv)
