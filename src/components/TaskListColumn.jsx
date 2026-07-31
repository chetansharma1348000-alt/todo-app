import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const PRIORITIES = ["High", "Medium", "Low"];

export default function TaskListColumn({ list, tasks, onAddTask }) {
  return (
    <div className="list-column">
      <div className="list-column-header">
        <h3>{list.title}</h3>
        <button onClick={onAddTask}>+ Task</button>
      </div>

      {PRIORITIES.map((priority) => (
        <div key={priority} className="priority-lane">
          <div className={`priority-label priority-${priority.toLowerCase()}`}>{priority}</div>
          <Droppable droppableId={`${list.id}::${priority}`}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="priority-lane-body">
                {tasks
                  .filter((t) => (t.priority || "Medium") === priority)
                  .map((t, index) => (
                    <Draggable key={t.id} draggableId={t.id} index={index}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                        >
                          <TaskCard task={t} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </div>
  );
}
