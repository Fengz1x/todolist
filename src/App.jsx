import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState('待办')
  const [duration, setDuration] = useState('15:30')
  const [todoContent, setTodoContent] = useState('')

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (!todoContent.trim()) return
    
    setTodos([...todos, {
      id: Date.now(),
      text: todoContent,
      completed: false,
      category: selectedCategory,
      date: selectedDate,
      duration: duration
    }])
    setTodoContent('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const categories = ['待办', '复盘', '统计', '分类']
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  const renderCalendar = () => {
    const currentDate = new Date(selectedDate)
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []

    for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          <h2>{year}年{month + 1}月</h2>
        </div>
        <div className="weekdays">
          {weekDays.map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="days">
          {days.map(day => (
            <div
              key={day.getTime()}
              className={`day ${day.getTime() === selectedDate.getTime() ? 'selected' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              {day.getDate()}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="sidebar">
        {categories.map(category => (
          <div
            key={category}
            className={`category-item ${selectedCategory === category ? 'selected' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </div>
        ))}
        <div className="settings">⚙️</div>
      </div>
      <div className="main-content">
        {renderCalendar()}
        <div className="todo-section">
          <div className="todo-header">
            <input
              type="text"
              value={todoContent}
              onChange={(e) => setTodoContent(e.target.value)}
              placeholder="今天复盘心得..."
              className="todo-input"
            />
            <input
              type="time"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="time-input"
            />
            <button onClick={addTodo} className="add-button">撰写</button>
          </div>
          <div className="todo-list">
            {todos
              .filter(todo => 
                todo.date.toDateString() === selectedDate.toDateString() &&
                todo.category === selectedCategory
              )
              .map(todo => (
                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span className="todo-text">{todo.text}</span>
                  <span className="todo-duration">{todo.duration}</span>
                  <button onClick={() => deleteTodo(todo.id)} className="delete-button">×</button>
                </div>
              ))}
          </div>
          <div className="add-todo-button">
            <button onClick={() => document.querySelector('.todo-input').focus()}>+</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
