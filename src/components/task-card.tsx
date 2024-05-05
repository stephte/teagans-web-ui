import "./task-card.scss";
import { TaskStatus, TaskPriority } from "../utilities/enums";
import { Task } from "../utilities/types";

// Task {
//     Title: string;
//     Details: string;
//     Status: TaskStatus;
//     Priority: TaskPriority;
//     DueDate: string;
//     Cleared: boolean;
// }
const MAXCHARS = 105;

interface TaskCardProps {
    task: Task,
    dragging?: boolean;
    handleDragStart?: (event: any) => any;
    handleDragEnd?: (event: any) => any;
    onClick: (event: any) => any;
}

const TaskCard = ({ task, dragging, handleDragStart, handleDragEnd, onClick }: TaskCardProps) => {
    let doc = new DOMParser().parseFromString(task.detailHtml, 'text/html');
    let details = doc.body.textContent || "";
    if (details.length > MAXCHARS) {
        details = details.slice(0, MAXCHARS - 3) + "...";
    }

    const dueDate = task.dueDate ? new Date(task.dueDate).toDateString().slice(4) : "N/A";

    return (
        <div
            id={task.id}
            // data-position={ndx}
            className="task-card-wrapper clickable"
            onClick={onClick}
            draggable={dragging !== undefined && !dragging}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="task-card">
                <div className="name">{task.title}</div>
                <div className="details">{details}</div>
                <div className="bottom">{TaskPriority[task.priority]}</div>
                <div className="bottom">{TaskStatus[task.status]}</div>
                <div className="bottom">{dueDate}</div>
            </div>
        </div>
    );
};

export default TaskCard;