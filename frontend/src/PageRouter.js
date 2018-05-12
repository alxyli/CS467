import React, { Component } from 'react';
import { LoadingAnimation } from './LoadingAnimation';
import { GraphRenderer } from './GraphRenderer.js';
import { InputPage } from './Input_Page';
import styles from './PageRouter.css';

const API = 'http://52.39.153.11:5000/findurl';

export class PageRouter extends Component {
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
          <GraphRenderer graphData={graphData} />
        </div>
      );
    }    

    return (
      <div>
        <InputPage onQueryAPI={this.handleAPIRequest} />
      </div>
    );
  }
}
