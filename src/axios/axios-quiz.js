import axios from 'axios'

export default axios.create({
  baseURL: 'https://react-quiz-aa4ff.firebaseio.com/'
})