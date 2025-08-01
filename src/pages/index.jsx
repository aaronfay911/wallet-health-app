import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Settings from "./Settings";

import Analytics from "./Analytics";

import Analyzer from "./Analyzer";

import Watchlist from "./Watchlist";

import Pricing from "./Pricing";

import WalletComparison from "./WalletComparison";

import Instructions from "./Instructions";

import TermsOfService from "./TermsOfService";

import PrivacyPolicy from "./PrivacyPolicy";

import AdminSettings from "./AdminSettings";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Settings: Settings,
    
    Analytics: Analytics,
    
    Analyzer: Analyzer,
    
    Watchlist: Watchlist,
    
    Pricing: Pricing,
    
    WalletComparison: WalletComparison,
    
    Instructions: Instructions,
    
    TermsOfService: TermsOfService,
    
    PrivacyPolicy: PrivacyPolicy,
    
    AdminSettings: AdminSettings,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Analyzer" element={<Analyzer />} />
                
                <Route path="/Watchlist" element={<Watchlist />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="/WalletComparison" element={<WalletComparison />} />
                
                <Route path="/Instructions" element={<Instructions />} />
                
                <Route path="/TermsOfService" element={<TermsOfService />} />
                
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                
                <Route path="/AdminSettings" element={<AdminSettings />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}