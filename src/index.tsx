/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from '@solidjs/router'
import FunctionsPage from './pages/FunctionsPage.tsx'
import AccountsPage from './pages/AccountsPage.tsx'
import { LogEventsRoute } from './pages/LogEventsPage.tsx'

const wrapper = document.getElementById("root") as HTMLElement
render(
    () => (
        <Router>
            <Route path="/" component={AccountsPage}></Route>
            <Route path="/functions" component={FunctionsPage}></Route>
            <Route path="/logs/:logGroupName" component={LogEventsRoute}></Route>
        </Router>
    ),
    wrapper
);
