import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Customers from './components/Customers';
import Invoices from './components/Invoices';
import Products from './components/Products';

class App extends Component {
  constructor () {
    super();
  }

  render() {
    return (
      <Router>
        <div>

          <nav className="navbar navbar-default navbar-static-top">
            <div className="container">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <Link to="/" className="navbar-brand">Invoice App</Link>
              </div>
              <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav navbar-nav">
                  <li><Link to="/products">Products</Link></li>
                  <li><Link to="/customers">Customers</Link></li>
                  <li><Link to="/">Invoices</Link></li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="container">
            <Route exact path="/" component={Invoices}/>
            <Route path="/products" component={Products}/>
            <Route path="/customers" component={Customers}/>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
