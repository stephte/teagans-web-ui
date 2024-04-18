import { useEffect, useRef, forwardRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./app-text-editor.scss";

interface TextEditorProps {
    startValue: any;
    onChange: (json: object, html: string) => void;
    readOnly?: boolean;
    label?: string;
    required?: boolean;
    onBlur?: (event: any) => void;
    onFocus?: (event: any) => void;
    quillRef: any;
};

const toolBarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['link', 'blockquote', 'code-block'],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'font': [] }],
    [{ 'align': [] }],
];

const AppTextEditor = ({ onChange, startValue, readOnly, quillRef, label, required }: TextEditorProps) => {
    const containerRef = useRef(null);

    useEffect(() => {
        quillRef.current?.enable(!readOnly);
    }, [quillRef, readOnly]);

    useEffect(() => {
        const container = containerRef.current;
        const editor = container.appendChild(container.ownerDocument.createElement("div"));
		const quill = new Quill(editor, {
			theme: 'snow',
			modules: {
				toolbar: toolBarOptions,
			},
		});

        quillRef.current = quill;

        if (startValue) {
            quill.setContents(startValue);
        }

		// Detect changes
		quill.on(Quill.events.TEXT_CHANGE, () => {
			onChange(quill.getContents(), quill.getSemanticHTML());
		});
		return () => {
			quill.off(Quill.events.TEXT_CHANGE);
            quillRef.current = null;
            container.innerHTML = '';
		};
	}, [quillRef]);

    return (
        <div className="app-text-editor">
            {label &&
                <label className="text-editor-label">
                    {`${label}${required ? '*' : ''}`}
                </label>
            }
            <div className="quill" ref={containerRef} />
        </div>
    );
};

export default AppTextEditor;