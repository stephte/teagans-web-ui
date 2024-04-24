import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./quill-display.scss";

interface QuillDisplayProps {
    value: any;
};

const QuillDisplay = ({ value }: QuillDisplayProps) => {
    const quillRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const editor = container.appendChild(container.ownerDocument.createElement("div"));
		const quill = new Quill(editor, {
			theme: 'snow',
			modules: {
				toolbar: [],
			},
		});

        quillRef.current = quill;
        quillRef.current?.enable(false);

		return () => {
            quillRef.current = null;
            container.innerHTML = '';
		};
	}, [quillRef]);

    useEffect(() => {
        if (quillRef.current) {
            quillRef.current.setContents(value);
        }
    }, [value, quillRef]);

    return (
        <div className="quill-display">
            <div className="quill-container" ref={containerRef} />
        </div>
    );
};

export default QuillDisplay;