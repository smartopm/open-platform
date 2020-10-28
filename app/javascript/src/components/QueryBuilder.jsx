/* eslint-disable */
import React from 'react'
import {
  Query,
  Builder,
  Utils as QbUtils
} from 'react-awesome-query-builder'
import MaterialConfig from 'react-awesome-query-builder/lib/config/material'
import 'react-awesome-query-builder/lib/css/styles.css'
import 'react-awesome-query-builder/lib/css/compact_styles.css'

const InitialConfig = MaterialConfig

const config = {
  ...InitialConfig,
  fields: {
    role: {
      label: 'Role',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: [
          { value: 'admin', title: 'Admin' },
          { value: 'client', title: 'Client' },
          { value: 'contractor', title: 'Contractor' },
          { value: 'custodian', title: 'Custodian' },
          { value: 'prospective_client', title: 'Prospective Client' },
          { value: 'resident', title: 'Resident' },
          { value: 'security_guard', title: 'Security Guard' },
          { value: 'visitor', title: 'Visitor' }
        ]
      }
    },
    label: {
      label: 'Label',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: [
          { value: 'com_news_sms', title: 'com_news_sms' },
          { value: 'com_news_email', title: 'com_news_email' }
        ]
      }
    },
    phoneNumber: {
      label: 'Phone Number',
      type: 'text',
      valueSources: ['value']
    },
    loginAfter: {
      label: 'Login After',
      type: 'datetime',
      valueSources: ['value']
    }
  },
  settings: {
    ...InitialConfig.settings,
    addRuleLabel: "Add filter",
    showNot: false,
    groupActionsPosition: 'bottomLeft',
    canReorder: false,
  },
  operators: {
    select_equals: {
      ...InitialConfig.operators.select_equals,
      label: 'Is',
    },
    select_not_equals: {
      ...InitialConfig.operators.select_not_equals,
      label: 'Is Not',
    },
  }
}

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const emptyInitValue = { id: QbUtils.uuid(), type: 'group' }
const queryValue = {
  id: QbUtils.uuid(),
  type: 'group',
  children1: {
    '98a8a9ba-0123-4456-b89a-b16e721c8cd0': {
      type: 'rule',
      properties: {
        field: 'role',
        operator: 'select_equals',
        value: [''],
        valueSrc: ['value'],
        valueType: ['select']
      }
    }
  },
}
const initValue =
  queryValue && Object.keys(queryValue).length > 0 ? queryValue : emptyInitValue
// const initTree: ImmutableTree = checkTree(loadTree(initValue), loadedConfig);
// export default function QueryBuilder() {
export default class QueryBuilder extends React.Component {
  state = {
    tree: QbUtils.checkTree(QbUtils.loadTree(initValue), config),
    config: config
  }

  render = () => (
    <div>
      <Query
        {...config}
        value={this.state.tree}
        onChange={this.onChange}
        renderBuilder={this.renderBuilder}
      />
      {this.renderResult(this.state)}
    </div>
  )

  renderBuilder = props => {
    console.log('huuuu', props)
    return <div className="query-builder-container" style={{ padding: '10px' }}>
      <div className="query-builder qb-lite">
        <Builder {...props} />
      </div>
    </div>
  }

  renderResult = ({ tree: immutableTree, config }) => (
    <div className="query-builder-result">
      {/* <div>
        Query string:{' '}
        <pre>{JSON.stringify(QbUtils.queryString(immutableTree, config))}</pre>
      </div>
      <div>
        MongoDb query:{' '}
        <pre>
          {JSON.stringify(QbUtils.mongodbFormat(immutableTree, config))}
        </pre>
      </div>
      <div>
        SQL where:{' '}
        <pre>{JSON.stringify(QbUtils.sqlFormat(immutableTree, config))}</pre>
      </div> */}
      {/* <div>
        JsonLogic:{' '}
        <pre>
          {JSON.stringify(QbUtils.jsonLogicFormat(immutableTree, config))}
        </pre>
      </div> */}
    </div>
  )

  onChange = (immutableTree, config) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    this.setState({ tree: immutableTree, config: config })

    // const jsonTree = QbUtils.getTree(immutableTree)

    // console.log('trree', jsonTree)
    console.log('format', QbUtils.jsonLogicFormat(immutableTree, config))
    console.log('mongo', QbUtils.mongodbFormat(immutableTree, config))
    const selectedOptions = QbUtils.jsonLogicFormat(immutableTree, config)
    const filterOptions = {
      role: 'user_type',
      label: 'labels',
      phoneNumber: 'phone_number'
    }

    if (selectedOptions) {
      const andConjugate = selectedOptions.logic?.and
      const orConjugate = selectedOptions.logic?.or
      const availableConjugate = andConjugate || orConjugate
      if (availableConjugate) {
        const conjugate = andConjugate ? "AND" : "OR"
        const query = availableConjugate.map((option) => {
          return `${filterOptions[option["=="][0].var]} = "${option["=="][1]}"`
        }).join(` ${conjugate} `)
        console.log('q', query)
        this.props.handleOnChange(query)
      }
    }
    //   const query = Object.keys(selectedOptions)
    //     .map(query => {
    //       return `${filterOptions[query]} = "${selectedOptions[query]}"`
    //     })
    //     .join(' OR ')
    //   this.props.handleOnChange(query)
    // }
    // `jsonTree` can be saved to backend, and later loaded to `queryValue`
  }
}
