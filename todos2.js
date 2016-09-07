//Release 0
var fs = require('fs');
var readline = require('readline');
var args0 = process.argv.slice(1);
var args = process.argv.slice(2);
var args1 = process.argv.slice(3).join(" ")
var obj;
let addList = []
let listShow = []
let data = 'data.json'
class Task {
  constructor(property) {
    this.list = []
      // this._created_date = property['created_date']

  }

  static start() {
    console.log('Silahkan ketik perintah di bawah ini untuk memilih menu')
    console.log('$ node todo.js help      >>> Menampilkan help')
    console.log('$ node todo.js list      >>> Menampilkan daftar list todo')
    console.log('$ node todo.js add       >>> Menambah tugas baru')
    console.log('$ node todo.js delete    >>> menghapus tugas')
    console.log('$ node todo.js complete  >>> Menampilkan tugas yang sudah selesai')
    console.log('$ node todo.js list:outstanding asc|desc')
    console.log('$ node todo.js list:completed asc|desc')
    console.log('$ node todo.js <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>')
    console.log('$ node todo.js filter:<tag_name>')

  }

  static add(test) {
    let list = JSON.parse(fs.readFileSync('data.json', "utf8"))
    list.push({

      task: test,
      date: new Date,
      done: false,

    })
    fs.writeFile(data, JSON.stringify(list), function (err) {
      if (err) {
        return console.log(err);
      }
      Task.showList()
      console.log("The task was saved!");
      // this._created_date =
    });
  }

  static delete(testd) {
    let list = JSON.parse(fs.readFileSync('data.json', "utf8"))
    list.pop({
      task: testd,
      done: false
    })
    fs.writeFile(data, JSON.stringify(list), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The task was removed!");
      Task.showList()
    });
  }

  static display(list) {
    let listAsc = list.slice(0, list.length)
    listAsc.sort(function (a, b) {
      return a.date > b.date
    })
    for (var i = 0; i < list.length; i++) {
      console.log(`${i+1}. Task: ${listAsc[i].task}    ||   Created date: ${listAsc[i].date}`)
    }
  }

  static listDesc(list) {
    var buf = JSON.parse(fs.readFileSync('data.json', "utf8"));
    let listDesc = buf.slice(0, buf.length)
    listDesc.sort(function (a, b) {
      return a.date < b.date
    })
    for (var i = 0; i < buf.length; i++) {
      console.log(`${i+1}. Task: ${listDesc[i].task}    ||   Created date: ${listDesc[i].date}`)
    }
  }


  static showList() {

    console.log('--------------- To Do List --------------------');
    var buf = JSON.parse(fs.readFileSync('data.json', "utf8"));
    // for (let i = 0; i < buf.length; i++) {
    //   console.log(buf[i]["task"]);
    // };
    Task.display(buf);
  }

  static help(testd) {
    Task.start()
  }

  static remove() {
    console.log()

  }
}
class Item {





}





switch (process.argv[2]) {
case 'list':
  Task.showList()
  break;
case 'add':
  Task.add(args1)
  console.log(args1);
  break;
case 'delete':
  Task.delete()
  break;
case `remove`:
  Task.remove()
  break;
case 'help':
  Task.help()
  break;
case 'listdesc':
  Task.listDesc()
  break;
default:
  Task.start()

  break;

};
