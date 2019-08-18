
import React from 'react'
import ReactDOM from 'react-dom'
import Button from '../components/button'
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Button />,
    document.body.appendChild(document.createElement('div')),
  )
})
