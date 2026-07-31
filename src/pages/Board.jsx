import { useEffect, useState } from "react";
import {
  collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp,
} from "firebase/firestore";
import { DragDropContext } from "@hello-pangea/dnd";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import TaskListColumn from "../components/TaskListColumn";
import AddListForm from "../components/AddListForm";
import AddTaskModal from "../components/AddTaskModal";

export default function Board() {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [modalListId, setModalListId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "taskLists"), where("createdBy", "==", user.email));
    return onSnapshot(q, (snap) => setLists(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, [user.email]);

  useEffect(() => {
    if (lists.length === 0) { setTasks([]); return; }
    const listIds = lists.map((l) => l.id).slice(0, 10); // Firestore "in" supports up to 10
    const q = query(collection(db, "tasks"), where("listId", "in", listIds));
    return onSnapshot(q, (snap) => setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, [lists]);

  async function handleAddList(title) {
    await addDoc(collection(db, "taskLists"), {
      title,
      createdBy: user.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async function handleAddTask(listId, taskData) {
    await addDoc(collection(db, "tasks"), {
      ...taskData,
      listId,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "taskLists", listId), { updatedAt: serverTimestamp() });
  }

  function tasksForList(listId) {
    return tasks.filter((t) => t.listId === listId);
  }

  // Dropping a card onto a lane (droppableId = "<listId>::<priority>") moves
  // it into that list AND sets that priority - this is how drag & drop both
  // moves tasks between lists and changes priority inside a list.
  async function onDragEnd(result) {
    const { destination, draggableId } = result;
    if (!destination) return;
    const [destListId, destPriority] = destination.droppableId.split("::");
    await updateDoc(doc(db, "tasks", draggableId), {
      listId: destListId,
      priority: destPriority,
    });
    await updateDoc(doc(db, "taskLists", destListId), { updatedAt: serverTimestamp() });
  }

  return (
    <div className="board-page">
      <header className="board-header">
        <h1>My To Do Lists</h1>
        <div className="board-header-right">
          <span>{user.email}</span>
          <button onClick={() => signOut(auth)}>Log out</button>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {lists.map((list) => (
            <TaskListColumn
              key={list.id}
              list={list}
              tasks={tasksForList(list.id)}
              onAddTask={() => setModalListId(list.id)}
            />
          ))}
          <AddListForm onAdd={handleAddList} />
        </div>
      </DragDropContext>

      {modalListId && (
        <AddTaskModal
          onClose={() => setModalListId(null)}
          onSubmit={(data) => {
            handleAddTask(modalListId, data);
            setModalListId(null);
          }}
        />
      )}
    </div>
  );
}
