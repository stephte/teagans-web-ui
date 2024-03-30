import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import "./app-text-editor.scss";

interface TextEditorProps {
    value: string;
    onChange: (event: any) => void;
    readOnly?: boolean;
    label?: string;
    required?: boolean;
    placeholder?: string;
    onBlur?: (event: any) => void;
    onFocus?: (event: any) => void;
};

const AppTextEditor = ({ value, readOnly, label, required, onChange, placeholder, onBlur, onFocus }: TextEditorProps) => {
    return (
        <div className="app-text-editor">
            {label &&
                <label className="text-editor-label">
                    {`${label}${required ? '*' : ''}`}
                </label>
            }
            <ReactQuill
                className="quill"
                value={value}
                readOnly={readOnly}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                theme="snow"
            />
        </div>
    );
};

export default AppTextEditor;