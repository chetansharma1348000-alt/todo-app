import { useState } from "react";

export default function AddListForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");
    setOpen(false);
  }

  if (!open) {
    return <button className="add-list-btn" onClick={() => setOpen(true)}>+ Add another list</button>;
  }

  return (
    <form className="add-list-form" onSubmit={submit}>
      <input autoFocus placeholder="List name" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="add-list-actions">
        <button type="submit">Add</button>
        <button type="button" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}
