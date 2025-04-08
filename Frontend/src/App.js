import logo from './logo.svg';
import './App.css';
import ChatBot from './components/ChatbotWidget';
import DocumentViewerUI from './components/Dashboard';


function App() {
  return (
    <div className="App">
       <ChatBot/>
       <DocumentViewerUI/>
    </div>
  );
}

export default App;
