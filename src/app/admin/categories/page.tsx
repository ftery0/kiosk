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

  const handleSaveOrder = async () => {
    try {
      const orderedIds = categories.map((cat) => cat.id);
      await fetch("/api/categories/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      alert("순서가 저장되었습니다.");
      loadCategories();
    } catch {
      alert("순서 저장 실패");
    }
  };
  
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newCategories = [...categories];
    [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
    setCategories(newCategories);
  };
  
  const moveDown = (index: number) => {
    if (index === categories.length - 1) return;
    const newCategories = [...categories];
    [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
    setCategories(newCategories);
  };


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
    try {
      await deleteCategory(id);
      loadCategories();
    } catch (error: any) {
      if (error.status === 400) {
        alert(error.message); 
      } else {
        alert("삭제 실패");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">카테고리 관리</h1>

      <button
        className=" btn-primary text-white px-4 py-2 rounded mb-4 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        카테고리 추가
      </button>

      {categories.length > 0 && (
        <button
          className="bg-secondary text-white px-4 py-2 rounded mb-4 ml-4 cursor-pointer"
          onClick={handleSaveOrder}
        >
          순서 저장
        </button>
      )}

      {loading && <p>불러오는 중...</p>}
      {error && <p className="text-red-500">{error}</p>}

  

      <ul>
        {categories.map((cat, index) => (
      <li key={cat.id} className="flex items-center gap-2 mb-2">
        {editingId === cat.id ? (
          <>
            <input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="border px-2"
            />
            <button onClick={() => handleUpdate(cat.id)} className="bg-green-500 text-white px-2 rounded cursor-pointer">
              저장
            </button>
            <button onClick={() => setEditingId(null)} className="text-gray-500 cursor-pointer">
              취소
            </button>
          </>
        ) : (
          <>
            <span className="flex-1">{cat.name}</span>

            
            <button onClick={() => moveUp(index)} className="px-2 text-sm cursor-pointer">▲</button>
            <button onClick={() => moveDown(index)} className="px-2 text-sm cursor-pointer">▼</button>

            <button onClick={() => {
              setEditingId(cat.id);
              setEditingName(cat.name);
            }} className="bg-yellow-400 text-white px-2 rounded cursor-pointer">
              수정
            </button>
            <button onClick={() => handleDelete(cat.id)} className="bg-red-500 text-white px-2 rounded cursor-pointer">
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
