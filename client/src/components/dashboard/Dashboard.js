import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../../actions/profile'
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardActions'
import Experience from './Experience';
import Education from './Education';
import { deleteAccount } from '../../actions/profile'

const Dashboard = ({ auth: { user }, getCurrentProfile , profile: { profile, loading }, deleteAccount }) => {
    useEffect(() => {
        getCurrentProfile();
        console.log(getCurrentProfile)
    }, [getCurrentProfile])

    return loading && !profile ? <Spinner /> : (<Fragment>
        <h1 className="large text-primary">
            Dashboard
        </h1>
        <p className="lead">
            <i className="fas fa-user"></i> Welcome {user && user.name}
        </p>
        { profile ? <Fragment>
            <DashboardActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <div className="my-2">
                <button className="btn btn-danger" onClick={(e) => deleteAccount()}>
                    <i className="fas fa-user-minus"></i> Delete my account
                </button>
            </div>
        </Fragment> : <Fragment>
            <p>You have not yet setup a profile. Please update profile</p>
            <Link to='/create-profile' className='btn btn-primary my-1'>
                Create Profile
            </Link>
        </Fragment>}
    </Fragment>)
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        profile: state.profile
    }
}

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)
