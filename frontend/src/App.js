import React, { Component } from 'react';
import { PageRouter } from './PageRouter';
import styles from './App.css';

class App extends Component {
  
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
