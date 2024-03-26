import "./task-card.scss";
import { TaskStatus, TaskPriority } from "../utilities/enums";
import { Task } from "../utilities/types";

// Task {
//     Title: string;
//     Details: string;
//     Status: TaskStatus;
//     Priority: TaskPriority;
//     Effort: string;
//     Cleared: boolean;
// }
const MAXCHARS = 105;

const TaskCard = (task: Task) => {
    let details = task.details;
    if (details.length > MAXCHARS) {
        details = details.slice(0, MAXCHARS - 3) + "...";
    }

    return (
        <div className="task-card-wrapper clickable" onClick={() => console.log("i wuz clikd")}>
            <div className="task-card">
                <div className="name">{task.title}</div>
                <div className="details">{details}</div>
                <div className="bottom">{TaskPriority[task.priority]}</div>
                <div className="bottom">{TaskStatus[task.status]}</div>
                <div className="bottom">{task.effort}</div>
            </div>
        </div>
    );
};

export default TaskCard;