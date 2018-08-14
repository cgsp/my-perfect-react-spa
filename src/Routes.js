import React, { Component } from 'react'
import MainFrame from './base/MainFrame'
import { Route, withRouter, Switch } from 'react-router-dom'

import Index from './pages/Index'

import Catagories from './pages/developerDoc/Catagories'
import Create from './pages/developerDoc/Create'
import DocContent from './pages/developerDoc/DocContent'
import developerDocEdit from './pages/developerDoc/Edit'
import HelpTop from './pages/Help/Top'
import HelpSecondary from './pages/Help/Secondary'
import HelpContent from './pages/Help/Content'
import HelpEdit from './pages/Help/Edit'
import HelpCreate from './pages/Help/Create'
import Announcement from './pages/Announcement'
import AnnouceCreate from './pages/Announcement/Create'
import AnnouceEdit from './pages/Announcement/Edit'
import StationManage from './pages/netWorkManage'
import UserManage from './pages/userManage'
import Company from './pages/developerAudit/Company'
import CompanyAuditDetail from './pages/developerAudit/Company/CompanyAuditDetail'
import CompanyAudit from './pages/developerAudit/Company/CompanyAudit'



import Personal from './pages/developerAudit/Personal'
import PersonalAuditDetail from './pages/developerAudit/Personal/PersonalAuditDetail'
import PersonalAudit from './pages/developerAudit/Personal/PersonalAudit'

import ApplyAudit from './pages/mobileAudit/ApplyAudit'
import HighLinesMobileDetail from './pages/mobileAudit/ApplyAudit/HighLinesMobile/HighLinesMobileDetail'
import HighLinesMobileAudit from './pages/mobileAudit/ApplyAudit/HighLinesMobile/HighLinesMobileAudit'

import HighLinesWebsiteDetail from './pages/mobileAudit/ApplyAudit/HighLinesWebsite/HighLinesWebsiteDetail'
import HighLinesWebsiteAudit from './pages/mobileAudit/ApplyAudit/HighLinesWebsite/HighLinesWebsiteAudit'

import ModifyMobileDetail from './pages/mobileAudit/ApplyAudit/ModifyMobile/ModifyMobileDetail'
import ModifyMobileAudit from './pages/mobileAudit/ApplyAudit/ModifyMobile/ModifyMobileAudit'

import ModifyWebsiteDetail from './pages/mobileAudit/ApplyAudit/ModifyWebsite/ModifyWebsiteDetail'
import ModifyWebsiteAudit from './pages/mobileAudit/ApplyAudit/ModifyWebsite/ModifyWebsiteAudit'

import ServerAudit from './pages/mobileAudit/ServerAudit'
import FeeAudit from './pages/mobileAudit/FeeAudit'


import IntellServer from './pages/intelligentAudit/IntellServer'
import IntellApply from './pages/intelligentAudit/IntellApply'

import OfflineAudit from './pages/intelligentAudit/IntellApply/Offline/Audit'
import OfflineDetail from './pages/intelligentAudit/IntellApply/Offline/Detail'

import ModifyAudit from './pages/intelligentAudit/IntellApply/Modify/Audit'
import ModifyDetail from './pages/intelligentAudit/IntellApply/Modify/Detail'





@withRouter
export default class Routes extends Component {
    render() {
        return (
            <MainFrame>
              <Switch>
                <Route path="/" component={Index} exact />
                <Route path="/developerDoc/Catagories" component={Catagories} />
                <Route path="/developerDoc/DocContent" component={DocContent} />
                <Route path="/developerDoc/Create" component={Create} />
                <Route path="/developerDoc/edit_:id" component={developerDocEdit} />

                <Route path="/help/top" component={HelpTop} />
                <Route path="/help/secondary" component={HelpSecondary} />
                <Route path="/help/content" component={HelpContent} />
                <Route path="/help/Create" component={HelpCreate} />
                <Route path="/help/edit_:id" component={HelpEdit} />

                <Route path="/announcement/index" component={Announcement} />
                <Route path="/announcement/Create" component={AnnouceCreate} />
                <Route path="/announcement/edit_:id" component={AnnouceEdit} />

                <Route path="/netWorkManage/index" component={StationManage} />

                <Route path="/userManage/index" component={UserManage} />

                <Route path="/developerAudit/Company" component={Company} exact/>
                <Route path="/developerAudit/Company/CompanyAuditDetail" component={CompanyAuditDetail} />
                <Route path="/developerAudit/Company/CompanyAudit" component={CompanyAudit} />
                <Route path="/developerAudit/Personal" component={Personal} exact/>
                <Route path="/developerAudit/Personal/PersonalAuditDetail" component={PersonalAuditDetail} />
                <Route path="/developerAudit/Personal/PersonalAudit" component={PersonalAudit} />

                <Route path="/mobileAudit/ApplyAudit" component={ApplyAudit} exact/>

                <Route path="/mobileAudit/ApplyAudit/HighLinesMobile/HighLinesMobileDetail" component={HighLinesMobileDetail} />
                <Route path="/mobileAudit/ApplyAudit/HighLinesMobile/HighLinesMobileAudit" component={HighLinesMobileAudit} />

                  <Route path="/mobileAudit/ApplyAudit/HighLinesWebsite/HighLinesWebsiteDetail" component={HighLinesWebsiteDetail} />
                <Route path="/mobileAudit/ApplyAudit/HighLinesWebsite/HighLinesWebsiteAudit" component={HighLinesWebsiteAudit} />

                <Route path="/mobileAudit/ApplyAudit/ModifyMobile/ModifyMobileDetail" component={ModifyMobileDetail} />
                <Route path="/mobileAudit/ApplyAudit/ModifyMobile/ModifyMobileAudit" component={ModifyMobileAudit} />

                <Route path="/mobileAudit/ApplyAudit/ModifyWebsite/ModifyWebsiteDetail" component={ModifyWebsiteDetail} />
                <Route path="/mobileAudit/ApplyAudit/ModifyWebsite/ModifyWebsiteAudit" component={ModifyWebsiteAudit} />
                <Route path="/mobileAudit/ServerAudit" component={ServerAudit} />
                <Route path="/mobileAudit/FeeAudit" component={FeeAudit} />


                <Route path="/intelligentAudit/IntellServer" component={IntellServer} />
                <Route path="/intelligentAudit/IntellApply" component={IntellApply} exact/>

                <Route path="/intelligentAudit/IntellApply/Offline/Audit" component={OfflineAudit} />
                <Route path="/intelligentAudit/IntellApply/Offline/Detail" component={OfflineDetail} />
                <Route path="/intelligentAudit/IntellApply/Modify/Audit" component={ModifyAudit} />
                <Route path="/intelligentAudit/IntellApply/Modify/Detail" component={ModifyDetail} />

              </Switch>
            </MainFrame>
        )
    }
}
