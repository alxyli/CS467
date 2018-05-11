import React, { Component } from 'react';
import { FormContainer } from './FormContainer';
import { LoadingAnimation } from './LoadingAnimation';
import './App.css';
import { GraphRenderer } from './GraphRenderer';
import samplegraph1 from './Components/sample_graph.json';

const API = 'http://52.39.153.11:5000/findurl';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graphData: [],
      isLoading: false,
      hasLoaded: false,
      error: null,
    };
    
    this.handleAPIRequest = this.handleAPIRequest.bind(this);
  }

  // Takes care of talking with the server
  handleAPIRequest(dataIn) {
    this.setState({ isLoading: true, hasLoaded: false });
        // Create the formdata Body
    fetch(API, {
      method: 'POST', 
      mode: 'cors', 
      body: JSON.stringify(dataIn),
      headers: new Headers({
        'Content-Type': 'application/json'
        })
      })
      .then(response => {
        console.log(response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => this.setState({ graphData: data, isLoading: false, hasLoaded: true }))
      .catch(error => this.setState({ error, isLoading: false, hasLoaded: false }))
  }

  render() {
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

    return (
      <div>
        <FormContainer onQueryAPI={this.handleAPIRequest} />
      </div>
    );
  }
}


export default App;
