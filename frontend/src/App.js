import React, { Component } from 'react';
import { PageRouter } from './PageRouter';
import styles from './css/App.css';

export class App extends Component {
  
  render() {
        return (
          <div>
            <header >
              <div className={styles.appTitle}>Crawl With Me</div>
            </header>
            <div className={styles.bodyTwo}>
              <PageRouter />
            </div>
            <footer> 
              <div className={styles.appFooter}></div>
            </footer>
          </div>

    );
  }
}

export default App;
