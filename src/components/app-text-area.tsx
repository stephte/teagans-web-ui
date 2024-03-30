import { ChangeEvent, FocusEvent, KeyboardEvent } from "react";
import "./app-text-area.scss";

interface TextAreaProps {
    value: string;
    name: string;
    onChange: (event: ChangeEvent) => void;
    label?: string;
    cols?: number;
    rows?: number;
    disabled?: boolean;
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
    required?: boolean;
    onKeyDown?: (event: KeyboardEvent) => undefined;
    onBlur?: (event: FocusEvent) => undefined;
    onFocus?: (event: FocusEvent) => undefined;
}

const AppTextArea = ({
    value,
    name,
    cols,
    rows,
    disabled,
    minLength,
    maxLength,
    onChange,
    placeholder,
    label,
    required,
    onKeyDown,
    onBlur,
    onFocus
}: TextAreaProps) => {
	return (
		<>
			{label &&
                <label className="text-area-label">
                    {`${label}${required ? '*' : ''}`}
                </label>
            }
			<textarea
				className="app-text-area"
				placeholder={placeholder}
				onChange={onChange}
				onBlur={onBlur}
				onFocus={onFocus}
				value={value || ""}
				required={required || null}
				name={name}
				onKeyDown={onKeyDown}
				disabled={disabled}
                cols={cols}
                rows={rows}
				minLength={minLength}
				maxLength={maxLength}
			/>
		</>
	);
};

export default AppTextArea;