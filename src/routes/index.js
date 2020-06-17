import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import CenterCustom from '../components/CenterCustom'
import CenterReportDamgeCustom from '../components/pages/ReportDamage/CenterCustom'
import CenterPurchaseCustom from '../components/pages/Purchase/CenterCustom'
import CenterPutawayCustom from '../components/pages/Putaway/CenterCustom'
import CenterFundTransferCustom from '../components/pages/FundTransfer/CenterCustom'
import CenterSoldoutCustom from '../components/pages/Soldout/CenterCustom'
import CenterDeclarationCustom from '../components/pages/Declaration/CenterCustom'
//Cannibalizing路径不一致 请观察
import Cannibalizing from '../components/pages/vice'

export default class CRouter extends Component {
    render() {
        return (
            <Switch>
                <Route path="/app/dashboard/:id" component={CenterCustom} />
                <Route path="/priceadjustment/:id" component={CenterCustom} />
                <Route path="/reportdamage/:id" component={CenterReportDamgeCustom} />
                <Route path="/fundTransfer/:id" component={CenterFundTransferCustom} />
                <Route path="/purchase/:id" component={CenterPurchaseCustom} />
                <Route path="/putaway/:id" component={CenterPutawayCustom} />
                <Route path="/soldout/:id" component={CenterSoldoutCustom} />
                {/*<Route path="/declaration" component={CenterDeclarationCustom} />*/}
                {/*<Route path="/cannibalizing" component={Cannibalizing} />*/}
            </Switch>
        )
    }
}