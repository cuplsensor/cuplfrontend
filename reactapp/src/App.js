import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";
import {ConsumerBasePage} from "./ConsumerPage";
import {AdminLogin} from "./AdminPage";
import AdminTagsList from "./AdminTagsListPage";
import AdminCapturesListPage from "./AdminCapturesListPage";
import AdminWebhooksListPage from "./AdminWebhooksListPage";
import AdminEditPage from "./AdminEditPage";
import AdminWebhookPage from "./AdminWebhookPage";
import AdminTagCapturesPage from "./AdminTagCapturesPage";
import './App.css';
import AdminSimulatePage from "./AdminSimulatePage";
import HomePage from "./HomePage";
import ConsumerTagPage from "./ConsumerTagPage";
import ConsumerWebhookPage from "./ConsumerWebhookPage";
import ConsumerCapturesPage from "./ConsumerCapturesPage";
import ConsumerRandomTagPage from "./ConsumerRandomTagPage";
import ConsumerCapturePage from "./ConsumerCapturePage";
import ConsumerCalendarPage from "./ConsumerCalendarPage";
import {DateTime} from "luxon";


function App() {
  return (
   <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/random">
            <ConsumerRandomTagPage />
          </Route>
          <Route exact path="/tag/:serial/" render={props =>
            <ConsumerTagPage serial={props.match.params.serial}/>
          } />
          <Route exact path="/tag/:serial/webhook" render={props =>
            <ConsumerWebhookPage serial={props.match.params.serial}/>
          } />
          <Route exact path="/tag/:serial/captures" render={props =>
            <ConsumerCapturesPage serial={props.match.params.serial}/>
          } />
          <Route exact path="/tag/:serial/captures/:id" render={props =>
            <ConsumerCapturePage serial={props.match.params.serial} id={props.match.params.id}/>
          } />
          <Route exact path="/tag/:serial/calendar/:range/:timestamp" render={props =>
            <CalendarRedirect serial={props.match.params.serial}
                              range={props.match.params.range}
                              timestamp={props.match.params.timestamp} />
          } />
          <Route exact path="/tag/:serial/calendar/:range/:year/:month/:day" render={props =>
            <ConsumerCalendarPage serial={props.match.params.serial}
                                  range={props.match.params.range}
                                  year={props.match.params.year}
                                  month={props.match.params.month}
                                  day={props.match.params.day}
            />
          } />
          <Route exact path="/admin/login">
            <AdminLogin />
          </Route>
          <Route exact path="/admin">
            <Redirect to={`/admin/tags`} />
          </Route>
          <Route exact path="/admin/tags">
            <AdminTagsList />
          </Route>
          <Route exact path="/admin/tag/:id" render={props => (
              <Redirect to={`/admin/tag/${props.match.params.id}/simulate`} />
          )} />
          <Route exact path="/admin/tag/:id/edit">
            <AdminEditPage />
          </Route>
          <Route exact path="/admin/tag/:id/captures">
            <AdminTagCapturesPage />
          </Route>
          <Route exact path="/admin/tag/:id/simulate">
            <AdminSimulatePage />
          </Route>
          <Route exact path="/admin/tag/:id/webhook">
            <AdminWebhookPage />
          </Route>
          <Route exact path="/admin/captures">
              <AdminCapturesListPage />
          </Route>
          <Route exact path="/admin/webhooks">
              <AdminWebhooksListPage />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

// Redirect from timestamp.
function CalendarRedirect(props) {
  // Convert UTC timestamp to a local datetime
  const dtlocal = DateTime.fromISO(props.timestamp, {zone:'utc'}).toLocal();
  // Extract year month and day.
  const year = dtlocal.year;
  const month = dtlocal.month;
  const day = dtlocal.day;
  return (
    <Redirect to={`/tag/${props.serial}/calendar/${props.range}/${year}/${month}/${day}`} />
  );
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
