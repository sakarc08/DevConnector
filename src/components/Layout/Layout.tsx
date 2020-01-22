import React, { Dispatch } from 'react';
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux';
import { IAction, IState } from '../../@types/initialTypes';
import { IActionDecrementCreator, IActionIncrementCreator } from '../../actions/layoutAction'

interface Props {
    counter: number,
    onIncrement?: () => void,
    onDecrement?: () => void
}


class Layout extends React.Component<Props> {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Button color="secondary" variant="contained" onClick={ this.props.onIncrement}> Increment the counter</Button>
                    <span>
                        { this.props.counter}
                    </span>
                    <Button color="primary" variant="contained" onClick={ this.props.onDecrement}> Decrement the counter</Button>
                </header>
            </div>
        )
    }
}

const mapStateToProps = (state: IState) => {
    return {
        counter: state.counter
    }
}

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => {
    return {
        onIncrement: () => dispatch(IActionIncrementCreator()),
        onDecrement: () => dispatch(IActionDecrementCreator())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Layout);