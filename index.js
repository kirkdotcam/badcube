
exports.printMsg = function(){
	console.log("hello world");
}
let fs = require('fs');
let path = require('path')
let collec = './collections'
let models = {}

if(!fs.existsSync(collec)){
	fs.mkdirSync(collec)
}

fs.readdir(collec, (err,files) => {
	if (files === null) throw "no collections in folder"
	console.log(files)

	files.forEach((filename) => {
		var nameArray = filename.split('.')
		if (nameArray[nameArray.length-1]==='json'){
			models[nameArray[0]]=require(path.join(__dirname,collec,nameArray[0]))
			console.log(Object.keys(models))
		}
		//check if json file,parse, verify parsed file, else return
		//if json, check if file has things in it, else return
		//if file has things in it, read in data
	})
})
/*
initialize fs
CRUD
i/o


*/
