import { TaskCategory, validTaskCategory } from "../utilities/types";
import Modal from "./modal";
import AppInput from "../components/app-input";
import AppSelect from "./app-select";
import "./task-category-header.scss";
import { useState } from "react";
import { createTaskCategory, deleteTaskCategory, updateTaskCategories, updateTaskCategory } from "../data/task";
import CategoryCard from "./category-card";
import { getCardNode } from "../utilities/functions";

interface TaskCatHeaderProps {
    taskCategories: TaskCategory[];
    selectedCategory: TaskCategory;
    setCategory: (category: TaskCategory) => void;
    refreshCategories: () => any;
    setCategories: (categories: TaskCategory[]) => void;
};

const defaultCategory = { id: "", name: "", position: 0 };

const TaskCategoryHeader = ({ taskCategories, selectedCategory, setCategory, refreshCategories, setCategories }: TaskCatHeaderProps) => {

    // category create
    const [isLoading, setLoading] = useState<boolean>(false);
    const [createErr, setCreateErr] = useState<string>("");

    // category management
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isEditingCategory, setEditingCategory] = useState<boolean>(false);
    const [currentCategory, setCurrentCategory] = useState<TaskCategory>();
    const [hasChanged, setHasChanged] = useState<boolean>(false);
    const [creatingFromManagePage, setCreatingFromManagePage] = useState<boolean>(false);
    const [isDeleting, setDeleting] = useState<boolean>(false);

    const editCurrentCategory = ({ target }) => {
        let value = target.value;
        if (target.type === "number") {
			value = +value;
		}

        let cat = { ...currentCategory };
        cat[target.name] = value;
        setCurrentCategory(cat);
        setHasChanged(true);
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
                                setHasChanged(false);
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
                                setCurrentCategory({ ...defaultCategory, position: cats.length });
                                setCategory(newCat);
                            }
                        }).finally(() => {
                            setEditingCategory(false);
                            setHasChanged(false);
                            setModalOpen(creatingFromManagePage);
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
        updateTaskCategories(catsToUpdate)
            .catch((err) => {
                setCreateErr(`Error updating categories: ${err.response?.data?.error || err.message || ""}`);
                setCategories(ogList);
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
        if (isDeleting) {
            setDeleting(false);
        } else if (isEditingCategory) {
            if (!(currentCategory.id || creatingFromManagePage)) {
                setModalOpen(false);
            }
            setCurrentCategory({ ...taskCategories.find((tc) => tc.id === currentCategory.id) });
            setEditingCategory(false);
            setHasChanged(false);
        } else {
            setModalOpen(false);
        }
    };

    const handleModalAction = () => {
        setLoading(true);
        if (isDeleting) {
            deleteTaskCategory(currentCategory.id)
                .then(() => {
                    setEditingCategory(false);
                    setHasChanged(false);
                    setDeleting(false);
                    refreshCategories()
                        .then((res) => {
                            if (!res.length) {
                                setModalOpen(false);
                            } else if (currentCategory.id === selectedCategory.id) {
                                setCategory(res[0]);
                            }
                            setLoading(false);
                        });
                })
                .catch((err) => {
                    setCreateErr(`Error deleting category: ${err.response?.data?.error || err.message || ""}`);
                    setLoading(false);
                });
        } else if (isEditingCategory) {
            createUpdateCategory();
        }
    };

    const openCreateModal = (fromManagePage: boolean) => {
        setCurrentCategory({ ...defaultCategory, position: taskCategories.length });
        setDeleting(false);
        setEditingCategory(true);
        setHasChanged(false);
        setModalOpen(true);
        setCreatingFromManagePage(fromManagePage);
    };

    const getModalContent = () => {
        if (isDeleting) {
            return (
                <>
                    <p>Are you sure wou want to delete category '<b>{currentCategory.name}</b>'?</p>
                    <p>WARNING: This category AND all of its tasks will be lost!!</p>
                </>
            );
        } else if (isEditingCategory) {
            return (
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
            ); 
        } else {
            return (
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
                                        setCurrentCategory({ ...cat });
                                        setEditingCategory(true);
                                        setHasChanged(false);
                                    }}
                                    handleDragStart={handleDragStart}
                                    handleDragEnd={handleDragEnd}
                                    dragging={dragging}
                                />
                            );
                        })
                    }
                </div>
            );
        }
    };

    const actionBtnText = () => {
        if (isDeleting) {
            return "Delete";
        } else if (isEditingCategory) {
            return currentCategory.id ? "Update" : "Create";
        }

        return null;
    };

    const subBtnAction = () => {
        if (isEditingCategory) {
            setDeleting(true);
        } else {
            openCreateModal(true);
        }
    };

    const getSubBtnText = () => {
        if (isEditingCategory && !isDeleting && currentCategory?.id) {
            return "DELETE CATEGORY";
        } else if (!(isEditingCategory || isDeleting)) {
            return "ADD CATEGORY";
        } else {
            return null;
        }
    };

    return (
        <div className="cat-wrapper">
            <Modal
                isOpen={modalOpen}
                onClose={handleModalCloseBtn}
                cancelText={isEditingCategory || isDeleting ? "Cancel" : "Close"}
                onAction={isEditingCategory || isDeleting ? handleModalAction : null}
                actionBtnText={actionBtnText()}
                actionDisabled={!currentCategory || isLoading || (!isDeleting && (isEditingCategory && !(hasChanged && validTaskCategory(currentCategory))))}
                isLoading={isLoading}
                errorMessage={createErr}
                subBtnText={getSubBtnText()}
                subBtnAction={() => subBtnAction()}
            >
                {getModalContent()}
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
                            <span className="add-category-btn" onClick={() => openCreateModal(false)}>
                                Add Category
                            </span>
                        </div>
                        <div>
                            <span
                                className="add-category-btn"
                                onClick={() => {
                                    setDeleting(false);
                                    setEditingCategory(false);
                                    setHasChanged(false);
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
                            onClick={() => openCreateModal(false)}
                        >
                            Create your first category by clicking here!</span>
                    </>
                }
                
            </div>
        </div>
    );
};

export default TaskCategoryHeader;