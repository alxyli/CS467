import React, { Component } from 'react';
import { FormContainer } from './FormContainer';

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
  
  render() {

    return (
      <div>
        <FormContainer />
      </div>
    );
  }
}


export default App;
