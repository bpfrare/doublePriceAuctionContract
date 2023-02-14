
module.exports = async function(callback) {
    // var account = web3.eth.accounts.create();
    let accounts = await web3.eth.getAccounts();
    let promises = [];
    for(let i=0;i<100;i++) {
      console.log(accounts[i]);
      promises.push(web3.eth.sendTransaction({
        from: accounts[0],
        to: accounts[i],
        value: '1000000000000000'
    }));   
    }
    await Promise.all(promises);
    callback();
  }