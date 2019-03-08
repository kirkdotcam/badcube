let fs = require('fs');
let path = require('path');

function badcube(options){

	if(options.dbPath){
			var collecDirectory = path.join(options.dbPath,'./collections');
			var schemaDirectory = path.join(options.dbPath, './schemas');
	} else{
		var collecDirectory = path.join(__dirname,'..','..','./collections');
		var schemaDirectory = path.join(__dirname,'..','..','./schemas');
	}

	let collection = {};
	console.log(collecDirectory, schemaDirectory);

	!fs.existsSync(collecDirectory)
		? fs.mkdirSync(collecDirectory)
		: console.log('badcube found collections folder');


	!fs.existsSync(schemaDirectory)
		? fs.mkdirSync(schemaDirectory)
		: console.log('badcube found schemas folder');




		return {
			Model: Model
		}
}

function Model(modelName, collectionRef, collectionObj){
	console.log("hello world")
	this.modelName = modelName;
	this.collectionRef = collectionRef;
	this.collection = collectionObj;

	this.insert = function(newObj){
		this._collectionInsertion(newObj);
		this.rewrite();
		return newObj;
	}

	this._collectionInsertion(newObj){
		
	}
}

function Schema(schemaName){return}
module.exports = badcube;
exports.Model = Model;
