const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

document.addEventListener('DOMContentLoaded', () => {
    const sumbitForm = document.querySelector('#form');
    sumbitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo();
    })

    if(isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, () => {
    // console.log(todos);
    const uncompletedTODOList = document.querySelector('#todos');
    uncompletedTODOList.innerHTML = '';

    const completedTODOList = document.querySelector('#completed-todos');
    completedTODOList.innerHTML = '';

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted) {
            uncompletedTODOList.append(todoElement);
        } else {
            completedTODOList.append(todoElement);
        }
    }

});

// FUNCTIONs

const addTodo = () => {
    const textTodo = document.querySelector('#title').value;
    const timestamp = document.querySelector('#date').value;

    const generateID = generateId();

    const todoObject = generateTodoObject(generateID, textTodo, timestamp, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

    savedData();
};

const generateId = () => {
    return +new Date();
};

const generateTodoObject = (id, task, timestamp, isCompleted) => {
    return {
        id,
        task,
        timestamp,
        isCompleted,
    };
};

const makeTodo = (todoObject) => {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;

    const textTimeStamp = document.createElement('p');
    textTimeStamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimeStamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', () => {
            undoTaskFromCompleted(todoObject.id);
        })

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', () => {
            removeTaskFromCompleted(todoObject.id);
        })

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', () => {
            addTaskToCompleted(todoObject.id);
        });

        container.append(checkButton);
    }

    return container;
};

function findTodo(todoId) {
    // for (const todoItem of todos) {
    //   if (todoItem.id === todoId) {
    //     return todoItem;
    //   }
    // }
    // return null;
    const todoItem = todos.filter((todoItem) => todoItem.id == todoId)[0];
    if (todoItem !== undefined) {
        return todoItem;
    }
    return null;
};

function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;

    document.dispatchEvent(new Event(RENDER_EVENT));

    savedData();
};

function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    savedData();

};

function removeTaskFromCompleted(todoId) {
    const indexTarget = todos.findIndex((todoItem) => todoItem.id === todoId);
    if (indexTarget === -1) {
        return
    }

    todos.splice(indexTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));

    savedData();

}

const savedData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const isStorageExist = () => {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung local storage')
        return false;
    }

    return true;
}

const loadDataFromStorage = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data !== null) {
        for (const todo of data) {
            todos.push(todo);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}