# badcube.js
### The tiny filesystem node.js database no one asked for.
badcube.js is an ultra-minimal filesystem database that anyone can drop into a project that needs to store data but not be deployed to the web. It has a built-in ODM that allows for checking the constructor of object keys as they are being inserted into the database. The key benefits to using badcube are the ease of implementation, and the resultant data file is a JSON array which can subsequently be used in imports to other databases or re-used anywhere JSON files are useful. Additionally, the implementation is written in such a way that it is easy to refactor a codebase to use [mongoose](https://www.npmjs.com/package/mongoose) if you have been working in badcube.

It should be noted that the data in the filesystem will also exists in memory until the running application purges the memory copy or stops the application.

## Installation

```sh
$ npm install badcube
```

## Collections and Schemas Folders

When badcube is brought into your project using `require`, it will auto-scan your directory looking for collections and schemas. If it fails to find these folders it will create them for you. The collections folder will contain the JSON files with your data, and the schemas folder will contain your schema files. The format for each will be discussed in the [Models and Schemas](#Models-and-Schemas) section below. Upon starting a project with badcube, logs will print containing information about which valid collections and schemas were imported into memory for use.

## Models and Schemas

Models are the structures that serve as references to the `.json` files in the collections folder. They enable simple CRUD operations on the filesystem and when used in conjunction with schemas, can type check data being inserted in the database.

To create a model, simply ensure that the collections folder contains a `.json` file for the data you wish to save. At minimum, ensure that it contains an empty array `[]`. badcube will automatically create a model for that file, with a capitalized name. For example,

```js
//In /collections, there is a file called apples.json

let bc = require('badcube');
//Console will give message saying that it has foundapples.json

console.log(bc.Apples.findAll({}));
//Logs the entire JSON array for apples.json.
```
Operations that can be performed with the models are discussed in the [API](#API) section. If you would like to create a model after the initilization, the constructor function is exposed on the `require()`, so you may use it. [Documentation](#Creating-Models-After-initialization) is available below

Schemas are simple objects containing constructor references that are used to check data being inserted into the database. Similarly to models, creation of a schema is automated as long as the file for it is in the schemas folder. Schemas in badcube are plainObjects (they do not support deep searching as of this version) in which the value of each key is a reference to a constructor function. For example,

```js
// /schemas/Oranges.js
module.exports = {
    variety: String,
    size: String,
    number: Number
    }

```

For more advanced uses, one can use user-defined constructors in this object provided that they are available in the schema file.


## API

In this section we provide documentation for the use of Models and Schemas to handle data.

### Schemas
The Schema prototype is an extension to the [Model](#Models) prototype, and contains only one extra function, `.schemaCheck()`. When a schema is instantiated, you can still run all of the same methods from Model.
- Schema.schemaCheck(_obj_)
```js
//using Oranges schema from above
Oranges.schemaCheck({
    variety: "Navel",
    size: "Medium",
    number: 13
});
//returns true

Oranges.schemaCheck({
    variety: 49,
    size: "salty",
    many: "many"
});
// THROWS an error
```

Note that schemaCheck will _only_ check if the values for the properties of the _inserted_ object are equivalent to the constructor **listed in the schema**. To clarify,

```js
Oranges.schemaCheck({
    variety: "Mandarin"
});
//returns true

Oranges.schemaCheck({
    seeds:33
});
//also returns true
```

### Models
The Model prototype contains several different functions for basic CRUD operations.

Model.find(_queryObj_)

Model.find() currently allows searching for a single object by a single property.

```js
Oranges.find({
    variety: "Navel"
});

/*
returns
{
    variety: "Navel",
    size: "Medium",
    number: 13
}
*/
```

Model.findAll(_queryObj_)

Similar to .find(), .findAll() will grab _each_ instance of an object with a matching property and return them in an array.

```js
Oranges.findAll({
    size: "Medium"
});

/*
returns
[{
    variety: "Navel",
    size: "Medium",
    number: 13
},{
    variety: "Mandarin",
    size: "Medium",
    number: 55
}]
*/
```

Additionally, you can grab _all_ the objects in a collection by passing an empty object e.g. `Oranges.findAll({})`.

Model.insert(_obj_)

the `.insert()` method takes an object and inserts it into the appropriate JSON array, then rewrites the file. If the Model is a Schema, it first does a .schemaCheck() to ensure that the inserted object's values are from the right kind of constructor.

```js
Oranges.insert({
    variety: "Mandarin",
    size: "Medium",
    number: 55
});
```
The `.insert()` method also _returns_ the inserted object. The objet inserted into the database will contain three additional properties:
- _id: a randomly generated identifier
- _createdDate: UTC timestamp of time of record creation
- _updatedDate: UTC timestamp of time of record modification

Model.insertMany(_array of obj_)

`.insertMany()` is analogous to `.insert()` but instead takes an array of objects.

Model.update(_queryobj_,_toUpdateObj_)

`.update()` takes two arguments, the object to find in the database (has same rules as `find()`) and then updates the object with the properties in the toUpdateObj. This uses the Object.assign() method, and thus will update properties for those that already exist on the toUpdateObj and add those that are not there yet.

Model.delete(_queryobj_)

`.delete()` finds a record (same rules as `.find()`) and removes it from the json file.

## Creating Models After initialization
The Model and Schema constructor functions are exposed on the `.require()`,

```js
let bc = require('bc');
bc.Model(modelName, collectionRef, collectionObj);


bc.Schema(schemaObj, schemaName, collectionRef, collectionObj)

```

## Why build this?
[More about that here](https://medium.com/@camkirk/introducing-badcube-js-the-tiny-node-js-database-no-one-asked-for-bf9920fa5d81)

PR is welcome!
