import React, { useContext, useState } from 'react'
import { Query, Builder, Utils as QbUtils } from 'react-awesome-query-builder'
import PropTypes from 'prop-types'
import { theme } from '../themes/nkwashi/theme'
import { Context } from '../containers/Provider/AuthStateProvider'

export default function QueryBuilder({
  builderConfig,
  initialQueryValue,
  handleOnChange,
  addRuleLabel
}) {
  const authState = useContext(Context)
  const config = {
    ...builderConfig,
    settings: {
      ...builderConfig.settings,
      addRuleLabel,
      showNot: false,
      groupActionsPosition: 'bottomLeft',
      canReorder: false,
      theme: {
        mui: theme(authState.user?.community?.themeColors)
      }
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
      },
      between: {
        ...builderConfig.operators.between,
        label: 'Between'
      },
      less: {
        ...builderConfig.operators.less,
        label: 'Less Than'
      },
      greater: {
        ...builderConfig.operators.greater,
        label: 'Greater Than'
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
      <div className="query-builder-container">
        <div className="query-builder qb-lite" style={{ margin: '0' }}>
          <Builder {...props} />
        </div>
      </div>
    )
  }

  function onChange(immutableTree, queryConfig) {
    setTreeConfig({ tree: immutableTree, config: queryConfig })
    const selectedOptions = QbUtils.jsonLogicFormat(immutableTree, config)
    handleOnChange(selectedOptions, immutableTree)
  }

  return (
    <div style={{ outline: 'none' }} data-testid="query-builder">
      <Query
        {...config}
        value={treeConfig.tree}
        onChange={onChange}
        renderBuilder={renderBuilder}
      />
    </div>
  )
}

QueryBuilder.defaultProps = {
  initialQueryValue: null
}

QueryBuilder.propTypes = {
  builderConfig: PropTypes.object.isRequired,
  initialQueryValue: PropTypes.object,
  handleOnChange: PropTypes.func.isRequired,
  addRuleLabel: PropTypes.string.isRequired
}
