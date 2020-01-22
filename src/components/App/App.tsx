import React from 'react';
import './App.css';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { initialState, layoutReducer } from '../../reducers/layoutReducer'
import Layout from '../Layout/Layout';

const store = createStore(layoutReducer, initialState);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Layout></Layout>
    </Provider>
  );
}


export default App;
