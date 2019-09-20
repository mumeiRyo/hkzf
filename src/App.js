import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import Home from './pages/Home'
import Map from './pages/Map'
import CityList from './pages/CityList'

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/map" component={Map}></Route>
        <Route path="/citylist" component={CityList}></Route>
      </div>
    </Router>
  )
}

export default App;