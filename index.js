let fs = require('fs');
let path = require('path');
let collecDirectory = './collections';
let schemaDirectory = './schemas';
let collection = {};

!fs.existsSync(collecDirectory) ? fs.mkdirSync(collecDirectory) : console.log('badcube found collections folder');
!fs.existsSync(schemaDirectory) ? fs.mkdirSync(schemaDirectory) : console.log('badcube found schemas folder');

function Model(modelName, collectionRef, collectionObj) {

	this.modelName = modelName;
	this.collectionRef = collectionRef;
	this.collection = collectionObj;

	this.find = function (queryObj) {
		return this.collection.find((element, index) => {
			let searchKey = Object.keys(queryObj)[0];
			let searchValue = Object.values(queryObj)[0];
			return element[searchKey] === searchValue;
		});
	};

	this.findAll = function (queryObj) {
		return this.collection.filter((element) => {
			let searchKey = Object.keys(queryObj)[0];
			let searchValue = Object.values(queryObj)[0];
			return element[searchKey] === searchValue;
		});
	};

	this.rewrite = function () {
		fs.writeFileSync(this.collectionRef, JSON.stringify(this.collection, null, 2));
		this.collection = this.findAll({});
	};

	this.insert = function (newObj) {
		this._collectionInsertion(newObj)
		this.rewrite();
		return newObj;
	};

	this.insertMany = function (arr) {
		if (Array.isArray(arr)) {
			arr.forEach((item) => {
				this._collectionInsertion(item);
			});
			this.rewrite();
			return arr;
		}
		else { throw "Did not insertMany an Array" };
	};

	this.update = function (queryObj, newObj) {
		let queryResult = this.find(queryObj);
		let queryLoc = this.collection.indexOf(queryResult);
		let updatedObj = Object.assign(queryResult, newObj);
		updatedObj._modDate = Date.now();
		this.collection.splice(queryLoc, 1, updatedObj);
		this.rewrite();
		return queryObj;
	};

	this.delete = function (queryObj) {
		let deleteLoc = this.collection.indexOf(this.find(queryObj));
		this.collection.splice(deleteLoc, 1);
		this.rewrite()
		return queryObj;
	};

	this._collectionInsertion = function (newObj) {
		if (this instanceof Schema) {
			this.schemaCheck(newObj);
		}
		if (typeof newObj === 'object' && !Array.isArray(newObj)) {
			newObj._id = Math.random().toString(36).substring(2, 15);
			newObj._createdDate = Date.now();
			newObj._updatedDate = Date.now();
			this.collection.push(newObj);
		}
		else { throw "not an object" };
	};
	//this.softDelete = function(){}
	//i/o for future implementation
	//this.toCSV = function(){}
	//this.toMongo = function(){}
	//this.toSQL = function(){}

};

function Schema(schema, name, collectionRef, collectionObj) {
	Model.call(this, name, collectionRef, collectionObj);
	this.schema = schema;
	this.schemaCheck = function (queryObj) {
		let entries = Object.entries(queryObj);
		entries.forEach((valArr) => {
			if (!(Object.getPrototypeOf(valArr[1]).constructor === this.schema[valArr[0]])) {
				throw "A Schema check failure";
			};
		});
		return true;
	};
};

let collecNames = [];
let schemaNames = [];
exports.collections = collection;

fs.readdirSync(schemaDirectory)
	.forEach((filename) => {
		let tempName = filename.split('.')[0];
		tempName = tempName.charAt(0).toUpperCase() + tempName.slice(1);
		let schemaRef = require(path.join('../../', schemaDirectory, filename));
		exports[tempName] = new Schema(schemaRef, tempName, path.join(collecDirectory, tempName + '.json'), []);
		exports[tempName].findAll({});
		schemaNames.push(filename);
	});

fs.readdirSync(collecDirectory)
	.forEach((filename) => {
		let nameArray = filename.split('.');
		if (nameArray[nameArray.length - 1] === 'json') {
			let tmp = require(path.join('../../' + collecDirectory, nameArray[0]));
			if (typeof tmp === "array" || typeof tmp === "object") {
				let tempName = nameArray[0].charAt(0).toUpperCase() + nameArray[0].slice(1);
				if (exports[tempName]) { return };
				exports[tempName] = new Model(tempName, path.join(collecDirectory, filename), tmp);
				collecNames.push(filename);
			}
		}
		else { return };
	});

exports.Model = Model;
exports.Schema = Schema;
console.log('badcube successfully imported', collecNames);
console.log('badcube successfully imported', schemaNames);
