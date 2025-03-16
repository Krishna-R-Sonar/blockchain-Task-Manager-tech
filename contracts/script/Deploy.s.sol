/* blockchain-task-manager/contracts/srcipts/Deploy.s.sol */
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {TaskManager} from "../src/TaskManager.sol";
import {console} from "forge-std/console.sol";

contract DeployTaskManager is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        TaskManager taskManager = new TaskManager();
        
        vm.stopBroadcast();
        
        // Log important information
        console.log("TaskManager deployed to:", address(taskManager));
    }
}