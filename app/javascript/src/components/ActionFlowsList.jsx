import React from 'react'
import PropTypes from 'prop-types'
import ActionCard from './ActionCard'

export default function ActionFlowsList({ openFlowModal, data, refetch }) {
  return (
    <div className="row justify-content-center">
      <div className="col-4-lg col-12-sm">
        <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
          {data.actionFlows.map(actionFlow => (
            <ActionCard
              key={actionFlow.id}
              actionFlow={actionFlow}
              openFlowModal={openFlowModal}
              refetch={refetch}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

ActionFlowsList.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  openFlowModal: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired
}
