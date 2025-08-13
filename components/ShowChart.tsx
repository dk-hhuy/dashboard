import React from 'react'

const ShowChart = () => (
  <div className="is-flex is-gap-2 ml-auto">
    <button className="button is-small is-info">
      <span className="icon is-small">
        <i className="material-icons">bar_chart</i>
      </span>
      <span>Show Chart</span>
    </button>
    
    <button className="button is-small is-outlined">
      <span className="icon is-small">
        <i className="material-icons">sync</i>
      </span>
      <span>Sync Tracking</span>
    </button>
    
    <button className="button is-small is-outlined">
      <span className="icon is-small">
        <i className="material-icons">keyboard_arrow_down</i>
      </span>
      <span>Action</span>
    </button>
  </div>
)

export default ShowChart