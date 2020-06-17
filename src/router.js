import React from 'react'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import NotFound from './components/pages/NotFound'
import Login from './components/pages/Login'
import Update from './components/pages/Update'
import ReportDamage from './components/pages/ReportDamage'
import FundTransfer from './components/pages/FundTransfer'
import Purchase from './components/pages/Purchase'
import Soldout from './components/pages/Soldout'
import Putaway from './components/pages/Putaway'
import Declaration from './components/pages/Declaration'
import PriceAdjustment from './components/pages/PriceAdjustment'
import App from './App'
import Cannibalizing from './components/pages/vice'
export default () => (
    <Router>
        <Switch>
            <Route path="/priceadjustment" component={PriceAdjustment} />     
            <Route exact path="/" render={() => <Redirect to="/app/dashboard" push />} />
            <Route path="/reportdamage" component={ReportDamage} />
            <Route path="/fundTransfer" component={FundTransfer} />
            <Route path="/soldout" component={Soldout} />
            <Route path="/putaway" component={Putaway} />
            <Route path="/purchase" component={Purchase} />
            <Route path="/declaration" component={Declaration} />
            <Route path="/app" component={App} />
            <Route path="/404" component={NotFound} />
            <Route path="/login" component={Login} />
            <Route path="/update" component={Update} />
            <Route path="/cannibalizing" component={Cannibalizing} />
            <Route component={NotFound} />
        </Switch>
    </Router>
)