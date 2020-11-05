/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react'
import { Query, Builder, Utils as QbUtils } from 'react-awesome-query-builder'
import PropTypes from 'prop-types'
import { dateToString } from '../utils/dateutil'
import 'react-awesome-query-builder/lib/css/styles.css'
import 'react-awesome-query-builder/lib/css/compact_styles.css'

export default function QueryBuilder({
  builderConfig,
  initialQueryValue,
  handleOnChange,
  filterFields
}) {
  const config = {
    ...builderConfig,
    settings: {
      ...builderConfig.settings,
      addRuleLabel: 'Add filter',
      showNot: false,
      groupActionsPosition: 'bottomLeft',
      canReorder: false
    },
    operators: {
      select_equals: {
        ...builderConfig.operators.select_equals,
        label: 'Is'
      },
      select_not_equals: {
        ...builderConfig.operators.select_not_equals,
        label: 'Is Not'
      },
      equal: {
        ...builderConfig.operators.equal,
        label: 'Is'
      },
      not_equal: {
        ...builderConfig.operators.not_equal,
        label: 'Is Not'
      }
    }
  }

  const initialValue =
    initialQueryValue && Object.keys(initialQueryValue).length > 0
      ? initialQueryValue
      : { id: QbUtils.uuid(), type: 'group' }

  const [treeConfig, setTreeConfig] = useState({
    tree: QbUtils.checkTree(QbUtils.loadTree(initialValue), config),
    config
  })

  function renderBuilder(props) {
    return (
      <div className="query-builder-container" style={{ padding: '10px' }}>
        <div className="query-builder qb-lite">
          <Builder {...props} />
        </div>
      </div>
    )
  }

  function onChange(immutableTree, queryConfig) {
    setTreeConfig({ tree: immutableTree, config: queryConfig })
    const selectedOptions = QbUtils.jsonLogicFormat(immutableTree, config)

    if (selectedOptions) {
      const andConjugate = selectedOptions.logic?.and
      const orConjugate = selectedOptions.logic?.or
      const availableConjugate = andConjugate || orConjugate
      if (availableConjugate) {
        const conjugate = andConjugate ? 'AND' : 'OR'
        const query = availableConjugate
          .map(option => {
            let operator = Object.keys(option)[0]
            const property = filterFields[option[operator][0].var]
            let value = option[operator][1]

            if (operator === '==') operator = '='
            if (property === 'date_filter') {
              operator = '>'
              value = dateToString(value)
            }

            return `${property} ${operator} "${value}"`
          })
          .join(` ${conjugate} `)
        handleOnChange(query, availableConjugate.length)
      }
    }
  }

  return (
    <div>
      <Query
        {...config}
        value={treeConfig.tree}
        onChange={onChange}
        renderBuilder={renderBuilder}
      />
    </div>
  )
}

QueryBuilder.propTypes = {
  builderConfig: PropTypes.object.isRequired,
  initialQueryValue: PropTypes.object.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  filterFields: PropTypes.object.isRequired
}
