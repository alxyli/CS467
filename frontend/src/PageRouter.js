import React, { Component } from 'react';
import { LoadingAnimation } from './LoadingAnimation';
import { GraphRenderer } from './GraphRenderer.js';
import { InputPage } from './Input_Page';
import Transition from 'react-transition-group/Transition';

const API = 'http://52.39.153.11:5006/findurl';
const localAPI = 'http://127.0.0.1:5006/findurl'

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

const loadingDuration = 1000;

const defaultStyleLoading = {
  transition: `opacity ${loadingDuration}ms ease-in-out`,
  opacity: 0,
}


const transitionStyles = {
  entering: { opacity: 0 },
  entered:  { opacity: 1 },
  exiting: { opacity: 0 },
};

export class PageRouter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queryData: {},
      graphData: [],
      isLoading: false,
      hasLoaded: false,
      error: null,
      showInput: false,
      showLoading: false,
      showResults: false
    };
    
    this.handleAPIRequest = this.handleAPIRequest.bind(this);
    this.backToInput = this.backToInput.bind(this);
  }

  backToInput() {
    this.setState({ isLoading: false, hasLoaded: false, showInput: true });
  }

  forwardToResults = () => {
    console.log("Forward to results");
    //this.setState({ showResults: true });
  }

  componentDidMount(){
    this.setState({ showInput: true });
  }

  inputTransitionExit = () => {
    if(this.state.showResults)
    {
      this.setState({ hasLoaded: true });
    }
    else
    {
      this.handleAPIRequest(this.state.queryData);
    }
  }

  loadingTransitionExit = () => {
    this.setState({ isLoading: false, hasLoaded: true });
  }

  loadGraphResults = (dataIn) => {
    this.setState({ queryData: dataIn, showInput: false });
  }

  goToResults = () => {
    this.setState({ hasLoaded: true });
  }

  testFunc = () => {
    console.log("test123");
  }

  // Takes care of talking with the server
  handleAPIRequest(dataIn) {
    this.setState({ isLoading: true, hasLoaded: false, showLoading: true });
        // Create the formdata Body
    fetch(/*API*/
      localAPI, {
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
      .then(data => this.setState({ graphData: data, showLoading: false }))
      .catch(error => this.setState({ error: error, isLoading: false, showLoading: false }))
  }
  
  render() {
    const graphData = this.state.graphData;
    
    if (this.state.error) {
      return <p>{this.state.error.message}</p>;
    }

    if (this.state.isLoading) {
      return (
        <Transition in={this.state.showLoading} timeout={loadingDuration} unmountOnExit appear
        onExited={this.loadingTransitionExit}>
        {(status) => (
          <div style={{
            ...defaultStyleLoading,
            ...transitionStyles[status]
          }}>
            <LoadingAnimation />
          </div>
        )}
        </Transition>
      );
    }

    // This will handle rendering the graph data
    // TODO: Work on transition back to the input page from the 
    // graph visualization
    if (this.state.hasLoaded){
      return (
        <div>
          {console.log(graphData)}
          <GraphRenderer graphData={graphData} backHandler={this.backToInput}/>
        </div>
      );
    }    

    return (
      <Transition in={this.state.showInput} timeout={duration} unmountOnExit appear
      onExited={() => this.inputTransitionExit()}>
        {(status) => (
          <div style={{
            ...defaultStyle,
            ...transitionStyles[status]
          }}>
            <InputPage onQueryAPI={this.loadGraphResults} toResults={this.goToResults} graphData={graphData}/>
          </div>
        )}
      </Transition>
    );
  }
}
