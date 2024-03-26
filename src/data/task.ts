import { api } from "./make-request";
import { Task, TaskCategory } from "../utilities/types";

export const getTasks = (categoryId: string, statusStr: string, getCleared: boolean) => {
    return api.get(`/task-categories/${categoryId}/tasks?status=${statusStr}&cleared=${getCleared}`);
};

export const getTask = (taskId: string) => {
    return api.get(`tasks/${taskId}`);
};

export const createTask = (task: Task) => {
    return api.post(`tasks`, task);
};

export const updateTask = (task: Task) => {
    return api.patch(`tasks/${task.id}`, task);
};

export const deleteTask = (taskId: string) => {
    return api.delete(`tasks/${taskId}`);
};



export const getTaskCategories = (userId: string) => {
    return api.get(`users/${userId}/task-categories`);
};

export const createTaskCategory = (taskCategory: TaskCategory) => {
    return api.post(`task-categories`, taskCategory);
};

export const updateTaskCategory = (taskCategory: TaskCategory) => {
    return api.patch(`task-categories/${taskCategory.id}`, taskCategory);
};

export const deleteTaskCategory = (categoryId: string) => {
    return api.delete(`task-categories/${categoryId}`);
};