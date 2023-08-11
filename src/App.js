import './App.css';
import Quiz from './components/Quiz';
import { quizQuestion } from './constant/questions';

function App() {
  return (
    <div className="App">
      <Quiz questions={quizQuestion.questions} />
    </div>
  );
}

export default App;
