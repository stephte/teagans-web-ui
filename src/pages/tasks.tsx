import { useState, useEffect } from "react";
import useAuthStore from "../stores/auth-store";
import TaskCard from "../components/task-card";
import TaskCategoryHeader from "../components/task-category-header";
import Modal from "../components/modal";
import AppInput from "../components/app-input";
import AppSelect from "../components/app-select";
import { Task, TaskCategory, validTask } from "../utilities/types";
import { getTasks, getTaskCategories, createTask } from "../data/task";
import { TaskPriority, TaskStatus } from "../utilities/enums";
import "./tasks.scss";
import Button from "../components/button";
import AppTextArea from "../components/app-text-area";

const defaultTask = {
    taskCategoryId: "",
    title: "",
    details: "",
    status: TaskStatus.Todo,
    priority: TaskPriority.Low,
    effort: 0,
    cleared: false
}

// TODO: add task view/create/edit page
// TODO: add drag n drop to change task status
const Tasks = () => {
    const currentUser = useAuthStore(state => state.user);

    const [taskCategories, setTaskCategories] = useState<TaskCategory[]>();
    const [category, setCategory] = useState<TaskCategory>();
    const [tasks, setTasks] = useState<Task[]>();

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [createdTask, setCreatedTask] = useState<Task>(defaultTask);
    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const [createErr, setCreateErr] = useState<string>("")//"error creating the new task i am so sorry please forgive all of the sins i have brought forth upon you tonight");

    const getCategories = async () => {
        const rv = await getTaskCategories(currentUser.id)
            .catch((err) => {
                console.log("ERROR getting task categories");
                console.log(err);
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
                })
                .catch((err) => {
                    console.log("ERROR getting tasks");
                    console.log(err);
                });
    };

    useEffect(() => {
        if (category) {
            fetchTasks();
        }
        // else if (!tasks) {
        //     setTasks(tsks);
        // }
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
                setCreatedTask(defaultTask);
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
                isLoading={createLoading}
                errorMessage={createErr}
            >
                <h3>Create New Task</h3>
                <AppInput
                    placeholder="Title"
                    onChange={editCreatedTask}
                    value={createdTask.title}
                    required
                    name="title"
                />
                <AppTextArea
                    value={createdTask.details}
                    name="details"
                    onChange={editCreatedTask}
                    label="Details"
                    required
                    rows={10}
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
            <div className="tasks-page">
                <div className="border-right">
                    <h3>WAITING</h3>
                    {
                        tasks?.filter(t => t.status === TaskStatus.Waiting).map(t => {
                            return <TaskCard key={t.id} {...t} />;
                        })
                    }
                </div>
                <div className="border-right">
                    <h3>TODO</h3>
                    {
                        tasks?.filter(t => t.status === TaskStatus.Todo).map(t => {
                            return <TaskCard key={t.id} {...t} />;
                        })
                    }
                </div>
                <div className="border-right">
                    <h3>STARTED</h3>
                    {
                        tasks?.filter(t => t.status === TaskStatus.Started).map(t => {
                            return <TaskCard key={t.id} {...t} />;
                        })
                    }
                </div>
                <div>
                    <h3>COMPLETE</h3>
                    {
                        tasks?.filter(t => t.status === TaskStatus.Complete).map(t => {
                            return <TaskCard key={t.id} {...t} />;
                        })
                    }
                </div>
            </div>
        </>
    );
};

export default Tasks;

// const tsks = [
//     {
//         id: "12353",
//         title: "Laundry",
//         details: "do the laundry or so help me god I will come and find you and you will wish that you had never ever ever ignored me",
//         status: TaskStatus.Todo,
//         priority: 2,//TaskPriority;
//         effort: 3,//string;
//         cleared: false,//boolean;
//     },
//     {
//         id: "12354",
//         title: "Dishes",
//         details: "do the dishes or so help me god I will come and find you and you will wish that you had never ever ever ignored me",
//         status: TaskStatus.Started,
//         priority: 1,//TaskPriority;
//         effort: 2,//string;
//         cleared: false,//boolean;
//     },
//     {
//         id: "12355",
//         title: "Make dinner",
//         details: "make dinner please :)",
//         status: TaskStatus.Todo,
//         priority: 2,//TaskPriority;
//         effort: 3,//string;
//         cleared: false,//boolean;
//     },
//     {
//         id: "12356",
//         title: "Laundry",
//         details: "do the laundry or so help me god I will come and find you and you will wish that you had never ever ever ignored me",
//         status: TaskStatus.Todo,
//         priority: 2,//TaskPriority;
//         effort: 3,//string;
//         cleared: false,//boolean;
//     },
//     {
//         id: "12357",
//         title: "Laundry",
//         details: "do the laundry or so help me god I will come and find you and you will wish that you had never ever ever ignored me",
//         status: TaskStatus.Todo,
//         priority: 2,//TaskPriority;
//         effort: 3,//string;
//         cleared: false,//boolean;
//     },
//     {
//         id: "12358",
//         title: "Laundry",
//         details: "do the laundry or so help me god I will come and find you and you will wish that you had never ever ever ignored me",
//         status: TaskStatus.Todo,
//         priority: 2,//TaskPriority;
//         effort: 3,//string;
//         cleared: false,//boolean;
//     },
//     {
//         id: "12359",
//         title: "Laundry",
//         details: "do the laundry or so help me god I will come and find you and you will wish that you had never ever ever ignored me",
//         status: TaskStatus.Todo,
//         priority: 2,//TaskPriority;
//         effort: 3,//string;
//         cleared: false,//boolean;
//     },
//     {
//         id: "123510",
//         title: "Laundry",
//         details: "do the laundry or so help me god I will come and find you and you will wish that you had never ever ever ignored me",
//         status: TaskStatus.Todo,
//         priority: 2,//TaskPriority;
//         effort: 3,//string;
//         cleared: false,//boolean;
//     },
//     {
//         id: "123511",
//         title: "Laundry",
//         details: "do the laundry or so help me god I will come and find you and you will wish that you had never ever ever ignored me",
//         status: TaskStatus.Todo,
//         priority: 2,//TaskPriority;
//         effort: 3,//string;
//         cleared: false,//boolean;
//     },
// ];