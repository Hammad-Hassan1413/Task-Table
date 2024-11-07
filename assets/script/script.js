'use strict';
const newTask = document.querySelector('.new-task');
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.cancel-button');
const inputTitle = document.querySelector('#title');
const label = document.querySelector('.lable');
const status = document.querySelector('#status');
const priority = document.querySelector('#priority');
const submit = document.querySelector('.submit');
const tableBody = document.querySelector('tbody');
const searchBar = document.querySelector('.search');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function showTask() {
    modal.classList.remove('hidden');
    modal.classList.add('show');
    overlay.classList.remove('hidden');
    overlay.classList.add('show');
}

function close() {
    modal.classList.remove('show');
    overlay.classList.remove('show');
    setTimeout(function () {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    }, 300);
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        close();
    }
});

newTask.addEventListener('click', showTask);
closeModal.addEventListener("click", close);
overlay.addEventListener('click', close);

function renderTasks() {
    tableBody.innerHTML = '';
    tasks.forEach((task, index) => {
        const newRow = `
            <tr>
                <td><input type="checkbox"></td>
                <td>${task.id}</td>
                <td><span class="tag ${task.label}">${task.label}</span> ${task.title}</td>
                <td class="status-${task.status.toLowerCase()}">${task.status}</td>
                <td class="priority-${task.priority.toLowerCase()}">${task.priority}</td>
                <td>${task.date}</td>
                <td><button class="delete-btn" data-index="${index}">Delete</button></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('afterbegin', newRow);
    });

    applyFilters();
    addDeleteFunctionality();
}

function addDeleteFunctionality() {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.removeEventListener('click', deleteRow);
        button.addEventListener('click', deleteRow);
    });
}

function deleteRow() {
    const rowIndex = this.dataset.index;
    const row = this.closest('tr');

    row.classList.add('fade-out');
    setTimeout(() => {
        tasks.splice(rowIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }, 300);
}

submit.addEventListener('click', function (event) {
    event.preventDefault();
    const titleValue = inputTitle.value;
    const labelValue = label.value;
    const statusValue = status.value;
    const priorityValue = priority.value;
    if (titleValue === '' || labelValue === '' || statusValue === '' || priorityValue === '') {
        alert('Please fill out all fields.');
        return;
    }
    const task = {
        id: `TASK-${Math.floor(Math.random() * 10000)}`,
        title: titleValue,
        label: labelValue,
        status: statusValue,
        priority: priorityValue,
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
    };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    inputTitle.value = '';
    label.value = '';
    status.value = '';
    priority.value = '';
    close();
});

document.addEventListener('DOMContentLoaded', function () {
    renderTasks();
    const statusBtn = document.querySelector('.status-btn');
    const statusDropdown = document.querySelector('.status-dropdown');
    const priorityBtn = document.querySelector('.priority-btn');
    const priorityDropdown = document.querySelector('.priority-dropdown');
    const tableRows = tableBody.querySelectorAll('tr');
    statusBtn.addEventListener('click', function () {
        statusDropdown.classList.toggle('hidden');
        if (!statusDropdown.classList.contains('hidden')) {
            priorityDropdown.classList.add('hidden');
        }
    });
    priorityBtn.addEventListener('click', function () {
        priorityDropdown.classList.toggle('hidden');
        if (!priorityDropdown.classList.contains('hidden')) {
            statusDropdown.classList.add('hidden');
        }
    });
    const statusOptions = document.querySelectorAll('input[name="status"]');
    statusOptions.forEach(option => {
        option.addEventListener('change', function () {
            const selectedStatus = this.value.toLowerCase();
            tableRows.forEach(row => {
                const taskStatus = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
                if (taskStatus.includes(selectedStatus)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
    const priorityOptions = document.querySelectorAll('input[name="priority"]');
    priorityOptions.forEach(option => {
        option.addEventListener('change', function () {
            const selectedPriority = this.value.toLowerCase();
            tableRows.forEach(row => {
                const taskPriority = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
                if (taskPriority.includes(selectedPriority)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
});

const taskDateInput = document.querySelector('#taskDate');
taskDateInput.addEventListener('input', function () {
    const selectedDate = new Date(this.value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const taskDate = row.querySelector('td:nth-child(6)').textContent;

        if (taskDate === selectedDate) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

searchBar.addEventListener('input', function () {
    const searchText = searchBar.value.toLowerCase();
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const taskTitle = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        if (taskTitle.includes(searchText)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

const priorityInput = document.querySelector('.priority');
priorityInput.addEventListener('input', function () {
    const searchInput = priorityInput.value.toLowerCase();
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const taskPriority = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
        if (taskPriority.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    })
});
function applyFilters() {
    const tableRows = tableBody.querySelectorAll('tr');
    const statusOptions = document.querySelectorAll('input[name="status"]');
    statusOptions.forEach(option => {
        option.addEventListener('change', function () {
            const selectedStatus = this.value.toLowerCase();
            tableRows.forEach(row => {
                const taskStatus = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
                row.style.display = taskStatus.includes(selectedStatus) ? '' : 'none';
            });
        });
    });
};
