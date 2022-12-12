// ==UserScript==
// @name         At last! Okta! (Confluence and Jira Okta Redirect Fixer)
// @namespace    https://github.com/IncPlusPlus/atlast-okta
// @version      0.5
// @description  When Confluence or Jira's sessions expire, they require the user to log in again. However, our Okta configuration doesn't send the browser back to the original page that was being viewed. This userscript fixes that.
// @author       IncPlusPlus
// @include      https://confluence.*.tld/*
// @include      https://jira.*.tld/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.com
// ==/UserScript==

/*
 * Jira and Confluence direct the user to a different URL than each other when the session expires.
 * Jira's is "/okta_login.jsp?RelayState=[ORIGINAL_DESTINATION_AS_ENCODED_URL]". If I were to visit the dashboard at "https://jira.mydomain.mytld/secure/Dashboard.jspa", the URL would be "https://jira.mydomain.mytld/okta_login.jsp?RelayState=%2Fsecure%2FDashboard.jspa"
 *
 * Confluence has a few. For the server and datacenter platforms, the formats can be seen at https://confluence.atlassian.com/confkb/the-differences-between-various-url-formats-for-a-confluence-page-278692715.html.
 * The session expiry page will always look like the "/login.action?os_destination=[INTENDED_DESTINATION]&permissionViolation=true". In some cases, the INTENDED_DESTINATION will differ from where the user actually tried to visit.
 * When attempting to visit a Page Title ("Pretty") Format "/display/ENG/My+Cool+Confluence+Page", INTENDED_DESTINATION becomes "%2Fpages%2Fviewpage.action%3FspaceKey%3DENG%26title%3DMy%2BCool%2BConfluence%2BPage".
 * When attempting to visit a PageId Format, "/pages/viewpage.action?pageId=131268615", INTENDED_DESTINATION becomes "%2Fpages%2Fviewpage.action%3FpageId%3D131268615" which is the same as the original but url-encoded.
 * When attempting to visit a Shortened ("Tiny Link") Format, "/x/ZIB3Ag", INTENDED_DESTINATION becomes "/pages/tinyurl.action?urlIdentifier=ZIB3Ag".
 *
 * BEWARE that there could simply be nothing there if the user clicked the "sign in" button on Jira/Confluence. In the case of Jira, the path will be "/okta_login.jsp" and that's it.
 * With Confluence, it'll be "login.action?logout=true" if they just clicked "log out". Otherwise, it always seems to include "os_destination" which will point to the default landing page.
 */

const CONFLUENCE_BASE_URL = 'https://confluence.';
const JIRA_BASE_URL = 'https://jira.';

// ================== Session storage keys ==================
// Set when it's detected that the user lands on a sign-on page. The value is set to the intended destination that
// the script should redirect to after the user successfully signs into Okta.
const INTENDED_DESTINATION = 'incplusplus.atlast-okta.intended_destination';

const processJiraState = (location) => {
    if (location.toString().includes('/okta_login.jsp')) {
        const params = new URLSearchParams(location.search);
        // We're at the sign-in page. Check if the user was trying to view a specific page
        const intendedPagePath = params.get('RelayState');
        // If intendedPagePath is null, the RelayState query param is missing. Do nothing
        if (intendedPagePath) {
            window.sessionStorage.setItem(INTENDED_DESTINATION, decodeURIComponent(intendedPagePath));
        }
    } else {
        // We may have been redirected back to Jira after signing in to Okta.
        // Check if we were intending to redirect now that they've signed in.
        const intendedPath = window.sessionStorage.getItem(INTENDED_DESTINATION);
        // getItem() returns undefined if it wasn't set, so we can use it for its truthiness
        if (intendedPath) {
            // Remove the item from storage after we're done with it, lest we trap the user on one page for eternity.
            window.sessionStorage.removeItem(INTENDED_DESTINATION);
            // Go to the page the user was trying to go to before they were so rudely redirected to the login page.
            window.location = JIRA_BASE_URL + intendedPath;
        }
    }
}

// TODO: Confluence is a WIP
const processConfluenceState = (url) => {
}

const SiteType = {
    Confluence: 'Confluence',
    Jira: 'Jira',
    UNKNOWN: 'UNKNOWN',
};

const determineSite = url => {
    // Oh, how I wish JS had switch expressions
    switch (true) {
        case url.startsWith(CONFLUENCE_BASE_URL):
            return SiteType.Confluence;
        case url.startsWith(JIRA_BASE_URL):
            return SiteType.Jira;
        default:
            return SiteType.UNKNOWN
    }
}

const processState = (url) => {
    const site = determineSite(url.toString());
    if (site === SiteType.Confluence) {
        processConfluenceState(url);
    } else if (site === SiteType.Jira) {
        processJiraState(url);
    }
}

(function() {
    'use strict';
    processState(window.location);
})();