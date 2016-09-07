let fs = require ('fs')
let temp = []
class Task {
	constructor(input){
		this._namaTask = input||"default: Masukan nama task"
		this._status = " "
		this._createdAt = Date()
		this._completedAt = " "
		this._tags = []
		this._lastModified = Date()
	}
}

class Generic{
	static readData(){
		temp = JSON.parse(fs.readFileSync('data.json', 'utf8'))
	}

	static writeData(){
		fs.writeFile('data.json', JSON.stringify(temp),function(err,data){})
	}

	static printCek(input, idx){
		if (input[idx]._status == "x"){
			console.log(`${idx}. ${input[idx]._namaTask} [${input[idx]._status}], last modified at ${temp[idx]._lastModified}, completed at ${temp[idx]._completedAt}`)
		} else {
			console.log(`${idx}. ${input[idx]._namaTask} [${input[idx]._status}], last modified ${input[idx]._lastModified}`)
		}
	}
}

class KumpulanTask{
	constructor(){
		temp = JSON.parse(fs.readFileSync('data.json', 'utf8'))
	}

	addTask(input){
		Generic.readData()
		temp.push(new Task(input))
		Generic.writeData()
		console.log(`Anda menambahkan ${input} kepada list anda`)
	}

	deleteTask(idx){
		Generic.readData()
		temp.splice(idx, 1)
		temp[idx]._lastModified = Date()
		Generic.writeData()
		console.log(`Anda menghapus ${temp[idx]._namaTask} dari list anda`)
	}

	completeTask(idx){
		Generic.readData()
		temp[idx]._status = "x"
		temp[idx]._completedAt = Date()
		temp[idx]._lastModified = Date()
		Generic.writeData()
		console.log(`Anda menyelesaikan ${temp[idx]._namaTask} dari list anda`)
	}

	uncompleteTask(idx){
		Generic.readData()
		temp[idx]._status = " "
		temp[idx]._status = " "
		temp[idx]._lastModified = Date()
		Generic.writeData()
		console.log(`Anda membuka open task ${temp[idx]._namaTask} dari list anda`)
	}

	displayTask(){
		Generic.readData()
		console.log("TO DO LIST KAMU")
		for (let idx in temp){
			Generic.printCek(temp, idx)
		}
	}

	displayOutstanding(){
		Generic.readData()
		console.log("Berikut list task-task anda yang masih outstanding")
		for (let idx in temp){
			Generic.printCek(temp, idx)
		}
	}

	displayCompleted(){
		Generic.readData()
		console.log("Berikut list task-task anda yang sudah complete")
		for (let idx in temp){
			Generic.printCek(temp, idx)
		}
	}

	tag(idx){
		console.log(`Anda melakukan tag untuk ${temp[idx]._namaTask}, dengan tag sebagai berikut:`)
		Generic.readData()
			for (let i = 4; i<= process.argv.length-1; i++){
				temp[idx]._tags.push(process.argv[i])
				temp[idx]._lastModified = Date()
				console.log(process.argv[i])
			}
		Generic.writeData()
	}

	filter(input){
		Generic.readData()
			//mencari smua task yang ada di temp
			for (let i in temp){
				//menyocokan di tag-tag yang ada, apakah ada tag yang dicari
				for (let j in temp[i]._tags){
					if(temp[i]._tags[j] == input){
						//jika ada, console.log task tersebut
						console.log(`${i}. ${temp[i]._namaTask} [${temp[i]._status}], last modified ${temp[i]._lastModified}`)
					}
				}
			}
	}

	displaySortA(){
		console.log("TAMPILAN SORT DARI PALING LAMA DIMODIFY KE PALING BARU DIMODIFY")
		Generic.readData()
		temp.sort(function(a,b){
			if(a._lastModified > b._lastModified){
				return 1;
			}
			if(a._lastModified < b._lastModified){
				return -1;
			}
			return 0;
		})
		for (let idx in temp){
			Generic.printCek(temp, idx)
		}
	}

	displaySortD(){
		console.log("TAMPILAN SORT DARI PALING BARU DIMODIFY KE PALING LAMA DIMODIFY")
		Generic.readData()
		temp.sort(function(a,b){
			if(a._lastModified > b._lastModified){
				return -1;
			}
			if(a._lastModified < b._lastModified){
				return 1;
			}
			return 0;
		})
		for (let idx in temp){
			Generic.printCek(temp, idx)
		}
	}


	displayMenu(){
		console.log("1. Add Task: example: node todo.js add 'makan buah'")
		console.log("2. Delete Task: example: node todo.js delete '2'")
		console.log("3. Display Task: example: node todo.js display")
		console.log("4. Menu: example: node todo.js help")
		console.log("5. Display Outstanding: node todo.js display-outstanding")
		console.log("6. Display Completed: node todo.js display-completed")
		console.log("7. Tag: node todo.js tag 2 airminum airpam")
		console.log("8. Filter: node todo.js filter airpam")
		console.log("9. Sort Ascending: node todo.js display-sort-a")
		console.log("10. Sort Descending: node todo.js display-sort-d")
	}

	start(){
		switch (process.argv[2]) {
			case "add":
				this.addTask(process.argv[3])
				break;
			case "delete":
				this.deleteTask(process.argv[3])
				break;
			case "display":
				this.displayTask()
				break;
			case "help":
				this.displayMenu()
				break;
			case "complete":
				this.completeTask(process.argv[3])
				break;
			case "uncomplete":
				this.uncompleteTask(process.argv[3])
				break;
			case "display-outstanding":
				this.displayOutstanding()
				break;
			case "display-completed":
				this.displayCompleted()
				break;
			case "tag":
				this.tag(process.argv[3])
				break;
			case "filter":
				this.filter(process.argv[3])
				break;
			case "display-sort-a":
				this.displaySortA()
				break;
			case "display-sort-d":
				this.displaySortD()
				break;
			default:
				this.displayMenu()
				break;
		}
	}

}
//Driver Code Andrew
let todoku = new KumpulanTask()
todoku.start()
