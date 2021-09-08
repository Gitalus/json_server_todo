import React, { useState } from 'react'
import { useForm } from './hooks/useForm';

export const TodoApp = () => {

    const [todos, setTodos] = useState([]);

    const [ { desc }, handleInputChange, reset ] = useForm({
        desc: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (desc.trim().length < 1) return;

        const newTodo = {
            desc
        }
        setTodos([ ...todos, newTodo ]);
        reset();
    };

    const handleDelete = (index) => {
        setTodos([ ...todos.slice(0, index), ...todos.slice(index + 1) ])
    }

    return (
        <>
            <h1>todos</h1>
            <div className="page">
                <form onSubmit={ handleSubmit }>
                    <input 
                        className="item-list"
                        type="text"
                        value={ desc }
                        onChange={ handleInputChange }
                        name="desc"
                        autoComplete="off"
                        placeholder="Create a todo item..."
                    />
                    <hr />
                </form>
                {
                    todos.map( (todo, index) => (
                        <div 
                            className="item-container"
                            key={ index }
                        >
                            <div 
                                className="item-list"
                            >
                                { todo.desc }
                            </div>
                            <i  
                                className="fas fa-times"
                                onClick={ () => handleDelete(index) }></i>
                            <hr className="w100"/>
                        </div>
                    ))
                }
                {
                    todos.length > 0 ? <div className="item-list footer">{ todos.length } Item{ todos.length === 1 ? "" : "s" } left</div>
                    : <div className="item-list footer">No tasks, add a task</div>
                }
                <hr />
            </div>
        </>
    )
}
