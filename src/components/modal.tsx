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
    cancelText?: string;
    children: any;
    isLoading?: boolean;
    errorMessage?: string;
    wide?: boolean;
    subBtnText?: string;
    subBtnAction?: (event: any) => void;
}

const Modal = ({ isOpen, onClose, onAction, actionBtnText, actionDisabled, cancelText, wide, children, isLoading, errorMessage, subBtnText, subBtnAction }: ModalProps) => {
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
                                text={cancelText || "Close"}
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
                    {subBtnText &&
                        <div className="subbtn">
                            <span className="clickable" onClick={subBtnAction}>{subBtnText}</span>
                        </div>
                    }
                    {errorMessage &&
                        <span className="error">{errorMessage}</span>
                    }
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default Modal;