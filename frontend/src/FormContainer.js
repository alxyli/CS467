import React, { Component } from 'react';
import { SearchTypeInput } from './SearchTypeInput';
import { TextInput, NumberListInput } from './WebsiteInput';
import PropTypes from 'prop-types';
import { instanceOf } from 'prop-types';
import cookie from 'react-cookies'

export class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      website: '',
      sType: 'dfs',
      sLimit: '',
      searchTerm: '',
      advancedOn: false,
      isLoading: false,
      prevStartPages: [],
      prevSearchTerms: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleAdvancedOptions = this.toggleAdvancedOptions.bind(this);
    this.verifyInput = this.verifyInput.bind(this);
    this.createQueryData = this.createQueryData.bind(this);
    this.addToCookie = this.addToCookie.bind(this);
  }

  componentWillMount() {
    var psp = cookie.load('prevSearchInformation') || '';
    console.log("psp = " + psp);
    if(psp !== '' && psp !== null)
    {
      var pspJson = JSON.parse(JSON.parse(psp));
      console.log(pspJson.searchTerms);
      this.setState({ 
        prevSearchTerms: pspJson.searchTerms,
        prevStartPages: pspJson.searchPages
        });
    }
  }

  

  toggleAdvancedOptions(){
    this.setState({ 
      advancedOn: !this.state.advancedOn
    });
    if(!this.state.advancedOn){
      this.setState({ searchTerm: '' });
    }
  }

  handleChange(e) {
    this.setState({
       [e.target.name]: e.target.value 
      });
  }

  verifyInput(){
    if(this.state.website !== '' && this.state.sType !== '' && this.state.sLimit !== ''){
      if(this.state.advanceOn && this.state.searchTerm !== ''){
        return true;
      }
      return true;
    }
    return false;
  }

  createQueryData(){
    return {
      url: this.state.website,
      depth: this.state.sLimit,
      dfs: this.state.sType
    }
  }

  // When submitting a new search, save the search term on the
  addToCookie(){
    // Check if the page is already in the object
    const psp = this.state.prevStartPages;
    if(!psp.includes(this.state.website)){
      psp.push(this.state.website);
      psp.sort();
    }

    const pst = this.state.prevSearchTerms;
    if(!pst.includes(this.state.searchTerm)){
      pst.push(this.state.searchTerm);
      pst.sort();
    }

    const cookieAdd = { 'searchPages': psp,
                        'searchTerms': pst};
    cookie.remove('prevSearchInformation', { path: '/' })
    // For some reason you have to stringify the results twice to get it in the correct format
    cookie.save('prevSearchInformation', JSON.stringify(JSON.stringify(cookieAdd)), { path: '/' });


  }

  handleSubmit(e) {
    console.log(e);
    e.preventDefault();
    console.log(this.verifyInput())
    if(this.verifyInput()){
      this.addToCookie()
      this.props.onQueryAPI(this.createQueryData());
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextInput value={this.state.value} name="website" onChange={this.handleChange} 
          label="Website:" isActive={true} prevStartPages = {this.state.prevStartPages} 
          prevSearchTerms = {this.state.prevSearchTerms} />   
        <SearchTypeInput name="sType" onChange={this.handleChange}/>
        <NumberListInput name="sLimit" onChange={this.handleChange} label="Search Limit:"/>
        <TextInput value={this.state.value} name="searchTerm" onChange={this.handleChange} 
          label="Search Term:" isActive={this.state.advancedOn} />   
        <div>
          <input type="checkbox" onChange={this.toggleAdvancedOptions}/>
          <label>Advanced Options</label>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    );
  }
}

FormContainer.propTypes = {
  onQueryAPI: PropTypes.func.isRequired
};