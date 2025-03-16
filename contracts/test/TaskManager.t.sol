/* blockchain-task-manager/contracts/test/TaskManager.t.sol */
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "forge-std/Test.sol";
import "../src/TaskManager.sol";

contract TaskManagerTest is Test {
    TaskManager taskManager;
    address user1 = vm.addr(1);
    address user2 = vm.addr(2);

    function setUp() public {
        taskManager = new TaskManager();
    }

    // Helper function to get task details as tuple
    function getTask(uint256 taskId) public view returns (
        uint256 id,
        string memory title,
        string memory description,
        bool completed,
        address owner
    ) {
        return taskManager.tasks(taskId);
    }

    function testAddTask() public {
        vm.prank(user1);
        taskManager.addTask("Task 1", "Description 1");
        
        uint256[] memory taskIds = taskManager.getUserTaskIds(user1);
        (, string memory title, string memory desc, bool completed, address owner) = getTask(taskIds[0]);
        
        assertEq(taskIds.length, 1);
        assertEq(title, "Task 1");
        assertEq(desc, "Description 1");
        assertEq(completed, false);
        assertEq(owner, user1);
    }

    function testAddMultipleTasks() public {
        vm.startPrank(user1);
        taskManager.addTask("Task 1", "Desc 1");
        taskManager.addTask("Task 2", "Desc 2");
        vm.stopPrank();

        uint256[] memory taskIds = taskManager.getUserTaskIds(user1);
        (uint256 id1, , , , ) = getTask(0);
        (uint256 id2, , , , ) = getTask(1);
        
        assertEq(taskIds.length, 2);
        assertEq(id1, 0);
        assertEq(id2, 1);
    }

    function testMarkCompleted() public {
        vm.startPrank(user1);
        taskManager.addTask("Task", "Desc");
        uint256[] memory taskIds = taskManager.getUserTaskIds(user1);
        taskManager.markCompleted(taskIds[0]);
        vm.stopPrank();

        (, , , bool completed, ) = getTask(taskIds[0]);
        assertTrue(completed);
    }

    function testMarkCompletedUnauthorized() public {
        vm.prank(user1);
        taskManager.addTask("Task", "Desc");
        
        vm.prank(user2);
        vm.expectRevert("Not owner");
        taskManager.markCompleted(0);
    }

    function testEditTask() public {
        vm.startPrank(user1);
        taskManager.addTask("Original", "Original Desc");
        taskManager.editTask(0, "Updated", "Updated Desc");
        vm.stopPrank();

        (, string memory title, string memory desc, , ) = getTask(0);
        assertEq(title, "Updated");
        assertEq(desc, "Updated Desc");
    }

    function testEditNonExistentTask() public {
        vm.prank(user1);
        vm.expectRevert("Not owner");
        taskManager.editTask(999, "Title", "Desc");
    }

    function testDeleteTask() public {
        vm.startPrank(user1);
        taskManager.addTask("Task 1", "Desc 1");
        taskManager.addTask("Task 2", "Desc 2");
        taskManager.deleteTask(0);
        vm.stopPrank();

        // Check task 0 is deleted
        (, , , , address owner) = getTask(0);
        assertEq(owner, address(0));

        // Check remaining task
        uint256[] memory taskIds = taskManager.getUserTaskIds(user1);
        (uint256 remainingId, , , , ) = getTask(taskIds[0]);
        assertEq(remainingId, 1);
    }

    function testDeleteLastTask() public {
        vm.startPrank(user1);
        taskManager.addTask("Task", "Desc");
        taskManager.deleteTask(0);
        vm.stopPrank();

        uint256[] memory taskIds = taskManager.getUserTaskIds(user1);
        assertEq(taskIds.length, 0);
    }

    function testDeleteNonExistentTask() public {
        vm.prank(user1);
        vm.expectRevert("Not owner");
        taskManager.deleteTask(999);
    }

    // Test events
    function testTaskAddedEvent() public {
        vm.expectEmit(address(taskManager));
        emit TaskManager.TaskAdded(0, user1);

        vm.prank(user1);
        taskManager.addTask("Task", "Desc");
    }

    function testTaskCompletedEvent() public {
        vm.prank(user1);
        taskManager.addTask("Task", "Desc");

        vm.expectEmit(address(taskManager));
        emit TaskManager.TaskCompleted(0);

        vm.prank(user1);
        taskManager.markCompleted(0);
    }

    // Edge case: Interaction with empty task list
    function testGetEmptyTaskList() public view {
        uint256[] memory taskIds = taskManager.getUserTaskIds(user1);
        assertEq(taskIds.length, 0);
    }

    // Edge case: Double deletion attempt
    function testDoubleDelete() public {
        vm.startPrank(user1);
        taskManager.addTask("Task", "Desc");
        taskManager.deleteTask(0);
        
        vm.expectRevert("Not owner");
        taskManager.deleteTask(0);
        vm.stopPrank();
    }
}