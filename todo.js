import Task from "./Task"

console.log("===================THIS IS HELP===================");
console.log("1. node todo.js") // buat call help
console.log("2. node todo.js help") // buat call help
console.log("3. node todo.js list ") // buat call help
console.log("4. node todo.js add <task_content>") // buat call help
console.log("5. node todo.js task <task_ID>") // buat call help
console.log("6. node todo.js delete <task_ID>") // buat call help
console.log("7. node todo.js complete <task_ID>") // buat call help
console.log("8. node todo.js uncomplete <task_ID>") // buat call help
console.log("8. node todo.js list:outstanding <task_ID>") // buat call help
console.log("8. node todo.js list:completed <task_ID>") // buat call help
console.log("8. node todo.js tag <task_ID> <tag_name_1> <tag_name_2>") // buat call help
console.log("8. node todo.js filter: <tag_name>") // buat call help




var fs = require('fs')
var listTaskJSON = JSON.parse(fs.readFileSync('data.json'))
var arraySort = require('array-sort');
var sortBy = require('sort-by')
//batch_of_task.push(listTaskJSON)


let taskAll = []

for (let i =0;i<listTaskJSON.length;i++){
  taskAll.push(new Task({
    task:listTaskJSON[i].task,
    taskID:listTaskJSON[i].taskID,
    statusTasks:listTaskJSON[i].statusTasks,
    createdDate:listTaskJSON[i].createdDate,
    completeDate:listTaskJSON[i].completedDate
  }))
}


if(process.argv[2] == "list" ){
  console.log("===============List Aplikasi lo=============")
  for (let i=0;i<taskAll.length;i++)
  console.log(taskAll[i].task);
}
else if(process.argv[2] == "add" ){
  //  console.log("ADd Jalan");
  console.log("===============Anda akan menambah data=============")
  taskAll.push(new Task({
    task:process.argv[3],
    taskID:"T00"+(taskAll.length+1),
    statusTasks:"Completed",
    createdDate: new Date("October 13, 2014 11:13:00"),
    completeDate: new Date("October 15, 2014 12:13:00")

  }))

  fs.writeFile("data.json", JSON.stringify(taskAll), function(err) {
    if(err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });

}
else if(process.argv[2] == "task" ){
  //  console.log("ADd Jalan");
  console.log("===============Anda akan menambah data=============")
  taskAll.push(new Task({
    task:process.argv[3],
    taskID:"T00"+taskAll.length+1
  }))
}
else if(process.argv[2] == "delete" ){
  //  console.log("ADd Jalan");
  console.log("===============Anda akan mendelete data=============")
  for (let i=0;i<taskAll.length;i++)
  console.log(`Task ID : ${taskAll[i].taskID} ${taskAll[i].task}`   );
  console.log(`Pilih ID yang anda ingin hapus`   );
  let taskIDhapus = process.argv[3]

  console.log(`Anda akan menghapus ${taskIDhapus}`);
  for(let i = 0;i<taskAll.length;i++){
    if(taskAll[i].taskID == taskIDhapus)
    taskAll.splice(taskAll.indexOf(taskAll[i]),1)
    //console.log(taskAll.indexOf(taskAll[i]))
  }
  fs.writeFile("data.json", JSON.stringify(taskAll), function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was deleted!");
  });
}
else if(process.argv[2] == "list:completed" ){
  console.log("==================LIST COMPLETED Task=================");
  for(let i = 0;i<taskAll.length;i++){
    if(taskAll[i].statusTasks == "completed")
    console.log(`Nama ID : ${taskAll[i].taskID}, Jenis Task : ${taskAll[i].task}`);
  }

}
else if(process.argv[2] == "list:outstanding" ){
  console.log("==================LIST Outstanding Task=================");
  let hasilAsc = []
  let hasilDsc = []
  hasilAsc = taskAll.sort(sortBy('-createdDate'));
  hasilDsc = taskAll.sort(sortBy('createdDate'));
  //hasilDsc = taskAll.sort(sortBy('createdDate'));
  
  if(process.argv[3] == "asc"){
    for(let i = 0;i<taskAll.length;i++){
      if(hasilAsc[i].statusTasks == "Completed")
      console.log(`Nama ID : ${hasilAsc[i].taskID},\n Jenis Task : ${hasilAsc[i].task},\n Tanggal : ${hasilAsc[i].createdDate}`);
    }
  }
  else if (process.argv[3] == "dsc"){
    for(let i = 0;i<taskAll.length;i++){
      if(hasilDsc[i].statusTasks == "Completed")
      console.log(`Nama ID : ${hasilDsc[i].taskID},\n Jenis Task : ${hasilDsc[i].task},\n Tanggal : ${hasilDsc[i].createdDate}`);
    }
  }
  //
  // console.log(arraySort([{foo: 'y'}, {foo: 'z'}, {foo: 'x'}], 'foo'));
  //
}

else {
  console.log("gagal");

}
