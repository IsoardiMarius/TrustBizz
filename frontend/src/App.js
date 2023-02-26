import logo from './logo.svg';
import './App.css';
import axiosInstanceAuthRequired from './axios.conf';


function App() {


    const  test = async () => {
        // get access token from cookies httponly
        axiosInstanceAuthRequired.post("/graphql",  {
            query: `
         query GetAllBooks {
    getAllBooks {
        author
        id
    }
} `,
        })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={test}>Click Me!</button>
      </header>
    </div>
  );
}

export default App;
