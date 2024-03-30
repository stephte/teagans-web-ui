import { TaskStatus, TaskPriority, UserRole } from "./enums";

export interface User {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	passwordConf: string;
	role: UserRole;
};

export interface Task {
    id?: string;
    taskCategoryId: string;
    title: string;
    details: string;
    status: TaskStatus;
    priority: TaskPriority;
    position: number;
    effort: number;
    cleared: boolean;
};

export const validTask = ({ title, details, status, priority }: Task) => {
    return Boolean(title && details && status >= TaskStatus.Todo && status <= TaskStatus.Complete && priority >= TaskPriority.Low && priority <= TaskPriority.Urgent);
};

export interface TaskCategory {
    id?: string;
    name: string;
    position: number;
};

export const validTaskCategory = ({ name, position }: TaskCategory) => {
    return Boolean(name && position >= 1);
};