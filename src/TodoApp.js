import React, { useEffect, useState } from 'react'
import { useForm } from './hooks/useForm';

export const TodoApp = () => {

    const [todos, setTodos] = useState([]);
    const [url] = useState('https://assets.breatheco.de/apis/fake/todos/user/gitalus')

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
        fetch(url, {
            'Content-Type': 'application/json',
            PARAMS: 'None'
        })
            .then(resp => {
                if (resp.status === 404) {
                    createList();
                    throw new Error("Usuario no encontrado, se creará uno nuevo");
                } else {
                    return resp.json()
                }
            })
            .then(data => {
                setTodos(data);
            })
            .catch(err => console.error(err));
    }

    const createList = () => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: "[]"
        })
            .then(({ ok }) => ok && getData())
            .catch(err => console.log(err));
    }

    const postData = () => {
        let _todos = [];
        if (todos.length === 1 && todos[0].label === 'sample task') {
            _todos = [{
                label: description,
                done: false
            }]
        } else {
            _todos = [...todos, {
                label: description,
                done: false
            }]
        }

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(_todos)
        })
            .then(({ ok }) => ok && getData())
            .catch(err => console.log(err));
    };

    const handleDelete = (index) => {

        const _todos = todos.filter((todo, _index) => _index !== index);

        if (_todos.length === 0) {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                },
            })
                .then(({ ok }) => {
                    if (ok) {
                        setTodos([]);
                        getData();
                    }
                })
                .catch(err => console.log(err));
        } else {
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(_todos)
            })
                .then(({ ok }) => ok && getData())
                .catch(err => console.log(err));
        }
    };

    return (
        <>
            <h1>todos</h1>
            <div className='page'>
                <form onSubmit={handleSubmit}>
                    <input
                        className='item-list'
                        type='text'
                        value={description}
                        onChange={handleInputChange}
                        name='description'
                        autoComplete='off'
                        placeholder='Create a todo item...'
                    />
                    <hr />
                </form>
                {
                    (todos.length === 1 && todos[0].label === 'sample task') ? null
                        :
                        todos.map(({ label }, index) => (
                            <div
                                className='item-container'
                                key={index}
                            >
                                <div
                                    className='item-list'
                                >
                                    {label}
                                </div>
                                <i
                                    className='fas fa-times'
                                    onClick={() => handleDelete(index)}></i>
                                <hr className='w100' />
                            </div>
                        ))
                }
                {
                    (todos.length === 1 && todos[0].label === 'sample task') ? <div className='item-list footer'>No tasks, add a task</div>
                        :
                        todos.length > 0 ? <div className='item-list footer'>{todos.length} Item{todos.length === 1 ? '' : 's'} left</div>
                            : <div className='item-list footer'>No tasks, add a task</div>
                }
                <hr />
            </div>
        </>
    )
}
