import React from 'react'
import classes from './QuizCreator.module.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Select from '../../components/UI/Select/Select'
import {createControl, validate, validateForm} from '../../form/formFramework'
import Auxilary from '../../hoc/Auxilary/Auxilary'
import axios from '../../axios/axios-quiz'

function createOptionControl (number) {
  return createControl({
    label: `Option ${number}`,
    errorMessage: 'Option must not be empty',
    id: number
  }, {required: true})
}

function createFormControls () {
  return {
    question: createControl({
      label: 'Enter the question',
      errorMessage: 'Question must not be empty'
    }, {required: true}),
    option1: createOptionControl(1),
    option2: createOptionControl(2),
    option3: createOptionControl(3),
    option4: createOptionControl(4)
  }
}

export default class QuizCreator extends React.Component {

  state = {
    quiz: [],
    rightAnswerId: 1,
    isFormValid: false,
    formControls: createFormControls()
  }

  submitHandler = event => {
    event.preventDefault()
  }

  addQuestionHandler = event => {
    event.preventDefault()

    const quiz = this.state.quiz.concat()
    const index = quiz.length + 1

    const {question, option1, option2, option3, option4} = this.state.formControls

    const questionItem = {
      id: index,
      question: question.value,
      rightAnswerId: this.state.rightAnswerId,
      answers: [
        {text: option1.value, id: option1.id},
        {text: option2.value, id: option2.id},
        {text: option3.value, id: option3.id},
        {text: option4.value, id: option4.id}
      ]
    }

    quiz.push(questionItem)

    this.setState({
      quiz,
      rightAnswerId: 1,
      isFormValid: false,
      formControls: createFormControls()
    })
  }

  createQuizHandler = async event => {
    event.preventDefault()

    try {
      await axios.post('quizes.json', this.state.quiz)

      this.setState({
        quiz: [],
        rightAnswerId: 1,
        isFormValid: false,
        formControls: createFormControls()
      })
    } catch(e) {
      console.log(e)
    }

    // axios.post('https://react-quiz-aa4ff.firebaseio.com/quizes.json', this.state.quiz)
    //   .then(response => {
    //     console.log(response)
    //   })
    //   .catch(error => console.log(error))
  }

  inputChangeHandler = (value, controlName) => {
    const formControls = {...this.state.formControls}
    const control = {...formControls[controlName]}

    control.touched = true
    control.value = value
    control.valid = validate(control.value, control.validation)

    formControls[controlName] = control

    this.setState({
      formControls,
      isFormValid: validateForm(formControls)
    })
  }

  renderControls () {
    return Object.keys(this.state.formControls).map((controlName, index) => {
      const control = this.state.formControls[controlName]

      return (
        <Auxilary key={controlName + index}>
          <Input
            value={control.value}
            label={control.label}
            errorMessage={control.errorMessage}
            valid={control.valid}
            touched={control.touched}
            shouldValidate={!!control.validation}
            onChange={event => this.inputChangeHandler(event.target.value, controlName)}
          />
          { index === 0 ? <hr /> : null }
        </Auxilary>
      )
    })
  }

  selectChangeHandler = event => {
    this.setState({
      rightAnswerId: +event.target.value
    })
  }

  render() {

    const select = <Select 
      label="Choose right answer"
      value={this.state.rightAnswerId}
      onChange={this.selectChangeHandler}
      options={[
        {text: 1, value: 1},
        {text: 2, value: 2},
        {text: 3, value: 3},
        {text: 4, value: 4}
      ]}
    />

    return (
      <div className={classes.QuizCreator}>
        <div>
          <h1>Create Quiz</h1>

          <form onSubmit={this.submitHandler}>

            { this.renderControls() }

            { select }

            <Button
              type="primary"
              onClick={this.addQuestionHandler}
              disabled={!this.state.isFormValid}
            >
              Add Question
            </Button>

            <Button
              type="success"
              onClick={this.createQuizHandler}
              disabled={this.state.quiz.length === 0}
            >
              Create Quiz
            </Button>
          </form>
          
        </div>
      </div>
    )
  }
}