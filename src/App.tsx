import React, { useState } from 'react';
import './App.css';
import InputField from './components/InputField';
import { Todo } from './model';
import TodoList from './components/TodoList';
import {DragDropContext, DropResult} from 'react-beautiful-dnd'

const App:React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]); /*for drag and drop */

  const handleAdd = (e:React.FormEvent)=>{
    e.preventDefault();
    if (todo){
      setTodos([...todos, {id:Date.now(),
      todo:todo, isDone:false}]); // add to the list
      setTodo(""); //empty the input field
    }
  };

  /* Define the onDrag function */
  const onDragEnd =(result:DropResult)=>{
    const {source, destination} = result;
    // base case: if dragged to nowhere, return nothing
    if(!destination||
      (destination.droppableId===source.droppableId&&destination.index === source.index)){
      return;
    }
    let add, 
      active = todos,
      complete = completedTodos;

    if(source.droppableId === 'TodosList'){
      add = active[source.index];
      active.splice(source.index,1); //remove from the list
      
    }else{
      add = complete[source.index];
      complete.splice(source.index,1);
    }
    // add to destination
    if(destination.droppableId === 'TodosList'){
      active.splice(destination.index,0, add);
    }else{
      complete.splice(destination.index,0, add);
    }
    // add to the state
    setCompletedTodos(complete);
    setTodos(active);
  }
  // Today's date
  let todaydate = new Date().toLocaleDateString();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
    <div className="App">
      <span className="heading">Tasky | {todaydate}</span>
      <InputField todo={todo} setTodo = {setTodo} handleAdd={handleAdd}/>
      <TodoList todos = {todos} setTodos = {setTodos} completedTodos={completedTodos} setCompletedTodos={setCompletedTodos}/>
    </div>
    </DragDropContext>
  );
}

export default App;
