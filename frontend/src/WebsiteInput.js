import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from 'react-autocomplete';
import styles from './css/Form.css';

const wrapperStyle = {
  width: '100%'
};

export class TextInput extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      inputOptions: [],
      value: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setValue(e.target.value );
  }

  setValue = (e) => {
    this.setState({ value: e })
    this.props.onChange(this.props.name, e);
  }

  componentWillMount() {
    /// Create the options from the props
    var array1 = [];
    (this.props.prevSearchTerms).forEach(function(e) {
      array1.push({ id: e, label: e })
    });
    this.setState( { inputOptions: array1 });
  }

  render() {
    const Error = (this.props.error) ? styles.error : styles.noError;

    if(this.props.isActive){
      return (
        <div>
          <label>
          {this.props.label}
          </label>
          <Autocomplete
          getItemValue={(item) => item.label}
          items={this.state.inputOptions}
          renderItem={(item, isHighlighted) =>
            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
              {item.label}
            </div>
          }
          value={this.state.value}
          onChange={this.handleChange}
          onSelect={(val) => this.setValue(val)}
          renderInput={function(props) {
            return <input {...props} className={[styles.formStyling, Error].join(' ')}/>
          }}
          wrapperStyle={wrapperStyle}
          />
        </div>
      );
    } else{
      return(null);
    }

  }
}

TextInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  prevSearchTerms: PropTypes.array.isRequired,
  error: PropTypes.bool.isRequired
};

export class NumberListInput extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  
  getMaxValue = () => {
    return (this.props.type === 'dfs') ? 150 : 3
  }

  handleChange(e){
    console.log(e.target.value);
    const maximum = this.getMaxValue();
    if(e.target.value === '');
    else if(e.target.value > maximum) e.target.value = maximum;
    else if(e.target.value < 1) e.target.value = 1;
    this.props.onChange(e);
  }

  render() {
    const Error = (this.props.error) ? styles.error : styles.noError;
    const maximum = this.getMaxValue();
    const placeholder = "1 - " + maximum;
    return (
      <div>
        <label>
          {this.props.label}
        </label>
        <input type="number" min="1" max={maximum} name={this.props.name} onChange = {this.handleChange} 
          className={[styles.formStyling, Error].join(' ')} placeholder={placeholder}/>
      </div>
    );
  }
}



NumberListInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired
};