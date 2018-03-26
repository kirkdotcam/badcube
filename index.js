let fs = require('fs');
let path = require('path')
let collecDirectory = './collections'
let collection = {}

if(!fs.existsSync(collecDirectory)){
	fs.mkdirSync(collecDirectory)
}

fs.readdir(collecDirectory, (err,files) => {
	if (files === null) throw "no collection json files in folder"
	let collecNames = []
	files.forEach((filename) => {
		let nameArray = filename.split('.')
		if (nameArray[nameArray.length-1]==='json'){
			let tmp = require(path.join(__dirname,collecDirectory,nameArray[0]))
			if(typeof tmp === "array"||typeof tmp ==="object"){
					collection[nameArray[0]]= tmp
					collecNames.push(filename)
				}
			}
		else{return}
	})
	console.log('badcube Successfully imported',collecNames)
	exports.collections = collection
});

function Schema(name,collectionRef){
	if(!this instanceof Schema){
		return new Schema(name)
	}

	let tempName = name.charAt(0).toUpperCase() + string.slice(1)
	
	this.name = tempName
	this.collection = collectionRef
	this.find = function(queryObj){}
	this.findAll = function(queryObj){}
	this.insert = function(newObj){
		//grab collection
		//add new object
		//rewrite file
		
	}
	this.insertMany = function(array){}
	this.update = function(queryObj, newObj){}
	this.delete = function(queryObj){}

	//i/o for future implementation
	//this.toMongo = function(){}
	//this.toSQL = function(){}

}