import { TaskCategory } from "../utilities/types";
import "./category-card.scss";

// TaskCategory {
//     id?: string;
//     name: string;
//     position: number;
// };

interface CategoryCardProps {
    category: TaskCategory,
    onClick: (event: any) => any;
    dragging?: boolean;
    handleDragStart?: (event: any) => any;
    handleDragEnd?: (event: any) => any;
    index?: number;
}

const CategoryCard = ({ category, dragging, handleDragStart, handleDragEnd, onClick, index }: CategoryCardProps) => {
    return (
        <div
            id={category.id}
            data-position={index}
            className="category-card-wrapper clickable"
            onClick={onClick}
            draggable={dragging !== undefined && !dragging}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="category-card">
                <div className="name">{category.name}</div>
            </div>
        </div>
    );
};

export default CategoryCard;