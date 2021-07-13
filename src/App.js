import './App.css';
import MovieList from "./components/MovieList";
import MovieDetail from "./components/MovieDetail";

import { BrowserRouter, Switch, Route } from 'react-router-dom';



function App() {
  return (
    <div className="App">
      <header className="App-header">
          <BrowserRouter>
              <Switch>
                  <Route exact path='/' component={MovieList} />
                  <Route exact path='/movie/:movieId' component={MovieDetail} />
              </Switch>
          </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
