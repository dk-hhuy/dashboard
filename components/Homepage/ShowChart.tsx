import React from 'react'

const ShowChart = () => (
  <div className="is-flex is-gap-2 ml-auto is-size-7">
    <button className="button is-small is-info is-size-7">
      <span className="icon is-small">
        <i className="material-icons is-size-7">bar_chart</i>
      </span>
      <span>Show Chart</span>
    </button>
    
    <button className="button is-small is-size-7">
      <span className="icon is-small">
        <i className="material-icons is-size-7">sync</i>
      </span>
      <span>Sync Tracking</span>
    </button>
    
    <button className="button is-small is-size-7">
      <span className="icon is-small">
        <i className="material-icons is-size-7">keyboard_arrow_down</i>
      </span>
      <span>Action</span>
    </button>
  </div>
)

export default ShowChart 