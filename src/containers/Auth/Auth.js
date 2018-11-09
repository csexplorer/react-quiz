import React from 'react'
import classes from './Auth.module.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import is from 'is_js'
import axios from 'axios'

export default class Auth extends React.Component {

  state = {
    isFormValid: false,
    formControls: {
      email: {
        value: '',
        label: 'Email',
        type: 'email',
        errorMessage: 'Enter right email address',
        valid: false,
        touched: false,
        validation: {
          required: true,
          email: true
        }
      },
      password: {
        value: '',
        label: 'Password',
        type: 'password',
        errorMessage: 'Enter right password',
        valid: false,
        touched: false,
        validation: {
          required: true,
          minLength: 6
        }
      }
    }
  }

  validateControl (value, validation) {
    if (!validation)
      return true

    let isValid = true

    if (validation.required) {
      isValid = value.trim() !== '' && isValid
    }

    if (validation.email) {
      isValid = is.email(value) && isValid
    }

    if (validation.minLength) {
      isValid = value.length >= validation.minLength && isValid
    }

    return isValid
  }

  inputChangeHandler = (event, controlName) => {
    
    const formControls = { ...this.state.formControls }
    const control = { ...formControls[controlName] }

    control.value = event.target.value
    control.touched = true
    control.valid = this.validateControl(control.value, control.validation)

    formControls[controlName] = control

    let isFormValid = true

    Object.keys(formControls).forEach(name => {
      isFormValid = formControls[name].valid && isFormValid
    })
    this.setState({
      formControls, isFormValid
    })
  }

  renderInputs() {
    return Object.keys(this.state.formControls).map((controlName, index) => {
      const control = this.state.formControls[controlName]
      return (
        <Input
          key={controlName + index}
          value={control.value}
          label={control.label}
          type={control.type}
          errorMessage={control.errorMessage}
          valid={control.valid}
          touched={control.touched}
          shouldValidate={!!control.validation}
          onChange={event => this.inputChangeHandler(event, controlName)}
        />
      )
    })
  }

  loginHandler = async () => {
    const newUser = {
      email: this.state.formControls.email.value,
      password: this.state.formControls.password.value,
      returnSecureToken: true
    }
    try {
      const response = await axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCb6oaSWnYZ_1d0BjzwTucA3kgWpI8a8GA', newUser)
      console.log(response.data)
    } catch(e) {
      console.log(e)
    }
  }
  registerHandler = async () => {
    const newUser = {
      email: this.state.formControls.email.value,
      password: this.state.formControls.password.value,
      returnSecureToken: true
    }
    try {
      const response = await axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCb6oaSWnYZ_1d0BjzwTucA3kgWpI8a8GA', newUser)
      console.log(response.data)
    } catch(e) {
      console.log(e)
    }
  }
  submitHandler = event => {
    event.preventDefault()
  }
  render() {
    return (
      <div className={classes.Auth}>
        <div>
          <h1>Auth</h1>
          <form
            className={classes.AuthForm}
            onSubmit={this.submitHandler}
          >

            { this.renderInputs() }

            <Button
              type="success"
              onClick={this.loginHandler}
              disabled={!this.state.isFormValid}
            >
              Login
            </Button>
            <Button
              type="success"
              onClick={this.registerHandler}
            >
              Register
            </Button>
          </form>
        </div>
      </div>
    )
  }
}