const Promise = artifacts.require("Promise");

contract("Promise cost", async accounts => {
    let provider = accounts[1];
    let user = accounts[2];
    
    it("mega-test", async () => {
        let instance = await Promise.deployed();

    });
}

