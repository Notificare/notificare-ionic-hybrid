import React, { useEffect } from 'react';
import { Notificare } from '@ionic-native/notificare';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { AccountValidation } from './pages/account-validation';
import { Analytics } from './pages/analytics';
import { ChangePassword } from './pages/change-password';
import { ForgotPassword } from './pages/forgot-password';
import { Home } from './pages/home';
import { Inbox } from './pages/inbox';
import { MemberCard } from './pages/member-card';
import { Profile } from './pages/profile';
import { ResetPassword } from './pages/reset-password';
import { Settings } from './pages/settings';
import { SignIn } from './pages/sign-in';
import { SignUp } from './pages/sign-up';
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
          <Route exact path="/sign-up" component={SignUp} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/account-validation/:token" component={AccountValidation} />
          <Route exact path="/reset-password/:token" component={ResetPassword} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/member-card" component={MemberCard} />
          <Route exact path="/change-password" component={ChangePassword} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
