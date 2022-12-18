// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract ChainNote {

    struct Todo {
        uint256 id;
        string title;
        string description;
        bool status;
    }
    mapping(address => Todo[]) public todos;

    function createTodo(string calldata title, string calldata description) payable public {
        Todo memory myTodo;
        myTodo.id = (todos[msg.sender].length)+1;
        myTodo.title = title;
        myTodo.description = description;
        myTodo.status = false;

        todos[msg.sender].push(myTodo);
    }

    function returnTodos(address reader) public view returns( Todo [] memory){
        return todos[reader];
    }

    function markTrue(uint256 id) payable public {
        for(uint256 i = 0; i < todos[msg.sender].length; i++){
            if((todos[msg.sender][i].id) == id){
                todos[msg.sender][i].status = true;
            }
        }
    }

    function updateTodos(uint256 id, string calldata title, string calldata description) payable public {
        for(uint256 i = 0; i < todos[msg.sender].length; i++){
            if((todos[msg.sender][i].id) == id){
                todos[msg.sender][i].title = title;
                todos[msg.sender][i].description = description;
            }
        }
    }
    
}