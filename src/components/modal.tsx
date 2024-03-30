import { useEffect, useRef } from "react";
import Button from "./button";
import LoadBox from "./load-box";
import "./modal.scss";

interface ModalProps {
    isOpen: boolean;
    onClose: () => any;
    onAction?: () => any;
    actionBtnText?: string;
    actionDisabled?: boolean;
    children: any;
    isLoading?: boolean;
    errorMessage?: string;
    wide?: boolean;
}

const Modal = ({ isOpen, onClose, onAction, actionBtnText, actionDisabled, wide, children, isLoading, errorMessage }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node) && !isLoading) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("click", onOutsideClick, true);
        }

        return () => document.removeEventListener("click", onOutsideClick, true);
    }, [isOpen]);

    if (isOpen) {
        return (
            <div className="modal">
                <div className={`modal-content ${wide ? 'wide' : ''}`} ref={modalRef}>
                    <LoadBox isLoading={isLoading} />
                    {children}
                    <div className={`modal-btns ${onAction ? 'double' : ''}`}>
                        <div>
                            <Button
                                text="Close"
                                onClick={() => onClose()}
                            />
                        </div>
                        {onAction &&
                            <div>
                                <Button
                                    text={actionBtnText || "Confirm"}
                                    onClick={() => onAction()}
                                    disabled={actionDisabled}
                                />
                            </div>
                        }
                    </div>
                    <span className="error">{errorMessage}</span>
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default Modal;