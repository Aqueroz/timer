
window.addEventListener("DOMContentLoaded", () => {
    var startButton = document.getElementById("start")
    var stopButton = document.getElementById("stop")
    var clearButton = document.getElementById("clear")
    var timer = document.getElementById("timer")
    var selectName = document.getElementById("selectName")
    var taskList = document.getElementById("taskList")

    var intervalId = null

    var currentTime = 0

    var paused = false

    //cronometro
    function startTimer(initialTime) {
        let cont = Number(initialTime)

        intervalId = setInterval(() => {
            cont += 1
            currentTime = cont
            timer.textContent = formatTime(cont)
        }, 1000)
    }

    function formatTime(seconds) {
        let hours = Math.floor(seconds / 3600)
        let minutes = Math.floor((seconds / 3600) / 60)
        let secondsRemain = seconds % 60
        return `${pad(hours)}:${pad(minutes)}:${pad(secondsRemain)}`;
    }

    function pad(n) {
        return String(n).padStart(2, "0")
    }

    startButton.addEventListener("click", () => {

        const selectedTaskId = selectName.value
        const selectedTask = tasks.find(task => task.id === Number(selectedTaskId))

        if (selectedTask) {
            console.log(selectedTask.name)
            selectedTask.times.push(currentTime)
        }

        clearInterval(intervalId) //evitar mais de um intervalo
        startTimer(currentTime)

    })

    stopButton.addEventListener("click", () => {
        clearInterval(intervalId)
        if (stopButton.textContent == "Parar" && currentTime != 0) {
            stopButton.textContent = "Continuar"
            paused = true
        } else if (paused) {
            startTimer(currentTime)
            paused = false
            stopButton.textContent = "Parar"
        }
    })

    clearButton.addEventListener("click", () => {

        const selectedTaskId = selectName.value
        const selectedTask = tasks.find(t => t.id === Number(selectedTaskId))

        if (selectedTask) {
            selectedTask.times.push(currentTime)
            window.electronAPI.saveData({ tasks })
        }

        clearInterval(intervalId)
        timer.textContent = "00:00"


        console.log("Salvando:", tasks)

        currentTime = 0
        paused = false
        stopButton.textContent = "Parar"
    })


    var inputText = document.getElementById("inputTask")
    var buttonTask = document.getElementById("addTask")

    const tasks = []

    inputText.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            buttonTask.click()
        }
    })

    buttonTask.addEventListener("click", () => {
        const taskName = inputText.value.trim()
        if (!taskName) return

        if (tasks.some(t => t.name === taskName)) {
            alert("Tarefa já existente")
            inputText.value = ""
            inputText.focus()

            return
        }

        addTask(taskName)
        inputText.value = ""
    })


    //adicionar tarefa com id
    function updateTaskSelect() {
        selectName.innerHTML = ""

        tasks.forEach(task => {
            const option = document.createElement("option")
            option.value = task.id
            option.textContent = task.name
            selectName.appendChild(option)
        })
    }

    function addTask(taskName) {
        //gera um id unico
        const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1
        const task = { id, name: taskName, times: [] }
        tasks.push(task)
        updateTaskSelect()
        renderTask(task)
    }



    function renderTaskAll() {
        taskList.innerHTML = ""
        tasks.forEach(renderTask)
    }

    function deleteTask(id) {
        const index = tasks.findIndex(t => t.id === id)
        if (index !== -1) {
            tasks.splice(index, 1) // Remove do array
            updateTaskSelect()
            renderTaskAll()

            window.electronAPI.saveData({ tasks }) // Salva o novo estado
        }
    }


    const taskButton = document.getElementById("taskButton")
    const timerButton = document.getElementById("timerButton")
    const graphButton = document.getElementById("graphButton")

    const sections = document.querySelectorAll(".section")

    function showsection(className) {
        sections.forEach(section => {
            if (section.classList.contains(className)) {
                section.classList.add("active")
            } else {
                section.classList.remove("active")
            }
        })
    }


    taskButton.addEventListener("click", () => showsection("list"))
    timerButton.addEventListener("click", () => showsection("timer"))
    graphButton.addEventListener("click", () => {
        showsection("graph")
        renderChart()
    })

    function renderTask(task) {
        const taskContainer = document.createElement("div")
        taskContainer.classList.add("task-item")

        const paragraph = document.createElement("p")
        paragraph.textContent = task.name
        paragraph.classList.add("task-name")

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "X"
        deleteBtn.classList.add("delete-task")

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id)
        })

        taskContainer.appendChild(paragraph)
        taskContainer.appendChild(deleteBtn)
        taskList.appendChild(taskContainer)
    }


    window.electronAPI.loadData().then(data => {
        if (data.tasks) {
            data.tasks.forEach(task => {
                if (!tasks.some(t => t.name === task.name)) {

                    const normalizedTask = {
                        id: Number(task.id),
                        name: task.name,
                        times: Array.isArray(task.times) ? task.times : []
                    }

                    tasks.push(task)
                    renderTask(task)
                }
            })
            updateTaskSelect()
        }

        console.log("caregados: ", tasks)
    })

    //grafico

    let chart

    function renderChart() {
        const labels = tasks.map(t => t.name)
        const data = tasks.map(t => t.times.reduce((a, b) => a + b, 0))

        const ctx = document.getElementById('chart').getContext('2d');

        // Se já tiver um gráfico, destrói pra evitar sobreposição
        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tempo total (min)',
                    data: tasks.map(t => Math.floor(t.times.reduce((a, b) => a + b, 0) / 60))
                    ,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 10
                        }
                    }
                }
            }
        });
    }
})

