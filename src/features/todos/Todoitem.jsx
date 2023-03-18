import { useMutation, useQueryClient } from "react-query";
import { updateTodo, deleteTodo } from "../../api/todosApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Todoitem = ({ todo }) => {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      //invalidates cache and refetch
      queryClient.invalidateQueries("todos");
    },
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      //invalidates cache and refetch
      queryClient.invalidateQueries("todos");
    },
  });
  return (
    <article key={todo.id}>
      <div className="todo">
        <input
          type="checkbox"
          checked={todo.completed}
          id={todo.id}
          onChange={() =>
            updateTodoMutation.mutate({
              ...todo,
              completed: !todo.completed,
            })
          }
        />
        <label htmlFor={todo.id}>{todo.title}</label>
      </div>
      <button
        className="trash"
        onClick={() => deleteTodoMutation.mutate({ id: todo.id })}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </article>
  );
};

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.todo.id === nextProps.todo.id &&
    prevProps.todo.completed === nextProps.todo.completed
  );
};

// (React.memo) It is a higher order function that returns a new "component" after it wraps the "component" it recieves
// not traditional memoization, it doesn't keep the huge cache of props it received in the past
// It just looks at the previous one dont (previous props vs What its receiving)
// say React.memo as React change if props are change
// It is essentially what it is doing
const memoizedTodoItem = React.memo(Todoitem, areEqual);

// Important
// React memo does a shallow comparison, primitive values like string, number, booleans we compare those value to value and everything as we expected to be
// but the shallow comparison for object types that is by reference so what is happening here they all get new references and so then it creates all the new items again, react memo allows you to solve this issue with the support function
// which we can pass for comparison
export default memoizedTodoItem;
