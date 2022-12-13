# At last! Okta!
A userscript that fixes the post-sign-on Okta redirect for Jira and Confluence.

## Background
The session timer for Confluence and Jira is way shorter than the amount of time an Okta cookie lasts. Because of this, Jira and Confluence will frequently kick you out of whatever page you were looking at and send you to the sign-in page. Then, you have to click the blue "Log in with Okta" button. This will load the Okta SAML login page which tends to just flash briefly before redirecting back to Jira or Confluence. That's all well and good. **_However,_** with the current way Okta is configured, I don't get redirected back to the page I was looking at. I find this _immensely_ irritating. So much so that I've finally done something about it.

The name of the script, `atlast-okta` is a combination of Atlassian, the phrase "at last", and Okta.

## Installation
These installation instructions only apply if you're using Google Chrome. However, everything should be the same if you're using Firefox. Just use GreaseMonkey instead of Tampermonkey.

1. Install Tampermonkey from the Chrome Web Store. (Click [here](https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo) and click the blue "Add to Chrome" button. Click the "Add extension" button in the prompt that appears.)
2. Tampermonkey will open a tab letting you know it was successfully installed. Feel free to close that tab.
3. Install the script by clicking [here](https://github.com/IncPlusPlus/atlast-okta/raw/release/dist/atlast-okta.user.js). A new tab should open that displays the script. Click the install button near the top left of the screen.
4. ????
5. PROFIT!!!

## Usage
There's nothing you need to do after you install the script. If you want to make sure it's working, sign out of Jira and then visit one of your Jira bookmarks. You should see the usual "Welcome to Jira" login screen. Click "Log in with Okta". If the script is working, you should be directed back to wherever your bookmark was supposed to take you after signing in as opposed to being dumped at the Jira home screen.

