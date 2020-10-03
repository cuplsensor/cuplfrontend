import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import {ConsumerBasePage} from "./ConsumerPage";
import {AdminLogin, AdminListCaptures, AdminListWebhooks} from "./AdminPage";
import AdminListTags from "./AdminListTagsPage";
import './App.css';




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
          <Route exact path="/admin/tags">
            <AdminListTags />
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
