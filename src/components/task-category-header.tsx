import { TaskCategory, validTaskCategory } from "../utilities/types";
import Modal from "./modal";
import AppInput from "../components/app-input";
import AppSelect from "./app-select";
import "./task-category-header.scss";
import { useEffect, useState } from "react";
import { createTaskCategory } from "../data/task";

interface TaskCatHeaderProps {
    taskCategories: TaskCategory[];
    selectedCategory: TaskCategory;
    setCategory: (category: TaskCategory) => any;
    refreshCategories: () => any;
};

const defaultCategory = { name: "", position: 1 };

const TaskCategoryHeader = ({ taskCategories, selectedCategory, setCategory, refreshCategories }: TaskCatHeaderProps) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [createdCategory, setCreatedCategory] = useState<TaskCategory>(defaultCategory);
    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const [createErr, setCreateErr] = useState<string>("");

    useEffect(() => {
        if (taskCategories) {
            setCreatedCategory({ ...createdCategory, position: taskCategories.length+1 });
        }
    }, [taskCategories]);

    const editCreatedCategory = ({ target }) => {
        let value = target.value;
        if (target.type === "number") {
			value = +value;
		}

        let cat = { ...createdCategory };
        cat[target.name] = value;
        setCreatedCategory(cat);
    };

    const createCategory = () => {
        if (!validTaskCategory(createdCategory)) {
            return;
        }
        setCreateLoading(true);
        setCreateErr("");

        createTaskCategory(createdCategory)
            .then((res) => {
                const newCat = res.data;
                refreshCategories()
                    .then((cats) => {
                        if (cats) {
                            setCreatedCategory({ ...defaultCategory, position: cats.length+1 });
                            setCategory(newCat);
                        }
                    }).finally(() => {
                        setModalOpen(false);
                        setCreateLoading(false);
                    });
            })
            .catch((err) => {
                setCreateErr(err.response?.data?.error || err.message || "Error creating category");
                setCreateLoading(false);
            });
    };

    const changeCategory = ({ target }) => {
        if (target.value === selectedCategory.id) {
            return;
        }

        const cat = taskCategories.find((c) => c.id === target.value);
        setCategory(cat);
    }

    const onPress = (e) => {
		if (e.key === 'Enter') {
			createCategory();
		}
	};

    // TODO: create category management page
    return (
        <div className="cat-wrapper">

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAction={() => createCategory()}
                actionDisabled={!validTaskCategory(createdCategory)}
                actionBtnText="Add"
                isLoading={createLoading}
                errorMessage={createErr}
            >
                <h3>Create New Category</h3>
                <AppInput
                    label="Category Name"
                    placeholder="Category Name"
                    onChange={editCreatedCategory}
                    value={createdCategory.name}
                    onKeyDown={onPress}
                    required
                    name="name"
                />
            </Modal>

            <div className="cat-select">
                { taskCategories?.length ?
                    <>
                        <AppSelect
                            label="Categories"
                            onChange={changeCategory}
                            selectedValue={selectedCategory?.id || ""}
                            name="category"
                            selectList={taskCategories?.map((c) => {
                                return { value: c.id, label: c.name };
                            })}
                        />
                        <div className="add-category-btn-div">
                            <span className="add-category-btn" onClick={() => setModalOpen(!modalOpen)}>Add Category</span>
                        </div>
                        <div>
                            <span className="add-category-btn" onClick={() => console.log('Category management')}>Manage Categories</span>
                        </div>
                    </>
                :
                    <>
                        <p id="first-task-desc">
                            This is the task management page, where you can create and manage your task list and keep your life more organized!!
                            <br/>
                            <br/>
                            You can start by creating a category (i.e. 'Chores', 'Work', etc.)
                        </p>
                        <span className="first-category-btn" onClick={() => setModalOpen(!modalOpen)}>Create your first category by clicking here!</span>
                    </>
                }
                
            </div>
        </div>
    );
};

export default TaskCategoryHeader;