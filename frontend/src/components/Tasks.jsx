import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "./utils/Loader";
import Tooltip from "./utils/Tooltip";

const Tasks = () => {
  const authState = useSelector((state) => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = {
      url: "/tasks",
      method: "get",
      headers: { Authorization: authState.token },
    };
    fetchData(config, { showSuccessToast: false }).then((data) =>
      setTasks(data.tasks)
    );
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const updateTaskStatus = async (taskId, newStatus, title, description) => {
    try {
      const config = {
        url: `/tasks/${taskId}`,
        method: "put",
        data: { status: newStatus, title: title, description: description },
        headers: { Authorization: authState.token },
      };
      await fetchData(config);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleStatusChange = async (taskId) => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === taskId);
      taskToUpdate.status = !taskToUpdate.status;
      const title = taskToUpdate.title;
      const description = taskToUpdate.description;
      await updateTaskStatus(taskId, taskToUpdate.status, title, description);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDelete = (id) => {
    const config = {
      url: `/tasks/${id}`,
      method: "delete",
      headers: { Authorization: authState.token },
    };
    fetchData(config).then(() => fetchTasks());
  };

  return (
    <>
      <div className="my-2 mx-auto max-w-[700px] py-4">
        {tasks.length !== 0 && (
          <h2 className="my-2 ml-2 md:ml-0 text-xl">
            Your tasks ({tasks.length})
          </h2>
        )}
        {loading ? (
          <Loader />
        ) : (
          <div>
            {tasks.length === 0 ? (
              <div className="w-[600px] h-[300px] flex items-center justify-center gap-4">
                <span>No tasks found</span>
                <Link
                  to="/tasks/add"
                  className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2"
                >
                  + Add new task{" "}
                </Link>
              </div>
            ) : (
              tasks.map((task, index) => (
                <div
                  key={task._id}
                  className={`my-4 p-4 text-gray-600 rounded-md shadow-md ${
                    task.status ? "bg-green-200" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-medium">
                      #{index + 1} {task.title}
                    </span>

                    <Tooltip text={"Mark as compleate"} position={"top"}>
                      <input
                        type="checkbox"
                        checked={task.status}
                        onChange={() => handleStatusChange(task._id)}
                        className=" ml-auto mr-2 w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </Tooltip>

                    <Tooltip text={"Edit this task"} position={"top"}>
                      <Link
                        to={`/tasks/${task._id}`}
                        className="mr-2 text-green-600 cursor-pointer"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>

                    <Tooltip text={"Delete this task"} position={"top"}>
                      <span
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(task._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>
                  </div>
                  <div className="flex items-center">
                    <div>{task.description}</div>
                    <div className="ml-auto mr-2 font-light text-sm cursor-none">
                      {task.status ? "Compleated" : ""}
                    </div>
                  </div>
                </div>
              ))
            )}

            {tasks.length !== 0 ? (
              <Link
              to="/tasks/add"
              className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2"
            >
              + Add new task{" "}
            </Link>
            ):("")}
            
          </div>
        )}
      </div>
    </>
  );
};

export default Tasks;
