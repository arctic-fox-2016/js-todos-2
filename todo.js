var fs = require('fs')

class Task {
	constructor(input) {
		this.task = input
		this.status = "X"
		this.createdAt = Date()
		this.completedAt = "-"
		this.tag = []
	}
}

class Program{
	constructor(){
		this.list = JSON.parse(fs.readFileSync('data.json'))
	}

	tasklist(){
		for(let i = 0; i < this.list.length; i++){
			console.log((i+1) + ". " + this.list[i].task + "\n   Status: " + this.list[i].status + "\n   Created At: " + this.list[i].createdAt + "\n   Completed At: " + this.list[i].completedAt + "\n   Tags: " + this.list[i].tag)
		}
	}

	add_task(input){
		this.list.push(new Task(input))
		fs.writeFile('data.json',JSON.stringify(this.list));
		console.log(input + " berhasil ditambahkan!")
	}

	delete_task(input){
		let found = 0

		for(let i = 0; i < this.list.length; i++){
			if(input == this.list[i].task){
				this.list.splice(i,1)
				fs.writeFile('data.json',JSON.stringify(this.list))
				console.log(input + " berhasil dihapus!")
				found = 1
			}
		}
		if(found == 0){
				console.log(input + " tidak ditemukan!")
		}
	}

	check_task(input){
		let found = 0

		for(let i=0; i<this.list.length;i++){
			if(input == this.list[i].task && this.list[i].status == "X"){
				this.list[i].status = "✓"
				this.list[i].completedAt = Date()
				fs.writeFile('data.json',JSON.stringify(this.list))
				console.log(input + " berhasil di-check!")
				found = 1
			}
		}

		if(found == 0){
				console.log(input + " tidak ditemukan!")
		}
	}

	uncheck_task(input){
		let found = 0

		for(let i=0; i<this.list.length;i++){
			if(input == this.list[i].task && this.list[i].status != "X"){
				this.list[i].status = "X"
				this.list[i].completedAt = " "
				fs.writeFile('data.json',JSON.stringify(this.list))
				console.log(input + " berhasil di-uncheck!")
				found = 1
			}
		}

		if(found == 0){
				console.log(input + " tidak ditemukan!")
		}
	}

	tag_task(input,temp_tag){
		let f=0

		for(let i=0;i<this.list.length;i++){
			if(input == this.list[i].task){
				for(let j=0;j<temp_tag.length;j++){
					this.list[i].tag.push(temp_tag[j])
					fs.writeFile('data.json',JSON.stringify(this.list))
					console.log("Tag " + temp_tag[j] + " berhasil ditambahkan!")
					f = 1
				}
			}
		}
		if(f == 0){
			console.log("Task tidak ditemukan!")
		}
	}

	display_menu(){
		console.log("Welcome to To-Do-List Program! Here's Your List:")
		this.tasklist()
		console.log("==================================================")
		console.log("1. Add task - node todo.js add <task-name>")
		console.log("2. Delete task - node todo.js delete <task-name>")
		console.log("3. Check task - node todo.js check <task-name>")
		console.log("4. Uncheck task - node todo.js uncheck <task-name>")
		console.log("4. Tag task - node todo.js tag <task-name> <tag-name> <tag-name> .. <tag-name>")
		console.log("5. Sort unchecked tasks - node todo.js uncheckedtasks asc|desc")
		console.log("6. Sort checked tasks - node todo.js checkedtasks asc|desc")
		console.log("7. Sort tasks by tag - node todo.js taggedtasks <tag-name> <tag-name> .. <tag-name>")
	}

	display_unchecked_tasks(input){
		let j=1

		if(input == "asc"){
			this.list.sort(function(a,b){
				if(a.createdAt > b.createdAt){
					return 1
				}
				if(a.createdAt < b.createdAt){
					return -1
				}
				return 0
			})

			for(let i = 0; i < this.list.length; i++){
				if(this.list[i].status == "X"){
					console.log((j) + ". " + this.list[i].task + "\n   Status: " + this.list[i].status + "\n   Created At: " + this.list[i].createdAt + "\n   Completed At: " + this.list[i].completedAt + "\n   Tags: " + this.list[i].tag)
					j++
				}
			}
		}

		else if(input == "desc"){
			this.list.sort(function(a,b){
				if(a.createdAt > b.createdAt){
					return -1
				}
				if(a.createdAt < b.createdAt){
					return 1
				}
				return 0
			})

			for(let i = 0; i < this.list.length; i++){
				if(this.list[i].status == "X"){
					console.log((j) + ". " + this.list[i].task + "\n   Status: " + this.list[i].status + "\n   Created At: " + this.list[i].createdAt + "\n   Completed At: " + this.list[i].completedAt + "\n   Tags: " + this.list[i].tag)
					j++
				}
			}
		}
		else{
			console.log("Perintah yang Anda masukkan salah!")
		}
	}

	display_checked_tasks(input){
		let j=1

		if(input == "asc"){
			this.list.sort(function(a,b){
				if(a.createdAt > b.createdAt){
					return 1
				}
				if(a.createdAt < b.createdAt){
					return -1
				}
				return 0
			})

			for(let i = 0; i < this.list.length; i++){
				if(this.list[i].status == "✓"){
					console.log((j) + ". " + this.list[i].task + "\n   Status: " + this.list[i].status + "\n   Created At: " + this.list[i].createdAt + "\n   Completed At: " + this.list[i].completedAt + "\n   Tags: " + this.list[i].tag)
					j++
				}
			}
		}

		else if(input == "desc"){
			this.list.sort(function(a,b){
				if(a.createdAt > b.createdAt){
					return -1
				}
				if(a.createdAt < b.createdAt){
					return 1
				}
				return 0
			})

			for(let i = 0; i < this.list.length; i++){
				if(this.list[i].status == "✓"){
					console.log((j) + ". " + this.list[i].task + "\n   Status: " + this.list[i].status + "\n   Created At: " + this.list[i].createdAt + "\n   Completed At: " + this.list[i].completedAt + "\n   Tags: " + this.list[i].tag)
					j++
				}
			}
		}
		else{
			console.log("Perintah yang Anda masukkan salah!")
		}
	}

	display_tagged_tasks(temp_tag){
		let m = 1 //nomor task

		for(let i=0;i<this.list.length;i++){ //looping list
			let l=0
			for(let j=0;j<this.list[i].tag.length;j++){ //looping tag pada list
				for(let k=0;k<temp_tag.length;k++){ // looping tag yang diinput
					if(this.list[i].tag[j] == temp_tag[k]){ // cek kondisi jika tag input = tag pada list
						l++
					}
				}
			}
			if(l == temp_tag.length){ //print jika jumlah tag pada temp_tag = jumlah tag yang ditemukan pada tag
				console.log((m) + ". " + this.list[i].task + "\n   Status: " + this.list[i].status + "\n   Created At: " + this.list[i].createdAt + "\n   Completed At: " + this.list[i].completedAt + "\n   Tags: " + this.list[i].tag)
				m++
			}
		}

		if(m==1){
			console.log("Task dengan tag yang dimasukkan tidak ditemukan!")
		}
	}

	start(){
		switch (process.argv[2]) {
			case "add":
				this.add_task(process.argv[3])
				break
			case "delete":
			 	this.delete_task(process.argv[3])
				break
			case "check":
				this.check_task(process.argv[3])
				break
			case "uncheck":
				this.uncheck_task(process.argv[3])
				break
			case "tag":
				let temp_tag = []
				for(let i=4;i<process.argv.length;i++){
					temp_tag.push(process.argv[i])
				}
				this.tag_task(process.argv[3],temp_tag)
				break
			case "uncheckedtasks":
				this.display_unchecked_tasks(process.argv[3])
				break
			case "taggedtasks":
				let temp_tag_2 = []
				for(let i=3;i<process.argv.length;i++){
					temp_tag_2.push(process.argv[i])
				}
				this.display_tagged_tasks(temp_tag_2)
				break
			case "checkedtasks":
				this.display_checked_tasks(process.argv[3])
				break
			default:
				this.display_menu()
				break
		}
	}
}

let todolist = new Program
todolist.start()
