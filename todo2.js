"use strict"
let fs = require('fs');
let sort = require('sort')
let sortby = require('sort-by')
let content = fs.readFileSync("data.json");
let data = JSON.parse(content);
let input = ""
let idx = 0
let jsonfile = require('jsonfile')
let file = 'data.json'
let arrTemp = []
let result = []

process.argv.forEach((val, index, array) =>  {

  if (val=="help"){
    console.log(`================TO-DO (HELP)=================`);
    console.log(`node todo2.js list\nnode todo2.js add <task_content>\nnode todo2.js task <task_id>\nnode todo2.js delete <task_id>\nnode todo2.js complete <task_id>\nnode todo2.js uncomplete <task_id>\nnode todo2.js list:outstanding asc|desc\nnode todo2.js list:completed asc|desc\nnode todo2.js <tag_name_N>\nnode todo2.js filter:<tag_name>`);
    console.log(`=============================================`);
  }

  else if (val=="list"){
    console.log(`================TO-DO (LIST)=================`);
    for (var i = 0; i < data.length; i++){
      console.log(`${i+1}. ${data[i].status} ${data[i].task}`);
      console.log(`---------------------------------------------`);
    }
  }

  else if (val=="add"){
    if(array.length > 3){
      let addTemp = ""
      for(let i = 3; i < array.length; i++){
        addTemp += array[i]+ " "
      }
      addTemp = addTemp.substring(0,addTemp.length-1)

      data.push({task:addTemp,status:"belum selesai"})
      //console.log(data);
      jsonfile.writeFileSync(file, data)
      console.log(`================TO-DO (ADD)================`);
      console.log(`Memasukan ${addTemp} ke TODO list anda`);
      console.log(`===========================================`);
    }
  }

  else if (val=="task"){
    if(array.length >3){
      console.log(`================TO-DO (TASK)=================`);
      console.log(data[array[3]-1]);
      console.log(`=============================================`);
    }
}

  else if (val=="delete"){
    if (array.length >3){
      data.splice(array[3]-1,1)
      jsonfile.writeFileSync(file, data)
    }
    console.log(`================TO-DO (DELETE)=================`);
    console.log("data telah dihapus");
    console.log(`===============================================`);
}

  else if (val=="complete"){
    if(array.length > 3){
      data[array[3]-1].status="[x]-(selesai)"
      jsonfile.writeFileSync(file, data)
      console.log(`================TO-DO (COMPLETE)=================`);
      console.log(`task ke: ${array[3]} sudah selesai`);
      console.log(`=================================================`);
    }
}

    else if (val=="uncomplete"){
    if(array.length > 3){
      data[array[3]-1].status="[ ]-(belum selesai)"
      jsonfile.writeFileSync(file, data)
      console.log(`================TO-DO (UNCOMPLETE)=================`);
      console.log(`task ke: ${array[3]} belum selesai`);
      console.log(`===================================================`);
    }
  }

      else if (val=="list:completed"){
    for (var i = 0; i < data.length; i++){
      if (data[i].status ="[x]-(selesai)") arrTemp.push(data[i])
    }
    for(var i = 0; i < arrTemp.length; i++){
      console.log(`${i+1}. ${arrTemp[i].status} ${arrTemp[i].task}`);
    }
}


    // outstanding dengan ascending dan descending
    else if(val=="list:outstanding"){
      if(array[3]=="asc")
      {
        result = data.sort(sortby('dateCreated'))
        for (var i = 0; i < result.length; i++) {
          if (result[i].status=="[ ]-(belum selesai)") arrTemp.push(result[i])
        }
        for (var i = 0; i < arrTemp.length; i++) {
          console.log(`${i+1}. ${arrTemp[i].status} ${arrTemp[i].task}`);
        }
      }
      if(array[3]=="desc}")
      {
        result = data.sort(sortby('-dateCreated'))
        for (var i = 0; i < result.length; i++) {
          if (result[i].status=="[ ]-(belum selesai)") tempArr.push(result[i])
        }
        for (var i = 0; i < tempArr.length; i++) {
          console.log(`${i+1}. ${tempArr[i].status} ${tempArr[i].task}`);
        }
      }

    // case "tag":
    // if(array.length > 3){
    //   data[array[3]-1].status="[ ]-(belum selesai)"
    //   jsonfile.writeFileSync(file, data)
    //   console.log(`================TO-DO (UNCOMPLETE)=================`);
    //   console.log(`task ke: ${array[3]} belum selesai`);
    //   console.log(`===================================================`);
    // }
    // break;

}
});
