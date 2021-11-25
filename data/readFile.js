'use strict';

const fs = require('fs');


fs.readFile('local.json', (err, data) => {
    if(err) throw err;
    let address = JSON.parse(data);
    let new_data = [];
    address.forEach(adres => {
        let districts = [];
        adres.districts.forEach(district => {
            districts.push({id: district.id, name: district.name, wards: district.wards})
        })
        new_data.push({id: adres.id, name: adres.name, districts})  
    });
    fs.writeFile("location.json", JSON.stringify(new_data), (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
      });
})