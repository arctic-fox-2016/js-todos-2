'use strict'
const fs = require('fs')
class Parser {
  static getFileTodo(){
    let file = JSON.parse(fs.readFileSync('data.json').toString())
    return file
  }
  static saveToFileTodo(file){
    fs.writeFile('data.json', file, (err) => {
      if (err) throw err
      console.log('It\'s saved!')
    })
  }
}
export default Parser
