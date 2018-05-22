import React, { Component } from 'react';
import { SearchTypeInput } from './SearchTypeInput';
import { TextInput, NumberListInput } from './WebsiteInput';
import PropTypes from 'prop-types';
import cookie from 'react-cookies'
import styles from './css/Form.css';

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
    this.handleChangeText = this.handleChangeText.bind(this);
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

  handleChangeText(name, value){
    this.setState({
      [name]: value 
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
      <div className={styles.container}>
        <div className={styles.frame}>
          <div className={styles.nav}>
            <ul className={styles.links}>
              <li className={styles.signinActive}><a className={styles.btn}>Crawl Input</a></li>
            </ul>
          </div>
          <form onSubmit={this.handleSubmit} className={styles.formSignin}>
            <TextInput value={this.state.website} name="website" onChange={this.handleChangeText} 
              label="Website:" isActive={true} prevSearchTerms = {this.state.prevStartPages} 
              inputStyle={styles.formStyling}/>   
            <SearchTypeInput name="sType" onChange={this.handleChange}/>
            <NumberListInput name="sLimit" onChange={this.handleChange} label="Search Limit:"/> 
            <div>
              <input type="checkbox" id="checkbox" onChange={this.toggleAdvancedOptions} />
              <label htmlFor="checkbox" ><span className={styles.ui}></span>Advanced Options</label>
            </div>
            <TextInput value={this.state.searchTerm} name="searchTerm" onChange={this.handleChangeText} 
              label="Search Term:" isActive={this.state.advancedOn} 
              prevSearchTerms = {this.state.prevSearchTerms} inputStyle={styles.formStyling} />  
            <div className={styles.btnAnimate}>
              <input className={styles.btnSignin} type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

FormContainer.propTypes = {
  onQueryAPI: PropTypes.func.isRequired
};