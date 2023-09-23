import { useEffect, useState } from "react";
import "./App.css";
import Spinner from "./components/Spinner";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [taskIsCompleted, setTaskIsCompleted] = useState(false);
  const [todoToUpdate, setTodoToUpdate] = useState({
    task: "",
    is_completed: false,
  });
  const [spinnerIsloading, setSpinnerIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Fetching code here to set our todos
        const response = await fetch("http://localhost:3000/api/todos");
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.log("Error occured: " + error);
      }
    };

    fetchData();
  }, []);

  // This function fetches the todos from the backend
  const fetchAndSetTodos = async () => {
    //Fetching code here to set our todos
    const response = await fetch("http://localhost:3000/api/todos");
    const data = await response.json();
    setTodos(data);
  };

  // This function helps to add the todo task to the list of todos
  const handleAddTodoSubmit = async (event) => {
    event.preventDefault();

    // Start the spinner
    setSpinnerIsLoading(true);

    if (task == "") {
      alert("Fill the task form before adding");
      setSpinnerIsLoading(false);
      return;
      //throw new Error("Sorry, you can not create empty todo");
    }

    try {
      const response = await fetch("http://localhost:3000/api/todos2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: task,
          is_completed: false,
        }),
      });

      // get response in json
      const data = await response.json();

      // Set the todos after it had been returned
      setTodos((oldTodos) => [...oldTodos, ...data]);

      // Stop the spinner
      setSpinnerIsLoading(false);
    } catch (error) {
      console.log("Adding to todo error occured: " + error);
    }
  };

  // This function helps to add the todo task to the list of todos
  const handleUpdateTodoSubmit = async (event) => {
    event.preventDefault();
    // Start the spinner
    setSpinnerIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/todos/update/${todoToUpdate.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task: task || todoToUpdate.task,
            is_completed: JSON.parse(taskIsCompleted),
          }),
        }
      );

      if (response) {
        // Set fetch and set the remaining todos
        fetchAndSetTodos();
        closeModal();

        // Stop the spinner
        setSpinnerIsLoading(false);
      }
    } catch (error) {
      console.log("Adding to todo error occured: " + error);
    }
  };

  // This function helps to add the todo task to the list of todos
  const handleTodoDelete = async (todoId) => {
    // Start the spinner
    setSpinnerIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/todos/delete/${todoId}`,
        {
          method: "DELETE",
        }
      );

      if (response) {
        // Set fetch and set the remaining todos
        fetchAndSetTodos();
        // Stop the spinner
        setSpinnerIsLoading(false);
      }
    } catch (error) {
      console.log("Adding to todo error occured: " + error);
    }
  };

  // This opens the modal
  const openModal = () => {
    document.getElementById("popup-modal").classList.remove("hidden");
    document.getElementById("popup-modal").classList.add("block");
  };

  // This closes the modal
  const closeModal = () => {
    document.getElementById("popup-modal").classList.remove("block");
    document.getElementById("popup-modal").classList.add("hidden");
  };

  return (
    <>
      <div>
        {spinnerIsloading && <Spinner />}

        <h1 className="text-green-500 font-semibold text-5xl mt-3 mb-6">
          To-do list
        </h1>
        <form onSubmit={handleAddTodoSubmit}>
          <div className="flex items-center justify-center">
            <input
              type="text"
              placeholder="Enter task"
              onChange={(event) => setTask(event.target.value)}
              value={task}
              className="max-w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            <button
              type="submit"
              className="font-bold  bg-slate-500 rounded-sm p-2 text-white"
            >
              Add
            </button>
          </div>
        </form>

        <ul className="bg-white shadow overflow-hidden sm:rounded-md max-w-lg mx-auto mt-5">
          {todos.length > 0 ? (
            todos.map((todo, i) => (
              <li key={i} className="border-t border-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md w-20 mr-4 leading-6 font-medium text-gray-900">
                      Task {i + 1}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {todo.task}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      Status:{" "}
                      <span className="text-green-600">
                        {todo.is_completed ? "Completed" : "Pending"}
                      </span>
                    </p>
                    <div>
                      <a
                        href="#"
                        onClick={() => {
                          setTodoToUpdate(todo);
                          openModal();
                        }}
                        className="font-medium text-indigo-600 hover:text-indigo-500 mr-2"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleTodoDelete(todo.id)}
                        type="button"
                        className="font-bold  bg-red-500 rounded-lg p-1 text-xs text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <h1>Nothing found</h1>
          )}
        </ul>
        <div
          id="popup-modal"
          className="fixed w-full h-full top-0 z-50 hidden bg-black"
        >
          <div className="flex justify-center items-center mt-10">
            <div className="bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                onClick={() => {
                  closeModal();
                }}
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="popup-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-6 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to edit this task id-
                  {todoToUpdate.id}?
                </h3>
                <form onSubmit={handleUpdateTodoSubmit}>
                  <input
                    type="text"
                    placeholder="Enter todo"
                    onChange={(event) => setTask(event.target.value)}
                    defaultValue={todoToUpdate.task}
                    className="bg-slate-500 text-white font-bold placeholder:text-green-200 border-2 rounded-xl p-2 border-solid border-black"
                  />
                  <select
                    className="ml-2"
                    onChange={(event) => setTaskIsCompleted(event.target.value)}
                    defaultValue={todoToUpdate.is_completed}
                  >
                    <option
                      value={false}
                      title="I have not completed this task"
                    >
                      Pending
                    </option>
                    <option value={true} title="I have completed this task">
                      Completed
                    </option>
                  </select>
                  <button
                    type="submit"
                    className="block mt-3 ml-8 font-bold bg-slate-500 rounded-lg p-2 text-white"
                  >
                    Update
                  </button>
                </form>
                <button
                  onClick={() => {
                    closeModal();
                  }}
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
