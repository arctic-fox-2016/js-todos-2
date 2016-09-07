"use strict"
var fs = require("fs");
var jsonfile = require('jsonfile')
var sort = require('sort');
var sortby = require('sort-by')
var content = fs.readFileSync("data.json");
var jsonContent = JSON.parse(content);
let input = ""
let idx = 0
var file = 'data.json'
let tempArr = []
let hasil = []

process.argv.forEach((val,index,array)=> {
//help
    if(val=="help"){
      console.log(`node todo.js list asc|desc\nnode todo.js list:outstanding asc|desc\nnode todo.js list:completed asc:desc\nnode todo.js tag <task_id>  <task_id>  <task_id> . . .  <task_id>\nnode todo.js filter:<tag_name>\nnode todo.js uncomplete <task_id>\nnode todo.js complete <task_id>\nnode todo.js add <task_id> \nnode todo.js delete <task_id>\nnode todo.js help`)
    }
//list
    else if(val=="list"){
      if(array[3]=="asc")
      {
        hasil = jsonContent.sort(sortby('dateCreated'))
        for (var i = 0; i < hasil.length; i++) {
          console.log(`${i+1}. ${hasil[i].status} ${hasil[i].task}`);
        }
      }
      if(array[3]=="desc")
      {
        hasil = jsonContent.sort(sortby('-dateCreated'))
        for (var i = 0; i < hasil.length; i++) {
          console.log(`${i+1}. ${hasil[i].status} ${hasil[i].task}`);
        }
      }
    }

//list outstanding
    else if(val=="list:outstanding"){
      if(array[3]=="asc")
      {
        hasil = jsonContent.sort(sortby('dateCreated'))
        for (var i = 0; i < hasil.length; i++) {
          if (hasil[i].status=="[ ]") tempArr.push(hasil[i])
        }
        for (var i = 0; i < tempArr.length; i++) {
          console.log(`${i+1}. ${tempArr[i].status} ${tempArr[i].task}`);
        }
      }
      if(array[3]=="desc")
      {
        hasil = jsonContent.sort(sortby('-dateCreated'))
        for (var i = 0; i < hasil.length; i++) {
          if (hasil[i].status=="[ ]") tempArr.push(hasil[i])
        }
        for (var i = 0; i < tempArr.length; i++) {
          console.log(`${i+1}. ${tempArr[i].status} ${tempArr[i].task}`);
        }
      }
    }
//list yang sudah status komplit
    else if(val=="list:completed"){
      for (var i = 0; i < jsonContent.length; i++) {
        if (jsonContent[i].status=="[X]") tempArr.push(jsonContent[i])
      }
      for (var i = 0; i < tempArr.length; i++) {
        console.log(`${i+1}. ${tempArr[i].status} ${tempArr[i].task}`);
      }
    }
//tagging
    else if(val=="tag"){
      if(array.length>3){
        let tempArrTag = ""
        for (let i = 4; i < array.length; i++) {
          tempArrTag+=array[i]+","
        }
        tempArrTag = tempArrTag.substring(0,tempArrTag.length-1)
          jsonContent[array[3]-1].tag= tempArrTag
          jsonfile.writeFileSync(file, jsonContent)
          console.log(`Tagged task ${jsonContent[array[3]].task} with tags: ${tempArrTag}`);
      }
    }
//filter data
    else if(val.includes("filter")){
      let found = false
      let kata = array[2].substring(array[2].indexOf(":")+1,array[2].length)
    for (let i = 0; i < jsonContent.length; i++) {
      if (jsonContent[i].tag.includes(kata)) {
        console.log(jsonContent[i]);
        found=true
      }
    }
      if(found==false){
        console.log("filter is not found")
      }
    }
//adding data
    else if(val=="add"){
      if (array.length>3) {
        let tempAdd = ""
        for (let i = 3; i < array.length; i++) {
            tempAdd += array[i]+ " "
        }
        tempAdd = tempAdd.substring(0,tempAdd.length-1)
        jsonContent.push(
          {
            task:tempAdd
            ,status:"[ ]"
            ,dateCreated:new Date()
            ,dateFinished:""
            ,tag:""
          })

        jsonfile.writeFileSync(file, jsonContent)
      console.log(`Added ${tempAdd} to your to do list`);
      }
    }
//delete data
    else if(val=="delete"){
      let found = false
      if (array[3]<=jsonContent.length) {
            jsonContent.splice(array[3]-1,1)
            jsonfile.writeFileSync(file, jsonContent)
            found=true
            console.log(`data ${array[3]} has been deleted`);
          }
      else console.log("Task ID is not found")
    }
//data yang belum komplit
    else if(val =="uncomplete"){
    if (array[3]<=jsonContent.length) {
      jsonContent[array[3]-1].status="[ ]"
      jsonfile.writeFileSync(file, jsonContent)
      console.log(`task id : ${array[3]} is uncompleted`);
      }
    else console.log("Task ID is not found")
    }
//data yang sudah komplit
    else if(val =="complete"){
    if (array[3]<=jsonContent.length) {
      jsonContent[array[3]-1].status="[X]"
      jsonfile.writeFileSync(file, jsonContent)
      console.log(`task id : ${array[3]} is completed`);
      }
    else console.log("Task ID is not found")
    }
//sorting descending

});
