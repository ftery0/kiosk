"use client";
import React, { useEffect, useState } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/category";
import { Category } from "@/types/category.type";
import CategoriesModal from "@/components/adminModal/categories";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategories();
      setCategories(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("카테고리를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async () => {
    try {
      await createCategory(newName);
      setShowModal(false);
      setNewName("");
      loadCategories();
    } catch {
      alert("생성 실패");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateCategory(id, editingName);
      setEditingId(null);
      loadCategories();
    } catch {
      alert("수정 실패");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteCategory(id);
      loadCategories();
    } catch {
      alert("삭제 실패");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">카테고리 관리</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        카테고리 추가
      </button>

      {loading && <p>불러오는 중...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {categories.map((cat) => (
          <li key={cat.id} className="flex items-center gap-2 mb-2">
            {editingId === cat.id ? (
              <>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="border px-2"
                />
                <button
                  onClick={() => handleUpdate(cat.id)}
                  className="bg-green-500 text-white px-2 rounded cursor-pointer"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 cursor-pointer"
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{cat.name}</span>
                <button
                  onClick={() => {
                    setEditingId(cat.id);
                    setEditingName(cat.name);
                  }}
                  className="bg-yellow-400 text-white px-2 rounded cursor-pointer"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="bg-red-500 text-white px-2 rounded cursor-pointer"
                >
                  삭제
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* 모달 */}
      {showModal && (
        <CategoriesModal
          newName={newName}
          setNewName={setNewName}
          handleCreate={handleCreate}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Categories;
