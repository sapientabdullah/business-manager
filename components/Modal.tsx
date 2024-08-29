"use client";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className=" p-8 rounded-lg max-w-lg w-full">
          <button
            className="absolute top-2 right-2 text-gray-600"
            onClick={onClose}
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
