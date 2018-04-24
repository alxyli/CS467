import React, { Component } from 'react';
import './App.css';

const API = 'http://localhost:5000/';
//const DEFAULT_QUERY = '';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graphData: [],
      isLoading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    fetch(API, {
        method: 'GET', 
        //mode: 'no-cors',
        headers: {
            "Accept": "application/json"
  }})
      .then(response => {
        console.log(response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => this.setState({ graphData: data.crawl_results, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }))
  }
  
  render() {
    const { graphData, isLoading, error } = this.state;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (isLoading) {
      return <p>Loading ...</p>;
    }

    return (
      <div>
        {graphData.map(gNode =>
          <div key={gNode.id}>
            <a href={gNode.url}>{gNode.title}</a>
          </div>
        )}
      </div>
    );
  }
}


export default App;
