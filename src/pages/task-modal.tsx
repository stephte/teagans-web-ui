import Modal from "../components/modal";
import AppInput from "../components/app-input";
import AppSelect from "../components/app-select";
import AppTextEditor from "../components/app-text-editor";
import Quill from "quill";
import { useEffect, useRef, useState } from "react";
import { Task, validTask } from "../utilities/types";
import { TaskPriority, TaskStatus } from "../utilities/enums";
import "./task-modal.scss";

const Delta = Quill.import('delta');

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => any;
    onSave: (e: any) => any;
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

    useEffect(() => {
        setUpdatedTask(task);
        setEditingTask(!task?.id);
        setUpdatedDetails({ json: JSON.parse(task?.detailJson || "{}"), html: task?.detailHtml });
        setHasChanged(false);
    }, [task]);

    const ogDetailHtml = task?.detailHtml;
    const ogDetailJson = JSON.parse(task?.detailJson || "{}");

    const onAction = () => {
        if (editingTask) {
            if (!validTask(updatedTask)) {
                return;
            }

            updatedTask.detailHtml = updatedDetails.html;
            updatedTask.detailJson = JSON.stringify(updatedDetails.json);

            onSave(updatedTask);
            setEditingTask(false);
            setHasChanged(false);
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
        if (updatedTask?.id && editingTask) {
            setUpdatedTask(task);
            setEditingTask(false);
            setHasChanged(false);
        } else {
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            onAction={onAction}
            actionDisabled={editingTask ? !updatedTask || !hasChanged || !validTask(updatedTask): false}
            actionBtnText={editingTask ? updatedTask?.id ? "Update" : "Add" : "Edit"}
            cancelText={editingTask ? "Cancel" : "Close"}
            isLoading={isLoading}
            errorMessage={errorMessage}
            wide
        >
            {updatedTask &&
                <>
                    {editingTask ?
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
                                label="Effort"
                                placeholder="Effort"
                                onChange={handleChange}
                                value={updatedTask.effort}
                                name="effort"
                                type="number"
                                min="0"
                            />
                        </>
                    :
                        <>
                            <h1 className="task-title">{updatedTask.id ? updatedTask.title : "Create New Task"}</h1>
                            <span>Details:</span>
                            <div className="task-modal-details" dangerouslySetInnerHTML={{ __html: updatedTask.detailHtml }} />
                            <span>Status:</span>
                            <span className="task-value">{TaskStatus[updatedTask.status]}</span>
                            <span>Priority:</span>
                            <span className="task-value">{TaskPriority[updatedTask.status]}</span>
                            <span>Effort:</span>
                            <span className="task-value">{updatedTask.effort}</span>
                        </>
                    }
                </>
            }
        </Modal>
    );
}

export default TaskModal;