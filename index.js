let fs = require('fs');
let path = require('path');
let collecDirectory = './collections';
let collection = {};

if(!fs.existsSync(collecDirectory)){
	fs.mkdirSync(collecDirectory);
}


function Model(name,collectionRef,collectionObj){
	// if(!this instanceof this.Model){
	// 	return new Model(name)
	// }


	this.name = name;
	this.collectionRef = collectionRef;
	this.collection = collectionObj;

	this.find = function(queryObj){
		return this.collection.find((element,index)=>{
			let searchKey = Object.keys(queryObj)[0];
			let searchValue = Object.values(queryObj)[0];
			return  element[searchKey] === searchValue;
		});
	};

	this.findAll = function(queryObj){
		return this.collection.filter((element)=>{
			let searchKey = Object.keys(queryObj)[0];
			let searchValue = Object.values(queryObj)[0];
			return  element[searchKey] === searchValue;
		});
	};

	this.rewrite = function(){
		fs.writeFileSync(this.collectionRef,JSON.stringify(this.collection,null,2));
		this.collection=this.findAll({});
	};

	this.insert = function(newObj){
		if(typeof newObj === 'object'){
			this.collection.push(newObj);
			this.rewrite();
			return newObj;
		}
		else{throw "not an object"};
	};

	this.insertMany = function(arr){
		if(Array.isArray(arr)){
			arr.forEach((item)=>{
				if(typeof item === 'object' && !Array.isArray(item)){
					this.collection.push(item);
				}
			});
			this.rewrite();
			return arr;
		}
		else{throw "Did not insertMany an Array"};
	};

	this.update = function(queryObj, newObj){
		let queryResult = this.find(queryObj);
		let queryLoc = this.collection.indexOf(queryResult);
		let updatedObj = Object.assign(queryResult,newObj);
		this.collection.splice(queryLoc,1,updatedObj);
		this.rewrite();
		return queryObj;
	};

	this.delete = function(queryObj){
		let deleteLoc = this.collection.indexOf(this.find(queryObj));
		this.collection.splice(deleteLoc,1);
		this.rewrite()
		return queryObj;
	};

	//i/o for future implementation
	//this.toMongo = function(){}
	//this.toSQL = function(){}

};

let collecNames = [];
fs.readdirSync(collecDirectory)
 	.forEach((filename) => {
		let nameArray = filename.split('.');
		if (nameArray[nameArray.length-1]==='json'){
			let tmp = require(path.join('../../'+collecDirectory,nameArray[0]));
			if(typeof tmp === "array"||typeof tmp ==="object"){
					let tempName = nameArray[0].charAt(0).toUpperCase() + nameArray[0].slice(1);
					global[tempName] = new Model(tempName,path.join(collecDirectory,filename),tmp);
					collecNames.push(filename);
				}
			}
		else{return};
	});

console.log('badcube successfully imported',collecNames);
exports.collections = collection;
