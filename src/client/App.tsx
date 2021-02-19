import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LocationsSearch from './location/LocationsSearch';
import './App.css';

const App: React.FC = () => (
    <div className="App">
        <Router>
            <Switch>
                <Route path="/">
                    <LocationsSearch />
                </Route>
            </Switch>
        </Router>
    </div>
);

export default App;