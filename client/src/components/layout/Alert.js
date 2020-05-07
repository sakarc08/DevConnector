import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Alert = ({ alerts}) => {
    return (
        <div>
            { alerts && alerts.length > 0 && alerts.map(alert => (
                <div key={alert.id} className={`alert alert-${alert.type}`}>
                    { alert.message }
                </div>
            ))}
        </div>
    )
}

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
    return { alerts: state.alerts }
}

export default connect(mapStateToProps, null)(Alert)