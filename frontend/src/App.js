import React, { Component } from 'react';
import { PageRouter } from './PageRouter';
import styles from './App.css';

const API = 'http://52.39.153.11:5000/findurl';

class App extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
        return (
          <div>
            <header> </header>
            <div className={styles.bodyTwo}>
              <PageRouter />
            </div>
            <footer> </footer>
          </div>

    );
  }
}


export default App;
