import axios from 'axios'

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 15000 // request timeout
})

export default service
