/* blockchain-task-manager/contracts/src/TaskManager.sol */
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TaskManager is Ownable {
    struct Task {
        uint256 id;
        string title;
        string description;
        bool completed;
        address owner;
    }

    uint256 private taskCounter;
    mapping(uint256 => Task) public tasks;
    mapping(address => uint256[]) private userTasks;
    mapping(address => mapping(uint256 => uint256)) private taskIdToIndex;

    event TaskAdded(uint256 indexed taskId, address indexed owner);
    event TaskUpdated(uint256 indexed taskId);
    event TaskCompleted(uint256 indexed taskId);
    event TaskDeleted(uint256 indexed taskId);

    constructor() Ownable(msg.sender) {}

    // Add a new task
    function addTask(string calldata _title, string calldata _description) external {
        uint256 taskId = taskCounter++;
        Task memory newTask = Task({
            id: taskId,
            title: _title,
            description: _description,
            completed: false,
            owner: msg.sender
        });
        tasks[taskId] = newTask;
        userTasks[msg.sender].push(taskId);
        taskIdToIndex[msg.sender][taskId] = userTasks[msg.sender].length - 1;
        emit TaskAdded(taskId, msg.sender);
    }

    // Mark a task as completed
    function markCompleted(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.owner == msg.sender, "Not owner");
        task.completed = true;
        emit TaskCompleted(_taskId);
    }

    // Edit a task
    function editTask(uint256 _taskId, string calldata _title, string calldata _description) external {
        Task storage task = tasks[_taskId];
        require(task.owner == msg.sender, "Not owner");
        task.title = _title;
        task.description = _description;
        emit TaskUpdated(_taskId);
    }

    // Delete a task (gas-optimized)
    function deleteTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.owner == msg.sender, "Not owner");
        
        // Swap and pop to avoid shifting the entire array
        uint256 taskIndex = taskIdToIndex[msg.sender][_taskId];
        uint256 lastIndex = userTasks[msg.sender].length - 1;
        if (taskIndex != lastIndex) {
            uint256 lastTaskId = userTasks[msg.sender][lastIndex];
            userTasks[msg.sender][taskIndex] = lastTaskId;
            taskIdToIndex[msg.sender][lastTaskId] = taskIndex;
        }
        userTasks[msg.sender].pop();
        delete taskIdToIndex[msg.sender][_taskId];
        delete tasks[_taskId];
        
        emit TaskDeleted(_taskId);
    }

    // Fetch task IDs for a user
    function getUserTaskIds(address _user) external view returns (uint256[] memory) {
        return userTasks[_user];
    }
}