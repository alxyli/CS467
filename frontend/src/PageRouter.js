import React, { Component } from 'react';
import { LoadingAnimation } from './LoadingAnimation';
import { GraphRenderer } from './GraphRenderer.js';
import { InputPage } from './Input_Page';
import styles from './css/PageRouter.css';

const API = 'http://52.39.153.11:5002/findurl';

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
    this.backToInput = this.backToInput.bind(this);
    this.forwardToResults = this.forwardToResults.bind(this);
  }

  backToInput() {
    this.setState({ isLoading: false, hasLoaded: false });
  }

  forwardToResults() {
    this.setState({ isLoading: false, hasLoaded: true });
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
          {console.log(graphData)}
          <button onClick={this.backToInput} type="button" >Back</button>
          <GraphRenderer graphData={graphData} />
        </div>
      );
    }    

    return (
      <div>
        <InputPage onQueryAPI={this.handleAPIRequest} />
        {!isEmpty(graphData) &&
        <button onClick={this.forwardToResults} type="button" >Results</button>
      }
      </div>
    );
  }
}

function isEmpty(obj) {
  // Speed up calls to hasOwnProperty
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
