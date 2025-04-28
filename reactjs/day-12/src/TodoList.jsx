import { useState } from "react";

export function TodoList({ listWorks, addWork }) {
  const [dataInput, setInput] = useState("");
  // trạng thái công việc đang chỉnh sửa
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // tạo ID duy nhất cho công việc mới
  let nextId = listWorks.length
    ? Math.max(...listWorks.map((item) => item.id)) + 1
    : 1;

  // add công việc mới
  const submitData = (e) => {
    e.preventDefault();
    if (dataInput === "") {
      alert("Vui lòng nhập thông tin");
      return;
    }
    addWork([...listWorks, { id: nextId++, value: dataInput }]);
    setInput("");
  };

  // xóa công việc
  const removeItem = (id) => {
    const updatedList = listWorks.filter((item) => item.id !== id);
    addWork(updatedList);
    // nếu đang chỉnh sửa công việc này, hủy chỉnh sửa
    if (editingId === id) {
      setEditingId(null);
      setEditValue("");
    }
  };

  // Bắt đầu chỉnh sửa công việc
  const startEdit = (id, value) => {
    setEditingId(id);
    setEditValue(value);
  };

  // Lưu công việc đã chỉnh sửa
  const saveEdit = (id) => {
    if (editValue === "") {
      alert("Nhập nội dung công việc");
      return;
    }
    const updatedList = listWorks.map((item) =>
      item.id === id ? { ...item, value: editValue } : item
    );
    addWork(updatedList);
    setEditingId(null);
    setEditValue("");
  };

  // Hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  return (
    <div className="bg-[#1E1E3F] p-8 rounded-lg w-96">
      <h1 className="text-2xl font-bold text-center text-white mb-6">
          TodoList App
      </h1>
      <form onSubmit={submitData}>
        <div className="flex mb-6">
          <input
            type="text"
            placeholder="What is the task today?"
            className="flex-1 p-2 rounded-l-md focus:outline-none"
            onChange={(e) => setInput(e.target.value)}
            value={dataInput}
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 rounded-r-md"
          >
            Add Task
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {listWorks.map((work) => (
          <div key={work.id} className="flex items-center justify-between bg-purple-400 p-3 rounded-md">
            {editingId === work.id ? (
              // Chế độ chỉnh sửa
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 p-2 rounded-md focus:outline-none"
                />
                <button
                  onClick={() => saveEdit(work.id)}
                  className="text-white bg-green-500 px-2 py-1 rounded-md"
                >
                  Lưu
                </button>
                <button
                  onClick={cancelEdit}
                  className="text-white bg-red-500 px-2 py-1 rounded-md"
                >
                  Hủy
                </button>
              </div>
            ) : (
              // Chế độ hiển thị
              <>
                <span className="text-white max-w-full break-all">{work.value}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(work.id, work.value)}
                    className="text-white"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => removeItem(work.id)}
                    className="text-white"
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
