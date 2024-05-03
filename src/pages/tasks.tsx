import { useState, useEffect } from "react";
import useAuthStore from "../stores/auth-store";
import TaskCard from "../components/task-card";
import TaskCategoryHeader from "../components/task-category-header";
import { Task, TaskCategory } from "../utilities/types";
import { getTasks, getTaskCategories, createTask, updateTask, updateTasks } from "../data/task";
import { TaskPriority, TaskStatus } from "../utilities/enums";
import { getCardNode } from "../utilities/functions";
import "./tasks.scss";
import Button from "../components/button";
import TaskModal from "./task-modal";

const defaultTask = {
    taskCategoryId: "",
    title: "",
    detailHtml: "",
    detailJson: "",
    status: TaskStatus.Todo,
    priority: TaskPriority.Low,
    position: 0,
    effort: 0,
    cleared: false
};

const Tasks = () => {
    const currentUser = useAuthStore(state => state.user);

    const [taskCategories, setTaskCategories] = useState<TaskCategory[]>();
    const [category, setCategory] = useState<TaskCategory>();
    const [tasks, setTasks] = useState<Task[]>();
    const [taskPageErr, setTaskPageErr] = useState<string>("");

    // modal stuff
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [createdTask, setCreatedTask] = useState<Task>({...defaultTask});
    const [currentTask, setCurrentTask] = useState<Task>();
    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const [createErr, setCreateErr] = useState<string>("");


    // drag'n'drop stuff
    const [dragging, setDragging] = useState<boolean>(false);
    const handleDragStart = (event: any) => {
        setDragging(true);
        event.dataTransfer.setData("taskId", event.target.id);
    };
    const handleDragEnd = (event) => {
        event.preventDefault();
        setDragging(false);
    };
    const handleDrop = (event: any) => {
        event.preventDefault();

        const statusNode = getStatusNode(event.target, 0);
        const newStatusStr = statusNode.id;
        if (isNaN(+TaskStatus[newStatusStr])) {
            return;
        }
        setTaskPageErr("");

        const ogTaskList = [...tasks];

        const taskId = event.dataTransfer.getData("taskId");
        let task = { ...tasks.find((t) => t.id === taskId) };
        const droppedOnCard = getCardNode(event.target, "task-card-wrapper", 0);
        const droppedOnTask = { ...tasks.find(t => t.id === droppedOnCard.id) };
        if (droppedOnTask.id === task.id) {
            return;
        }

        const oldStatus = task.status;
        const newStatus = +TaskStatus[newStatusStr];

        // update indexes of task's old status
        const oldStatusList = tasks.filter(t => t.status === oldStatus);
        const oldTaskNdx = oldStatusList.map(t => t.id).indexOf(task.id);
        let updatedOldStatusList = [...oldStatusList.slice(0, oldTaskNdx), ...oldStatusList.slice(oldTaskNdx+1)];
        updatedOldStatusList.forEach((t, ndx) => {
            t.position = ndx;
        });


        let tasksToUpdate = [];
        let newStatusList = [];
        let updatedNewStatusList = [];

        // if oldStatus === newStatus, then newList = oldList, else grab tasks of the new status
        if (oldStatus === newStatus) {
            newStatusList = [...updatedOldStatusList];
            updatedOldStatusList = [];
        } else {
            task.status = newStatus;
            newStatusList = tasks.filter(t => t.status === newStatus);
            tasksToUpdate = updatedOldStatusList.slice(oldTaskNdx);
        }

        // handle list ordering
        let droppedOnNdx = newStatusList.map(t => t.id).indexOf(droppedOnTask?.id);
        droppedOnNdx = droppedOnNdx >= 0 ? droppedOnNdx : newStatusList.length;
        updatedNewStatusList = [...newStatusList.slice(0, droppedOnNdx), task, ...newStatusList.slice(droppedOnNdx)];
        updatedNewStatusList.forEach((t, ndx) => {
            t.position = ndx;
        });

        // gather tasks to be updated
        let startNdx = 0;
        let endNdx = 0;
        if (oldStatus === newStatus) {
            startNdx = oldTaskNdx < droppedOnNdx ? oldTaskNdx : droppedOnNdx;
            endNdx = (oldTaskNdx > droppedOnNdx ? oldTaskNdx : droppedOnNdx) + 1;
        } else {
            startNdx = droppedOnNdx;
            endNdx = updatedNewStatusList.length;
        }
        tasksToUpdate = [...tasksToUpdate, ...updatedNewStatusList.slice(startNdx, endNdx)];

        // update tasks on the page
        setTasks([...tasks.filter(t => ![oldStatus, newStatus].includes(t.status)), ...updatedOldStatusList, ...updatedNewStatusList]);

        // update all tasks that had their position changed
        updateTasks(tasksToUpdate)
            .catch((err) => {
                setTaskPageErr(`Error updating tasks: ${err.response?.data?.error || err.message || ""}`);
                setTasks(ogTaskList);
            });
        setDragging(false);
    };
    // can update this to handle style changes to make updates more clear
    const handleDragOver = (event: any) => {
        event.preventDefault();
    };
    // i is used to ensure infinite loop doesnt happen for whatever reason
    const getStatusNode = (node: any, i: number) => {
        if (i >= 5 || (node.id && +TaskStatus[node.id])) {
            return node;
        }

        return getStatusNode(node.parentNode, i+1);
    };
    // end drag'n'drop stuff


    const getCategories = async () => {
        const res = await getTaskCategories(currentUser.id)
            .catch((err) => {
                setTaskPageErr(err.response?.data?.error || err.message || "Error fetching categories");
                return null;
            });

        const rv = res?.data?.taskCategories || [];
        setTaskCategories(rv);
        return rv;
    }

    useEffect(() => {
        if (!taskCategories) {
            getCategories()
                .then((cats) => {
                    if (cats) {
                        setCategory(cats[0]);
                    }
                });
        }
    }, [taskCategories]);

    const fetchTasks = (initTask: boolean) => {
        getTasks(category.id, "all", false)
                .then((res) => {
                    setTasks(res.data.tasks);
                    if (initTask) {
                        setCreatedTask({ ...defaultTask, position: res.data.tasks.length });
                    }
                })
                .catch((err) => {
                    setTaskPageErr(err.response?.data?.error || err.message || "Error fetching tasks");
                });
    };

    useEffect(() => {
        if (category) {
            fetchTasks(true);
        }
    }, [category]);

    const cardClick = (event: any) => {
        event.preventDefault();

        const taskCard = getCardNode(event.target, "task-card-wrapper", 0);
        const taskId = taskCard.id;
        let task = { ...tasks.find((t) => t.id === taskId) };

        setCurrentTask(task);
        setModalOpen(true);
    };

    const createOrUpdateTask = (task: Task) => {
        setCreateLoading(true);
        setCreateErr("");

        task.taskCategoryId = category.id;

        let apiCall = task.id ? updateTask : createTask;
        apiCall(task)
            .then((res) => {
                fetchTasks(!task.id);
                if (res.data.cleared) {
                    setModalOpen(false);
                } else {
                    setCurrentTask(res.data);
                }
            })
            .catch((err) => {
                setCreateErr(err.response?.data?.error || err.message || "Error updating task");
            })
            .finally(() => setCreateLoading(false));
    };

    return (
        <>
            <TaskCategoryHeader
                taskCategories={taskCategories}
                selectedCategory={category}
                setCategory={setCategory}
                refreshCategories={getCategories}
                setCategories={setTaskCategories}
            />
            { taskCategories?.length &&
                <>
                    <TaskModal
                        isOpen={modalOpen}
                        onClose={() => {
                            setModalOpen(false);
                        }}
                        onSave={createOrUpdateTask}
                        isLoading={createLoading}
                        errorMessage={createErr}
                        task={{ ...currentTask }}
                    />
                    <div className="task-btn">
                        <Button
                            text="Add Task"
                            onClick={() => {
                                setCurrentTask(createdTask);
                                setModalOpen(true);
                            }}
                        />
                    </div>
                    {taskPageErr && <p className="error">{taskPageErr}</p>}
                    <div id="" className="tasks-page" onDrop={handleDrop} onDragOver={handleDragOver}>
                        <div className="task-column border-right" id={TaskStatus[TaskStatus.Waiting]}>
                            <h3>ON HOLD</h3>
                            {
                                tasks?.filter(t => t.status === TaskStatus.Waiting).map((t) => {
                                    return <TaskCard key={t.id} task={t} onClick={cardClick} dragging={dragging} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />;
                                })
                            }
                        </div>
                        <div className="task-column border-right" id={TaskStatus[TaskStatus.Todo]}>
                            <h3>TODO</h3>
                            {
                                tasks?.filter(t => t.status === TaskStatus.Todo).map((t) => {
                                    return <TaskCard key={t.id} task={t} onClick={cardClick} dragging={dragging} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />;
                                })
                            }
                        </div>
                        <div className="task-column border-right" id={TaskStatus[TaskStatus.Started]}>
                            <h3>STARTED</h3>
                            {
                                tasks?.filter(t => t.status === TaskStatus.Started).map((t) => {
                                    return <TaskCard key={t.id} task={t} onClick={cardClick} dragging={dragging} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />;
                                })
                            }
                        </div>
                        <div className="task-column" id={TaskStatus[TaskStatus.Complete]}>
                            <h3>COMPLETE</h3>
                            {
                                tasks?.filter(t => t.status === TaskStatus.Complete).map((t) => {
                                    return <TaskCard key={t.id} task={t} onClick={cardClick} dragging={dragging} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />;
                                })
                            }
                        </div>
                    </div>
                </>
            }
        </>
    );
};

export default Tasks;