import React from 'react'

const ShowChart = () => (
  <div className="is-flex is-gap-2" style={{ marginLeft: 'auto' }}>
    <button className="button is-small is-info">
      <span className="icon is-small">
        <i className="material-icons">bar_chart</i>
      </span>
      <span>Show Chart</span>
    </button>
    
    <button className="button is-small" style={{ backgroundColor: 'white', border: '1px solid #e1bee7', color: 'black' }}>
      <span className="icon is-small">
        <i className="material-icons">sync</i>
      </span>
      <span>Sync Tracking</span>
    </button>
    
    <button className="button is-small" style={{ backgroundColor: 'white', border: '1px solid #e1bee7', color: 'black' }}>
      <span className="icon is-small">
        <i className="material-icons">keyboard_arrow_down</i>
      </span>
      <span>Action</span>
    </button>
  </div>
)

export default ShowChart