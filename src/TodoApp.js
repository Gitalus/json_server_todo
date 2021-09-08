import React, { useEffect, useState } from 'react'
import { useForm } from './hooks/useForm';

export const TodoApp = () => {

    const [todos, setTodos] = useState([]);
    const [url] = useState("http://localhost:3001/todos")

    const [{ description }, handleInputChange, reset] = useForm({
        description: ''
    });

    useEffect(() => {
        getData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (description.trim().length < 1) return;
        postData();
        reset();
    };

    const getData = () => {
        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                setTodos(data)
            })
            .catch(err => console.log(err));
    }


    const postData = () => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                description
            })
        })
            .then(({ ok }) => ok && getData())
            .catch(err => console.log(err));
    };

    const handleDelete = (id) => {
        fetch(`${url}/${id}`, {
            method: 'DELETE'
        })
            .then(({ ok }) => ok && getData())
            .catch(err => console.log(err));
    }

    return (
        <>
            <h1>todos</h1>
            <div className="page">
                <form onSubmit={handleSubmit}>
                    <input
                        className="item-list"
                        type="text"
                        value={description}
                        onChange={handleInputChange}
                        name="description"
                        autoComplete="off"
                        placeholder="Create a todo item..."
                    />
                    <hr />
                </form>
                {
                    todos.map(todo => (
                        <div
                            className="item-container"
                            key={todo.id}
                        >
                            <div
                                className="item-list"
                            >
                                {todo.description}
                            </div>
                            <i
                                className="fas fa-times"
                                onClick={() => handleDelete(todo.id)}></i>
                            <hr className="w100" />
                        </div>
                    ))
                }
                {
                    todos.length > 0 ? <div className="item-list footer">{todos.length} Item{todos.length === 1 ? "" : "s"} left</div>
                        : <div className="item-list footer">No tasks, add a task</div>
                }
                <hr />
            </div>
        </>
    )
}
