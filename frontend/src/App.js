import React, { Component } from 'react';
<<<<<<< HEAD
import { PageRouter } from './PageRouter';
import styles from './App.css';
=======
import { FormContainer } from './FormContainer';
import { LoadingAnimation } from './LoadingAnimation';
import './App.css';
import { GraphRenderer } from './GraphRenderer';
import samplegraph1 from './Components/sample_graph.json';
>>>>>>> frontend-graphrenderer-v1

const API = 'http://52.39.153.11:5002/findurl';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
<<<<<<< HEAD
        return (
          <div>
            <header> </header>
            <div className={styles.bodyTwo}>
              <PageRouter />
            </div>
            <footer> </footer>
          </div>
=======
    const { graphData, isLoading, hasLoaded, error } = this.state;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (isLoading) {
      return (
        <div>
          <LoadingAnimation />
        </div>
      );
    }

    // This will handle rendering the graph data
    // TODO: Work on transition back to the input page from the 
    // graph visualization
    if (hasLoaded){
      return (
        <div>
          {/*
          {graphData.map(gNode =>
            <div key={gNode.id}>
              <a href={gNode.url}>{gNode.url}</a>
            </div>
          )}
          */}
          {console.log(graphData)}
          <GraphRenderer graphData={graphData} />
        </div>
      );
    }    
>>>>>>> frontend-graphrenderer-v1

    );
  }
}


export default App;
