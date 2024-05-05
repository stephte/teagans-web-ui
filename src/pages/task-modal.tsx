import Modal from "../components/modal";
import AppInput from "../components/app-input";
import AppSelect from "../components/app-select";
import AppTextEditor from "../components/app-text-editor";
import QuillDisplay from "../components/quill-display";
import Quill from "quill";
import { useEffect, useRef, useState } from "react";
import { Task, validTask } from "../utilities/types";
import { TaskPriority, TaskStatus } from "../utilities/enums";
import "./task-modal.scss";

const Delta = Quill.import('delta');

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => any;
    onSave: (task: Task) => any;
    isLoading: boolean;
    errorMessage: string;

    task: Task;
};

interface DetailObj {
    json: object;
    html: string;
}

const TaskModal = ({ isOpen, onClose, onSave, isLoading, errorMessage, task }: TaskModalProps) => {
    const quillRef = useRef(null);

    const [updatedTask, setUpdatedTask] = useState<Task>();
    const [editingTask, setEditingTask] = useState<boolean>();
    const [updatedDetails, setUpdatedDetails] = useState<DetailObj>({ json: {}, html: "" });
    const [hasChanged, setHasChanged] = useState<boolean>();
    const [isDeleting, setDeleting] = useState<boolean>(false);

    useEffect(() => {
        setUpdatedTask({ ...task });
        setEditingTask(!task?.id);
        setUpdatedDetails({ json: JSON.parse(task?.detailJson || "{}"), html: task?.detailHtml });
        setHasChanged(false);
        setDeleting(false);
    }, [task]);

    const ogDetailJson = JSON.parse(task?.detailJson || "{}");

    const onAction = () => {
        if (isDeleting) {
            const tsk = { ...task };
            tsk.cleared = true;

            onSave(tsk);
        } else if (editingTask) {
            if (!validTask(updatedTask)) {
                return;
            }

            updatedTask.detailHtml = updatedDetails.html;
            updatedTask.detailJson = JSON.stringify(updatedDetails.json);

            onSave(updatedTask);
        } else {
            setEditingTask(true);
        }
    };

    const handleChange = ({ target }: any) => {
        const name = target.name;
        let value = target.value;
        if (name === "status") {
            value = TaskStatus[value];
        } else if (name === "priority") {
            value = TaskPriority[value];
        } else if (target.type === "number") {
            value = +value;
        } else if (target.type == "date" && value === "") {
            value = null;
        }

        let tsk = { ...updatedTask }
        tsk[name] = value;
        setUpdatedTask(tsk);
        setHasChanged(true);
    };

    const updateDetails = (json: object, html: string) => {
        setUpdatedDetails({ json, html });
        setHasChanged(true);
    };

    const handleClose = () => {
        if (isDeleting) {
            setDeleting(false);
        } else if (updatedTask?.id && editingTask) {
            setUpdatedTask(task);
            setEditingTask(false);
            setHasChanged(false);
        } else {
            onClose();
        }
    };

    const getBody = () => {
        if (!updatedTask) return <></>;

        if (isDeleting) {
            return (
                <p>Are you sure you want to delete task '<b>{updatedTask.title}</b>'?</p>
            );
        } else if (editingTask) {
            return (
                <>
                    <AppInput
                        label="Title"
                        placeholder="Title"
                        onChange={handleChange}
                        value={updatedTask.title}
                        required
                        name="title"
                    />
                    <AppTextEditor
                        startValue={new Delta(ogDetailJson)}
                        quillRef={quillRef}
                        onChange={updateDetails}
                        label="Details"
                    />
                    <AppSelect
                        label="Status"
                        enumObj={TaskStatus}
                        onChange={handleChange}
                        name="status"
                        selectedValue={TaskStatus[updatedTask.status]}
                        required
                    />
                    <AppSelect
                        label="Priority"
                        enumObj={TaskPriority}
                        onChange={handleChange}
                        name="priority"
                        selectedValue={TaskPriority[updatedTask.priority]}
                        required
                    />
                    <AppInput
                        label="Due Date"
                        placeholder="Due Date"
                        onChange={handleChange}
                        value={updatedTask.dueDate?.slice(0, 10)}
                        name="dueDate"
                        type="date"
                    />
                </>
            );
        } else {
            return (
                <>
                    <h1 className="task-title">{updatedTask.id ? updatedTask.title : "Create New Task"}</h1>
                    <span>Details:</span>
                    <QuillDisplay value={new Delta(ogDetailJson)} />
                    <span>Status:</span>
                    <span className="task-value">{TaskStatus[updatedTask.status]}</span>
                    <span>Priority:</span>
                    <span className="task-value">{TaskPriority[updatedTask.status]}</span>
                    <span>Due Date:</span>
                    <span className="task-value">{updatedTask?.dueDate ? new Date(updatedTask.dueDate).toDateString().slice(4) : "N/A"}</span>
                </>
            );
        }
    };

    const actionBtnText = () => {
        if (isDeleting) {
            return "Clear";
        } else if (editingTask) {
            return updatedTask?.id ? "Update" : "Add";
        }
        return "Edit";
    };

    const cancelText = () => {
        if (isDeleting || editingTask) {
            return "Cancel"
        }
        return "Close";
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            onAction={onAction}
            actionDisabled={isLoading || (!isDeleting && (editingTask && !(updatedTask && hasChanged && validTask(updatedTask))))}
            actionBtnText={actionBtnText()}
            cancelText={cancelText()}
            isLoading={isLoading}
            errorMessage={errorMessage}
            subBtnText={updatedTask?.id && !isDeleting && "CLEAR TASK"}
            subBtnAction={() => setDeleting(true)}
        >
            {getBody()}
        </Modal>
    );
}

export default TaskModal;