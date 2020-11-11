import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'

const generateFormValue = (elementType = 'input', elementConfig = {}, value = '') => {
  return {
    elementType,
    elementConfig,
    value,
  }
}

class ContactData extends Component {
  state = {
    orderForm: {
      name: generateFormValue('input', { type: 'text', placeholder: 'Your Name'}),
      street: generateFormValue('input', { type: 'text', placeholder: 'Street'}),
      zipCode: generateFormValue('input', { type: 'text', placeholder: 'ZipCode'}),
      country: generateFormValue('input', { type: 'text', placeholder: 'Country'}),
      email: generateFormValue('input', { type: 'text', placeholder: 'Your Email'}),
      deliveryMethod: generateFormValue('select', 
        { options: 
          [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'cheapest', displayValue: 'Cheapest'},
          ]
        }
      ),
    },
    loading: false,
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };

    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };

    updatedFormElement.value = event.target.value;
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    this.setState({orderForm: updatedOrderForm});
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
          changed={(event) => this.inputChangedHandler(event, formEl.id)}
        />
      ))}
      <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
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