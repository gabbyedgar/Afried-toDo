import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [todos, setTodos] = useState([]);

   useEffect(() => {
    async function fetchTodos() {
      try {
        // Make a fetch GET request to your API endpoint
        const response = await fetch("http://localhost:3000/api/todos");
        

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // Handle the data by updating the state
        console.log(data)
        setTodos(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchTodos();
  }, []);   

  return (
    <div>
    <h1 className="text-green-500 font-semibold text-2xl mt-4 mb-3">To-do List</h1>  
      <input type="text" /><button type="button">Delete</button>
      <ul>      
        {todos.map((todo)=>(
          <li key={todo.id} ><input type="checkbox"/> {todo.task} <button type="button">Delete</button> </li>
        )) }
      </ul>
    </div>
  )
}

export default App

