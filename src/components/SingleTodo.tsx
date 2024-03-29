import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../model';
import {AiFillEdit, AiFillDelete} from 'react-icons/ai';
import {MdDone} from 'react-icons/md';
import "./styles.css";
import { Draggable } from 'react-beautiful-dnd';

type Props = {
    index:number;
    todo: Todo;
    todos:Todo[];
    setTodos:React.Dispatch<React.SetStateAction<Todo[]>>;
}

const SingleTodo = ({index, todo, todos, setTodos}:Props) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [editTodo, setEditTodo] = useState<string>(todo.todo);
    
    /* Change the isDone boolean if clicked */
    const handleDone = (id:number)=> {
        setTodos(
            todos.map((todo)=>
                todo.id === id ? {...todo, isDone: !todo.isDone}: todo
                )
            );
    };
    /* Delete the todo from the list when the Delete button is clicked */
    const handleDelete = (id:number)=> {
        setTodos(
            todos.filter((todo)=>todo.id!==id)
        )
    }

    /* handleEdit - press enter and the new input will be reflected */
    const handleEdit = (e:React.FormEvent, id:number) =>{
        e.preventDefault();
        setTodos(todos.map((todo)=>(
            todo.id===id?{...todo, todo:editTodo}:todo)))
        setEdit(false);
    }
    /* Make the cursor starts inside the input box */
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        inputRef.current?.focus();
    },[edit])

    return (
    <Draggable draggableId={todo.id.toString()} index={index}>
    {(provided)=>(
        /* If the edit mode is on, we display the input box, else display todo */
        <form className="todos__single" onSubmit={(e)=>handleEdit(e, todo.id)} 
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}>
        { edit ? (
            <input ref = {inputRef} value={editTodo} onChange={(e)=>setEditTodo(e.target.value)} className="todos__single--text"/> /* display the original todo text, As a user types, reflect immediately in the field */
            ):(
            /* Display Todo differently depending on isDone value */
            todo.isDone ? (
                <s className="todos__single--text">{todo.todo}</s> /* strikethrough if the todo is done */
            ): (
                <span className="todos__single--text">{todo.todo}</span>
            )
            )
        }

            <div>
                <span className="icon" onClick={()=>{
                    if(!todo.isDone && !edit){
                        setEdit(!edit);
                    }
                }}>
                    <AiFillEdit />
                </span>
                <span className="icon" onClick={()=>handleDelete(todo.id)}>
                    <AiFillDelete />
                </span>
                <span className="icon" onClick={()=>handleDone(todo.id)}>
                    <MdDone />
                </span>
            </div>
    </form>
    )}
    </Draggable>
  )
}

export default SingleTodo