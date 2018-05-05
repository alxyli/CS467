import React, { Component } from 'react';
import { FormContainer } from './FormContainer';

import './App.css';

const API = 'http://52.39.153.11:5002/findurl';
//const DEFAULT_QUERY = '';

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
    fetch(API, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: dataIn
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
      return <p>Loading ...</p>;
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
        <FormContainer onQueryAPI={this.handleAPIRequest} />
      </div>
    );
  }
}


export default App;
