import React, { Component } from 'react';
import { LoadingAnimation } from './LoadingAnimation';
import { GraphRenderer } from './GraphRenderer.js';
import { InputPage } from './Input_Page';
import Transition from 'react-transition-group/Transition';

const API = 'http://52.39.153.11:5002/findurl';

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
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
    this.forwardToResults = this.forwardToResults.bind(this);
  }

  backToInput() {
    this.setState({ isLoading: false, hasLoaded: false, showInput: true });
  }

  forwardToResults() {
    this.setState({ showResults: true });
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

  // Takes care of talking with the server
  handleAPIRequest(dataIn) {
    this.setState({ isLoading: true, hasLoaded: false, showLoading: true });
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
        <Transition in={this.state.showLoading} timeout={duration} unmountOnExit appear
        onExited={this.loadingTransitionExit}>
        {(status) => (
          <div style={{
            ...defaultStyle,
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
          <button onClick={this.backToInput} type="button" >Back</button>
          <GraphRenderer graphData={graphData} />
        </div>
      );
    }    

    return (
      <Transition in={this.state.showInput} timeout={duration} unmountOnExit appear
      onEntering={() => console.log('entering')}
      onEntered={() => console.log('entered')}
      onExiting={() => console.log('exiting')}
      onExited={() => this.inputTransitionExit()}>
        {(status) => (
          <div style={{
            ...defaultStyle,
            ...transitionStyles[status]
          }}>
            <InputPage onQueryAPI={this.loadGraphResults} />
            {!isEmpty(graphData) &&
            <button onClick={this.forwardToResults} type="button" >Results</button>}
          </div>
        )}
      </Transition>
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
