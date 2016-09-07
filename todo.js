const fs = require("fs")

// Example how read file asynchronous - START
// let temp_file = fs.readFile("data.json", (err, data) => {
//   if (err) throw err;
//   temp_file = JSON.parse(data);
//   console.log(temp_file);
// });
// Example how read file asynchronous - END

// Example how read file synchronous - START
// let temp_file = fs.readFileSync("data.json");
// temp_file = JSON.parse(temp_file);
// console.log(temp_file);
// Example how read file synchronous - END

class System{
  static clearScreen(){
    let lines = process.stdout.getWindowSize()[1];
    for(var i = 0; i < lines; i++) { console.log('\n'); }
    return true;
  }
  static newLine(count){
    for(let idx = 0; idx < count; idx++) console.log("\n");
    return true;
  }
  static printReadFile(file, count){
    let dot = "";
    for(let idx = 0; idx < count % 3; idx++) dot += ".";
    console.log(`Reading from "${file}" ${dot}`)
  }
  static printHeadLine(){
    let dots = "";
    for(let idx = 0; idx < 20; idx++) dots += "=";
    console.log(dots);
    return true;
  }
  static printCommand(){
    let string = "";
    for(let idx = 2; idx < process.argv.length; idx++) string += " " + process.argv[idx];
    console.log(`$ node todo.js${string}`);
  }
  static processDate(date = null){
    let d = new Date();
    let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    date = `${month[d.getMonth()]} ${d.getFullYear()}, ${d.getDate()}`;
    return date;
  }
}

class Task{
  constructor(property = {}){
    this._name = property["name"];
    this._isCheck = property["isCheck"] || false;
    this._tag = property["tag"] || false;
    this._dateCreated = property["dateCreated"] || System.processDate();
    this._dateCompleted = property["dateCompleted"] || false;
  }
  set name(value){ this._name = value; }
  get name(){ return this._name; }
  set isCheck(value){ this._isCheck = value; }
  get isCheck(){ return this._isCheck; }
  get dateCreated(){ return this._dateCreated; }
  set dateCompleted(value){
    if(value)
      this._dateCompleted = System.processDate();
    else
      this._dateCompleted = false;
  }
  get dateCompleted(){ return this._dateCompleted; }
  set tag(value){ this._tag.push(value); }
  get tag(){ return this._tag; }
}

class List{
  constructor(){
    this._list = [];
  }
  set list(value){ this._list.push(value); }
  get list(){ return this._list; }
  push(value){
    this.list = value;
    return true;
  }
}

let json_file_name = "data.json";
let list_arr = new List();
class Todo{
  static printList(){
    System.newLine(1);
    System.printHeadLine();
    console.log("List of Task:")
    System.printHeadLine();
    list_arr.list.forEach((val, idx, array) => {
      console.log(`[${(val.isCheck) ? "x" : " "}] ${val.name}, created at ${val.dateCreated}`);
      console.log(`••• ${(val.dateCompleted) ? `Completed at, ${val.dateCompleted}` : "Not Completed"}`);
      console.log(`••• Tag: ${(val.tag) ? `${val.tag}` : "-"}`);
      System.newLine(1);
    });
  }
  static addTask(value){
    console.log(`-- Add task "${value}"`);
    list_arr.push(new Task({
      name: process.argv[3]
    }));
    this.writeFile();
    return true;
  }
  static deleteTask(value){
    console.log(`-- Delete task "${value}"`);
    let temp_list_arr = new List();

    list_arr.list.forEach((val, idx, array) => {
      if(process.argv[3].toLowerCase() != val.name.toLowerCase()){
        temp_list_arr.push(val);
      }
    });
    list_arr = temp_list_arr;
    this.writeFile();
    return true;
  }
  static filter(command){
    let temp_list_arr = new List();
    switch (command.toLowerCase()) {
      case "list:outstanding":
        console.log(`-- Filter: Outstanding`);
        list_arr.list.forEach((val, idx, array) => {
          if(!val.dateCompleted){
            temp_list_arr.push(val);
          }
        });
        temp_list_arr.list.sort(function(a, b){
          let dateCreatedA = a.dateCreated;
          let dateCreatedB = b.dateCreated;
          if(dateCreatedA < dateCreatedB) return -1;
          else if(dateCreatedA > dateCreatedB) return 1;
          return 0;
        });
        list_arr = temp_list_arr;
      break;
      case "list:completed":
        console.log(`-- Filter: Completed`);
        list_arr.list.forEach((val, idx, array) => {
          if(val.dateCompleted){
            temp_list_arr.push(val);
          }
        });
        temp_list_arr.list.sort(function(a, b){
          let dateCreatedA = a.dateCreated;
          let dateCreatedB = b.dateCreated;
          if(dateCreatedA < dateCreatedB) return -1;
          else if(dateCreatedA > dateCreatedB) return 1;
          return 0;
        });
        list_arr = temp_list_arr;
      break;
      case "filter:array":
        let argument_input = process.argv[2].toLowerCase();
        let command = argument_input.split(":"); command = command[1];
        if(command[0] == "[") command = command.substring(1);
        if(command[command.length-1] == "]") command = command.substring(0, command.length-1);
        command = command.split(",");

        let temp_string = "-- Filter: ";
        for(let idx = 0; idx < command.length; idx++){
          temp_string += command[idx];
          if(idx != command.length - 1){
            temp_string += ", ";
          }
        }
        console.log(temp_string);

        list_arr.list.forEach((val, idx, array) => {
          for(let idx = 0; idx < val.tag.length; idx++){
            let flag_found = false;
            for(let idy = 0; idy < command.length; idy++){
              if(val.tag[idx].toLowerCase() == command[idy].toLowerCase()){
                temp_list_arr.push(val);
                flag_found = true;
                break;
              }
            }
            if(flag_found) break;
          }
        });
        temp_list_arr.list.sort(function(a, b){
          let dateCreatedA = a.dateCreated;
          let dateCreatedB = b.dateCreated;
          if(dateCreatedA < dateCreatedB) return -1;
          else if(dateCreatedA > dateCreatedB) return 1;
          return 0;
        });
        list_arr = temp_list_arr;
      break;
      default:break;
    }
    return true;
  }
  static checkTask(value, status){
    console.log(`-- Check task "${value}" to ${status}`);
    let temp_list_arr = new List();

    if(status.toLowerCase() == "true") status = true;
    else if(status.toLowerCase() == "false") status = false;

    list_arr.list.forEach((val, idx, array) => {
      if(process.argv[3].toLowerCase() == val.name.toLowerCase()){
        list_arr.list[idx].isCheck = status;
        list_arr.list[idx].dateCompleted = status;
      }
      temp_list_arr.push(val);
    });
    list_arr = temp_list_arr;
    this.writeFile();
    return true;
  }
  static readFile(command){
    let read_file_flag = false;
    // Get all task from data.json - START
    let json_list = fs.readFile("data.json", (err, data) => {
      if (err) throw err;
      json_list = JSON.parse(data);
      json_list.forEach((val, idx, array) => {
        // Store all task to class - START
        list_arr.push(new Task({
          "name":val.task,
          "isCheck":val.isCheck || false,
          "tag":val.tag || false,
          "dateCreated":val.dateCreated || null,
          "dateCompleted":val.dateCompleted || null
        }));
        // Store all task to class - END
      });
      read_file_flag = true;
    })
    // Get all task from data.json - END

    System.clearScreen();
    System.printReadFile(json_file_name, 0);
    let index = 0;
    let read_process = function(){
        if(read_file_flag){
          switch(command.toLowerCase()){
            case "list":
              Todo.printList();
            break;
            case "add":
              Todo.addTask(process.argv[3]);
              Todo.printList();
            break;
            case "delete":
              Todo.deleteTask(process.argv[3]);
              Todo.printList();
            break;
            case "check":
              Todo.checkTask(process.argv[3], process.argv[4]);
              Todo.printList();
            break;
            case "list:outstanding":
              Todo.filter("list:outstanding");
              Todo.printList();
            break;
            case "list:completed":
              Todo.filter("list:completed");
              Todo.printList();
            break;
            case "filter:array":
              Todo.filter("filter:array");
              Todo.printList();
            break;
            default: break;
          }
          return true;
        }
        System.clearScreen();
        System.printCommand();
        System.newLine(1);
        System.printReadFile(json_file_name, index);
        index += 1;
        setTimeout(function(){
          read_process();
        }, 1000);
    }
    read_process();
  }
  static writeFile(){
    let new_json = [];
    for(let idx = 0; idx < list_arr.list.length; idx++){
      new_json[idx] = {};
      new_json[idx].task = list_arr.list[idx].name;
      new_json[idx].isCheck = list_arr.list[idx].isCheck;
      new_json[idx].tag = list_arr.list[idx].tag;
      new_json[idx].dateCreated = list_arr.list[idx].dateCreated;
      new_json[idx].dateCompleted = list_arr.list[idx].dateCompleted;
    }
    fs.writeFile('data.json', JSON.stringify(new_json), (err) => {
      if (err) throw err;
    });
  }
  static start(){
    function printCommand(){
      System.newLine(1);
      console.log(`Please make an input. List:`);
      console.log(`[1] LIST`);
      console.log(`    get all task from '${json_file_name}'`);
      console.log(`[2] ADD [your_task]`);
      console.log(`    add task to '${json_file_name}'`);
      console.log(`[3] DELETE [choosen_task]`);
      console.log(`    delete task from '${json_file_name}'`);
      console.log(`[4] CHECK [choosen_task] [true || false]`);
      console.log(`    delete task from '${json_file_name}'`);
      console.log(`[5] LIST:[outstanding]`);
      console.log(`    get non-completed task list from '${json_file_name}'`);
      console.log(`[6] LIST:[completed]`);
      console.log(`    get completed task list from '${json_file_name}'`);
      System.newLine(1);
    }

    if(process.argv.length < 3){
      printCommand();
      return true;
    }

    let argument_input = process.argv[2].toLowerCase();
    if(argument_input == "list"){
      this.readFile("list");
    } else if(argument_input == "add"){
      if(process.argv.length < 4) printCommand();
      else this.readFile("add");
    } else if(argument_input == "delete"){
      if(process.argv.length < 4) printCommand();
      else this.readFile("delete");
    } else if(argument_input == "check"){
      if(process.argv.length < 5) printCommand();
      else this.readFile("check");
    } else if(argument_input.substring(0, 5)  == "list:"){
      let command = argument_input.split(":");
      command = command[1];
      switch (command) {
        case "outstanding":
          this.readFile("list:outstanding");
        break;
        case "completed":
          this.readFile("list:completed");
        break;
        default: printCommand(); break;
      }
    } else if(argument_input.substring(0, 7)  == "filter:"){
      let command = argument_input.split(":");
      command = command[1];
      if(command[0] == "[")
        command = command.substring(1);
      if(command[command.length-1] == "]")
        command = command.substring(0, command.length-1);
      command = command.split(",");

      if(command.length > 0) this.readFile("filter:array");
      else printCommand();
    } else {
      printCommand();
    }
  }
}
Todo.start();
