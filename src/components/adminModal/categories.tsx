"use client";
import React from "react";

interface CategoriesModalProps {
  newName: string;
  setNewName: (value: string) => void;
  handleCreate: () => void;
  onClose: () => void;
}

const CategoriesModal = ({
  newName,
  setNewName,
  handleCreate,
  onClose,
}: CategoriesModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-2">카테고리 생성</h2>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border p-2 w-full mb-4"
          placeholder="카테고리 이름"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesModal;
