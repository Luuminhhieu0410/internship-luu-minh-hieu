import { useState } from 'react'
import { TodoList } from './TodoList'
import { Counter} from './Count'
import './App.css'

function App() {
  let [listWorks,addWork] = useState([])
  return (
    <>
    <Counter />
    <TodoList  listWorks = {listWorks} addWork = {addWork} />
    </>
  )
}

export default App
