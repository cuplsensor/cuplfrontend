import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";
import {ConsumerBasePage} from "./ConsumerPage";
import {AdminLogin, AdminListCaptures, AdminListWebhooks} from "./AdminPage";
import AdminListTags from "./AdminListTagsPage";
import AdminTag from "./AdminTagPage";
import './App.css';
import SimulatePage from "./SimulatePage";




function App() {
  return (
   <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/admin/login">
            <AdminLogin />
          </Route>
          <Route exact path="/admin">
            <Redirect to={`/admin/tags`} />
          </Route>
          <Route exact path="/admin/tags">
            <AdminListTags />
          </Route>
          <Route exact path="/admin/tag/:id" render={props => (
              <Redirect to={`/admin/tag/${props.match.params.id}/simulate`} />
          )} />
          <Route exact path="/admin/tag/:id/simulate">
            <SimulatePage />
          </Route>
          <Route exact path="/admin/captures">
              <AdminListCaptures />
          </Route>
          <Route exact path="/admin/webhooks">
              <AdminListWebhooks />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <ConsumerBasePage>a</ConsumerBasePage>;
}

function NoMatch() {
  let location = useLocation();
  return (
    <ConsumerBasePage>
        <h3>
          Error 404: No match for <code>{location.pathname}</code>
        </h3>
    </ConsumerBasePage>
  );
}


export default App;
