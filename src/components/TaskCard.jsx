export default function TaskCard({ task }) {
  return (
    <div className="task-card">
      <div className="task-title">{task.title}</div>
      {task.description && <div className="task-desc">{task.description}</div>}
      {task.dueDate && <div className="task-due">Due: {task.dueDate}</div>}
    </div>
  );
}
