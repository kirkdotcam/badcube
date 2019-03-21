let fs = require('fs');

function find(path, queryObj) {
    return new Promise((resolve, reject) => {
        let results = [];
        
        let reader = fs.createReadStream(path)
        reader.on('readable', () => {
            console.log('stream opened');  
            
        });
        reader.on("data", (data) => {
    
            let bufferedString = '';

            bufferedString += data;

            let boundary = bufferedString.indexOf('\n');

            while (boundary !== -1) {

                const input = bufferedString.substring(0, boundary);
                bufferedString = bufferedString.substring(boundary + 1);

                try {
                    let localObject = JSON.parse(input)
                    if(localObject.albumId == queryObj.albumId) results.push(localObject);
                }

                catch (err) {
                    boundary = bufferedString.indexOf('\n');
                };

                boundary = bufferedString.indexOf('\n');
                
            }
        
        });

        reader.on("end", ()=> {
            console.log("stream closed")
            resolve(results);
        
        });

        reader.on("error", reject)

    })
}

function findAll(path, queryObj) {
    return new Promise((resolve, reject) => {
        let results = [];
        
        let reader = fs.createReadStream(path)
        reader.on('readable', () => {
            console.log('stream opened');  
            
        });
        reader.on("data", (data) => {
    
            let bufferedString = '';

            bufferedString += data;

            let boundary = bufferedString.indexOf('\n');

            while (boundary !== -1) {

                const input = bufferedString.substring(0, boundary);
                bufferedString = bufferedString.substring(boundary + 1);

                try {
                    let localObject = JSON.parse(input)
                    if(localObject.albumId == queryObj.albumId) results.push(localObject);
                }

                catch (err) {
                    boundary = bufferedString.indexOf('\n');
                };

                boundary = bufferedString.indexOf('\n');
                
            }
        
        });

        reader.on("end", ()=> {
            console.log("stream closed")
            resolve(results);
        
        });

        reader.on("error", reject)

    })
}

// how the HECK we gon do updates? duplex stream?
module.exports = find;