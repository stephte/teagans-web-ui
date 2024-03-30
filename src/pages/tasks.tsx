import { useState, useEffect } from "react";
import useAuthStore from "../stores/auth-store";
import TaskCard from "../components/task-card";
import TaskCategoryHeader from "../components/task-category-header";
import Modal from "../components/modal";
import AppInput from "../components/app-input";
import AppSelect from "../components/app-select";
import { Task, TaskCategory, validTask } from "../utilities/types";
import { getTasks, getTaskCategories, createTask, updateTask } from "../data/task";
import { TaskPriority, TaskStatus } from "../utilities/enums";
import "./tasks.scss";
import Button from "../components/button";
import AppTextArea from "../components/app-text-area";
import AppTextEditor from "../components/app-text-editor";

const defaultTask = {
    taskCategoryId: "",
    title: "",
    details: "",
    status: TaskStatus.Todo,
    priority: TaskPriority.Low,
    position: 0,
    effort: 0,
    cleared: false
};

// TODO: add task view/create/edit page
// TODO: add task column sorting...?
// TODO: display WSYWIG properly on task view page
const Tasks = () => {
    const currentUser = useAuthStore(state => state.user);

    const [taskCategories, setTaskCategories] = useState<TaskCategory[]>();
    const [category, setCategory] = useState<TaskCategory>();
    const [tasks, setTasks] = useState<Task[]>();
    const [taskPageErr, setTaskPageErr] = useState<string>("");

    // modal stuff
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [createdTask, setCreatedTask] = useState<Task>({...defaultTask});
    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const [createErr, setCreateErr] = useState<string>("");

    // drag'n'drop stuff
    const [dragging, setDragging] = useState<boolean>(false);
    const handleDragStart = (event: any) => {
        setDragging(true);
        event.dataTransfer.setData("taskId", event.target.id);
    };
    const handleDragEnd = () => {
        setDragging(false);
    };
    const handleDrop = (event: any) => {
        event.preventDefault();

        const taskId = event.dataTransfer.getData("taskId");
        const statusNode = getStatusNode(event.target, 0);
        const newStatusStr = statusNode.id;
        if (isNaN(+TaskStatus[newStatusStr])) {
            return;
        }
        setTaskPageErr("");

        let task = tasks.find((t) => t.id === taskId);
        const oldStatus = task.status;
        task.status = +TaskStatus[newStatusStr];
        updateTask(task)
            .catch((err) => {
                setTaskPageErr(`Error updating task: ${err.response?.data?.error || err.message || ""}`);
                task.status = oldStatus;
            });
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
        const rv = await getTaskCategories(currentUser.id)
            .catch((err) => {
                setTaskPageErr(err.response?.data?.error || err.message || "Error fetching categories");
                return null;
            });

        setTaskCategories(rv.data.taskCategories);
        return rv.data.taskCategories;
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

    const fetchTasks = () => {
        getTasks(category.id, "all", false)
                .then((res) => {
                    setTasks(res.data.tasks);
                    setCreatedTask({ ...defaultTask, position: res.data.tasks.length });
                })
                .catch((err) => {
                    setTaskPageErr(err.response?.data?.error || err.message || "Error fetching tasks");
                });
    };

    useEffect(() => {
        if (category) {
            fetchTasks();
        }
    }, [category]);

    const editCreatedTask = ({ target }) => {
        const name = target.name;
        let value = target.value;
        if (name === "status") {
			value = TaskStatus[value];
		} else if (name === "priority") {
            value = TaskPriority[value];
        } else if (target.type === "number") {
			value = +value;
		}

        let tsk = { ...createdTask }
        tsk[name] = value;
        setCreatedTask(tsk);
    };

    const createNewTask = () => {
        if (!validTask(createdTask)) {
            return;
        }
        setCreateLoading(true);
        setCreateErr("");

        const newTask = {
            ...createdTask,
            taskCategoryId: category.id
        };

        createTask(newTask)
            .then((res) => {
                fetchTasks();
                setModalOpen(false);
            })
            .catch((err) => {
                setCreateErr(err.response?.data?.error || err.message || "Error creating task");
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
            />
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAction={() => createNewTask()}
                actionDisabled={!validTask(createdTask)}
                actionBtnText="Add"
                isLoading={createLoading}
                errorMessage={createErr}
                wide
            >
                <h3>Create New Task</h3>
                <AppInput
                    label="Title"
                    placeholder="Title"
                    onChange={editCreatedTask}
                    value={createdTask.title}
                    required
                    name="title"
                />
                <AppTextEditor
                    value={createdTask.details}
                    // name="details"
                    onChange={(v) => setCreatedTask({ ...createdTask, details: v })}
                    label="Details"
                    required
                    // rows={10}
                />
                <AppSelect
                    label="Status"
                    enumObj={TaskStatus}
                    onChange={editCreatedTask}
                    name="status"
					selectedValue={TaskStatus[createdTask.status]}
                    required
                />
                <AppSelect
                    label="Priority"
                    enumObj={TaskPriority}
                    onChange={editCreatedTask}
                    name="priority"
					selectedValue={TaskPriority[createdTask.priority]}
                    required
                />
                <AppInput
                    label="Effort"
                    placeholder="Effort"
                    onChange={editCreatedTask}
                    value={createdTask.effort}
                    name="effort"
                    type="number"
                    min="0"
                />
            </Modal>
            <div className="task-btn">
                <Button
                    text="Add Task"
                    onClick={() => setModalOpen(true)}
                />
            </div>
            {taskPageErr && <p className="error">{taskPageErr}</p>}
            <div id="" className="tasks-page" onDrop={handleDrop} onDragOver={handleDragOver}>
                <div className="border-right" id={TaskStatus[TaskStatus.Waiting]}>
                    <h3>WAITING</h3>
                    {
                        tasks?.filter(t => t.status === TaskStatus.Waiting).map(t => {
                            return <TaskCard key={t.id} task={t} dragging={dragging} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />;
                        })
                    }
                </div>
                <div className="border-right" id={TaskStatus[TaskStatus.Todo]}>
                    <h3>TODO</h3>
                    {
                        tasks?.filter(t => t.status === TaskStatus.Todo).map(t => {
                            return <TaskCard key={t.id} task={t} dragging={dragging} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />;
                        })
                    }
                </div>
                <div className="border-right" id={TaskStatus[TaskStatus.Started]}>
                    <h3>STARTED</h3>
                    {
                        tasks?.filter(t => t.status === TaskStatus.Started).map(t => {
                            return <TaskCard key={t.id} task={t} dragging={dragging} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />;
                        })
                    }
                </div>
                <div id={TaskStatus[TaskStatus.Complete]}>
                    <h3>COMPLETE</h3>
                    {
                        tasks?.filter(t => t.status === TaskStatus.Complete).map(t => {
                            return <TaskCard key={t.id} task={t} dragging={dragging} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />;
                        })
                    }
                </div>
            </div>
        </>
    );
};

export default Tasks;