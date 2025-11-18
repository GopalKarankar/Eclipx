import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {persistor, store} from './redux/store';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => {
          try {
            console.log('PersistGate: rehydration complete. store state:', store.getState());
          } catch (err) {
            console.warn('PersistGate: unable to read store state', err);
          }
        }}
      >
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
