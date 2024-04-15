import { TaskCategory, validTaskCategory } from "../utilities/types";
import Modal from "./modal";
import AppInput from "../components/app-input";
import AppSelect from "./app-select";
import "./task-category-header.scss";
import { useEffect, useState } from "react";
import { createTaskCategory, updateTaskCategory } from "../data/task";
import CategoryCard from "./category-card";
import { getCardNode } from "../utilities/functions";

interface TaskCatHeaderProps {
    taskCategories: TaskCategory[];
    selectedCategory: TaskCategory;
    setCategory: (category: TaskCategory) => void;
    refreshCategories: () => any;
    setCategories: (categories: TaskCategory[]) => void;
};

const defaultCategory = { id: "", name: "", position: 1 };

const TaskCategoryHeader = ({ taskCategories, selectedCategory, setCategory, refreshCategories, setCategories }: TaskCatHeaderProps) => {

    // category create
    const [createdCategory, setCreatedCategory] = useState<TaskCategory>(defaultCategory);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [createErr, setCreateErr] = useState<string>("");

    // category management
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isEditingCategory, setEditingCategory] = useState<boolean>(false);
    const [currentCategory, setCurrentCategory] = useState<TaskCategory>();
    // const [manageErr, setManageErr] = useState<string>("");

    useEffect(() => {
        if (taskCategories) {
            setCreatedCategory({ ...createdCategory, position: taskCategories.length+1 });
        }
    }, [taskCategories]);

    const editCurrentCategory = ({ target }) => {
        let value = target.value;
        if (target.type === "number") {
			value = +value;
		}

        let cat = { ...createdCategory };
        cat[target.name] = value;
        setCurrentCategory(cat);
    };

    const createUpdateCategory = () => {
        if (!validTaskCategory(currentCategory)) {
            return;
        }
        setLoading(true);
        setCreateErr("");

        if (currentCategory.id) {
            updateTaskCategory(currentCategory)
                .then((res) => {
                    const updatedCat = res.data;
                    refreshCategories()
                        .then((cats) => {
                            if (cats) {
                                setCurrentCategory(updatedCat);
                                setEditingCategory(false);
                            }
                        }).finally(() => {
                            setLoading(false);
                        });
                })
                .catch((err) => {
                    setCreateErr(err.response?.data?.error || err.message || "Error updating category");
                    setLoading(false);
                })
        } else {
            createTaskCategory(currentCategory)
                .then((res) => {
                    const newCat = res.data;
                    refreshCategories()
                        .then((cats) => {
                            if (cats) {
                                setCurrentCategory({ ...defaultCategory, position: cats.length+1 });
                                setCategory(newCat);
                            }
                        }).finally(() => {
                            setEditingCategory(false);
                            setModalOpen(false);
                            setLoading(false);
                        });
                })
                .catch((err) => {
                    setCreateErr(err.response?.data?.error || err.message || "Error creating category");
                    setLoading(false);
                });
        }
    };

    const changeCategory = ({ target }) => {
        if (target.value === selectedCategory.id) {
            return;
        }

        const cat = taskCategories.find((c) => c.id === target.value);
        setCategory(cat);
    }

    // drag n drop stuff
    const [dragging, setDragging] = useState<boolean>(false);
    const handleDragStart = (event: any) => {
        setDragging(true);
        event.dataTransfer.setData("ogNdx", event.currentTarget.dataset.position);
    };
    const handleDragEnd = (event: any) => {
        event.preventDefault();
        setDragging(false);
    };
    const handleDrop = (event: any) => {
        event.preventDefault();

        const ogList = [...taskCategories];

        // const ogCatId = event.dataTransfer.getData("categoryId");
        const ogCatNdx = +event.dataTransfer.getData("ogNdx");
        let category = ogList[ogCatNdx];

        const droppedOnCard = getCardNode(event.target, "category-card-wrapper", 0);
        const droppedOnNdx = droppedOnCard?.dataset?.position ? +droppedOnCard.dataset.position : ogList.length;
        if (droppedOnNdx === ogCatNdx) {
            return;
        }

        // handle list ordering
        let newList = ogList.filter((_, ndx) => ndx !== ogCatNdx);
        newList = [...newList.slice(0, droppedOnNdx), category, ...newList.slice(droppedOnNdx)];
        newList.forEach((c, ndx) => {
            c.position = ndx;
        });

        // gather categories to be updated
        let catsToUpdate = [];
        const startNdx = ogCatNdx < droppedOnNdx ? ogCatNdx : droppedOnNdx;
        const endNdx = (ogCatNdx > droppedOnNdx ? ogCatNdx : droppedOnNdx) + 1;
        catsToUpdate = newList.slice(startNdx, endNdx);

        // update categories on the page
        setCategories(newList);

        // update all tasks that had their position changed
        catsToUpdate.forEach(cat => {
            updateTaskCategory(cat)
                .catch((err) => {
                    setCreateErr(`Error updating category: ${err.response?.data?.error || err.message || ""}`);
                    setCategories(ogList);
                });
        });
        setDragging(false);
    };
    const handleDragOver = (event: any) => {
        event.preventDefault();
    };
    // end drag n drop stuff

    const onPress = (e) => {
		if (e.key === 'Enter') {
			createUpdateCategory();
		}
	};

    const handleModalCloseBtn = () => {
        if (isEditingCategory) {
            setEditingCategory(false);
        } else {
            setModalOpen(false);
        }
    };

    const handleModalAction = () => {

    };

    const openCreateModal = () => {
        setCurrentCategory({ ...defaultCategory });
        setEditingCategory(true);
        setModalOpen(!modalOpen);
    };

    return (
        <div className="cat-wrapper">
            <Modal
                isOpen={modalOpen}
                onClose={handleModalCloseBtn}
                cancelText={isEditingCategory ? "Cancel" : "Close"}
                onAction={isEditingCategory ? handleModalAction : null}
                actionBtnText={isEditingCategory ? currentCategory.id ? "Update" : "Create" : null}
                actionDisabled={isEditingCategory && !validTaskCategory(currentCategory)}
                isLoading={isLoading}
                errorMessage={createErr}
            >
                {isEditingCategory ?
                    <>
                        <h3>{currentCategory.id ? "Edit Category" : "Create Category"}</h3>
                        <AppInput
                            label="Category Name"
                            placeholder="Category Name"
                            onChange={editCurrentCategory}
                            value={currentCategory.name}
                            onKeyDown={onPress}
                            required
                            name="name"
                        />
                    </>
                :
                    <div id="categories-container" onDrop={handleDrop} onDragOver={handleDragOver}>
                        <h3>Manage Categories</h3>
                        {
                            taskCategories?.map((cat, ndx) => {
                                return (
                                    <CategoryCard
                                        key={cat.id}
                                        index={ndx}
                                        category={cat}
                                        onClick={() => {
                                            setCurrentCategory(cat);
                                            setEditingCategory(true);
                                        }}
                                        handleDragStart={handleDragStart}
                                        handleDragEnd={handleDragEnd}
                                        dragging={dragging}
                                    />
                                );
                            })
                        }
                    </div>
                }
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
                            <span className="add-category-btn" onClick={() => openCreateModal()}>
                                Add Category
                            </span>
                        </div>
                        <div>
                            <span
                                className="add-category-btn"
                                onClick={() => {
                                    setModalOpen(true);
                                }}
                            >
                                Manage Categories
                            </span>
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
                        <span
                            className="first-category-btn"
                            onClick={() => openCreateModal()}
                        >
                            Create your first category by clicking here!</span>
                    </>
                }
                
            </div>
        </div>
    );
};

export default TaskCategoryHeader;