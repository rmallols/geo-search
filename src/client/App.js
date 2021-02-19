import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <Search />
                </Route>
            </Switch>
        </Router>
    );
}

const Search = () => {
    const fetchData = async () => {
        const response = await fetch('/api/test');
        const data = await response.json();
        console.log('the data is', data);
    }

    useEffect(() => {
        fetchData();
    }, []);
    return <div>Hello search!!!</div>
}

export default App;
