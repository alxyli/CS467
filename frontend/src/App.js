import React, { Component } from 'react';
import { FormContainer } from './FormContainer';
import { LoadingAnimation } from './LoadingAnimation';
import './App.css';

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

  handleAPIRequest(dataIn) {
    this.setState({ isLoading: true, hasLoaded: false });
    console.log(dataIn);
    console.log(JSON.stringify(dataIn))
    fetch(API, {
      body: JSON.stringify({
        url: "https://www.google.com/",
        depth: 1
      }),
      method: 'POST'
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

    if (hasLoaded){
      return (
        <div>
          {graphData.map(gNode =>
            <div key={gNode.id}>
              <a href={gNode.url}>{gNode.url}</a>
            </div>
          )}
        </div>
      );
    }    

    return (
      <div>
        <LoadingAnimation />
      </div>

    );

    /*return (
      <div>
        <FormContainer onQueryAPI={this.handleAPIRequest} />
      </div>
    );*/
  }
}


export default App;
