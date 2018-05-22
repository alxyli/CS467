import React, { Component } from 'react';
import { PageRouter } from './PageRouter';
import styles from './css/App.css';

export class App extends Component {
  
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
