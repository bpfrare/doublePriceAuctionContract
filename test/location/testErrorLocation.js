const Trigonometry = artifacts.require("Trigonometry");
const fs = require('fs');
const distance = require('euclidean-distance');

contract('Test Error location', (accounts) => {
    const R = 6371.0
    
    let unifesp = {lat: -23.163217, lng: -45.794390};
    let unifesp_s = {lat: Math.round(unifesp.lat * 10**9), lng: Math.round(unifesp.lng * 10**9)};
    
    let temp = {lat: -23.163217, lng: -45.794390}

    
    it(`should be the same distance`, async () => {
      const TrigonometryInstance = await Trigonometry.deployed();
      for(let i=0; i < 2000; i++) {
        // Distance in Javascript
        let distJ = distance([unifesp.lat, unifesp.lng], [temp.lat, temp.lng]) 
        distJ = distJ * (Math.PI/180) * R * 1000
        distJ = Math.round(distJ);

        let temp_s = {lat: Math.round((temp.lat * 10**9)), lng: Math.round((temp.lng * 10**9))};
        
        let distS = await TrigonometryInstance.calcDistance(unifesp_s, temp_s);
        
        // increase distance
        temp.lat -= 0.001;
        temp.lng -= 0.001;
        console.log(temp);
        console.log(temp_s);
        
        // Write log
        let aux = (i+1).toString() + ';' + distS.toNumber() + ';' + distJ + '\r\n';
        console.log(aux);
        fs.appendFile('errorLoc.csv', aux, err => {
          if (err) {
            console.error(err)
          }
        });
      }
    });
});