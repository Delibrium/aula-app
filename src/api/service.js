import axios from 'axios'

/* eslint-disable no-undef */
const service = axios.create({
  baseURL: baseUrl,
  timeout: 15000 // request timeout
})

export default service
