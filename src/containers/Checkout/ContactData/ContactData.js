import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'

const generateFormValue = ({elementType = 'input', elementConfig = {}, value = '', validation = null }) => {
  
  const formValues = {
    elementType,
    elementConfig,
    value,
  }

  if (!!validation) {
    formValues.validation = validation;
    formValues.valid = false;
    formValues.touched = false;
  } else {
    formValues.valid = true;
  }

  return formValues;
}

class ContactData extends Component {
  state = {
    orderForm: {
      name: generateFormValue({elementType: 'input', elementConfig: { type: 'text', placeholder: 'Your Name'}, validation: { required: true}}),
      street: generateFormValue({elementType: 'input', elementConfig: { type: 'text', placeholder: 'Street'}, validation: { required: true}}),
      zipCode: generateFormValue({elementType: 'input', elementConfig: { type: 'text', placeholder: 'ZipCode'}, validation: { required: true, minLength: 5, maxLength: 5}}),
      country: generateFormValue({elementType: 'input', elementConfig: { type: 'text', placeholder: 'Country'}, validation: { required: true}}),
      email: generateFormValue({elementType: 'input', elementConfig: { type: 'text', placeholder: 'Your Email'}, validation: { required: true}}),
      deliveryMethod: generateFormValue({elementType: 'select', 
        elementConfig: { options: 
          [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'cheapest', displayValue: 'Cheapest'},
          ]
        },
        value: 'fastest'
      }),
    },
    formIsValid: false,
    loading: false,
  }

  checkValidity(value, rules = {}) {
    let isValid = true;

    if (rules.required) isValid = value.trim() !== '' && isValid;
    if (rules.minLength) isValid = value.trim().length >= rules.minLength && isValid;
    if (rules.maxLength) isValid = value.trim().length <= rules.maxLength && isValid;
    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };

    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };

    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;
    for (const inputIdentifier in updatedOrderForm) {
      formIsValid =  updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    console.log('formisvalid: ', formIsValid);

    this.setState({orderForm: updatedOrderForm, formIsValid});
  }

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({loading: true});
    const formData = {};

    for (const formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      deliveryMethod: 'slowest',
      orderData: formData,
    }
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({loading: false});
        this.props.history.push('/');
      })
      .catch(error => {
        this.setState({loading: false});
      });
  }

  render () {
    const formElementsArray = [];
    for (const key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }


    let form = (<form onSubmit={this.orderHandler}>
      {formElementsArray.map(formEl => (
        <Input
          key={formEl.id}
          elementType={formEl.config.elementType} 
          elementConfig={formEl.config.elementConfig} 
          value={formEl.config.value}
          invalid={!formEl.config.valid}
          shouldValidate={formEl.config.validation}
          touched={formEl.config.touched}
          changed={(event) => this.inputChangedHandler(event, formEl.id)}
        />
      ))}
      <Button btnType="Success" disabled={!this.state.formIsValid} clicked={this.orderHandler}>ORDER</Button>
    </form>);
    if (this.state.loading) {
      form = <Spinner/>;
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    )
  }
}

export default ContactData;