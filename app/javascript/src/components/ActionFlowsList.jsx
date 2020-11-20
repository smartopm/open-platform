import React from 'react'
import PropTypes from 'prop-types'
import ActionCard from './ActionCard'

export default function ActionFlowsList({ openFlowModal, data }) {
  return (
    <div className="row justify-content-center">
      <div className="col-4-lg col-12-sm">
        <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
          {data.actionFlows.map(actionFlow => (
            <ActionCard
              key={actionFlow.id}
              actionFlow={actionFlow}
              openFlowModal={openFlowModal}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

ActionFlowsList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  openFlowModal: PropTypes.func.isRequired
}
