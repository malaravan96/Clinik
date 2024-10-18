// msalConfig.js
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: 'YOUR_CLIENT_ID', // Replace with your actual client ID
        authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // Replace with your actual tenant ID
        redirectUri: 'YOUR_REDIRECT_URI', // Replace with your actual redirect URI
    },
};

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;
