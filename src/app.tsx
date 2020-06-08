import React, { useEffect } from 'react';
import { Notificare } from '@ionic-native/notificare';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { Analytics } from './pages/analytics';
import { Home } from './pages/home';
import { Inbox } from './pages/inbox';
import { Settings } from './pages/settings';
import { SignIn } from './pages/sign-in';
import { Storage } from './pages/storage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.scss';

const App: React.FC = () => {
  // Launch Notificare
  useEffect(() => Notificare.launch(), []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/inbox" component={Inbox} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/analytics" component={Analytics} />
          <Route exact path="/storage" component={Storage} />
          <Route exact path="/sign-in" component={SignIn} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
