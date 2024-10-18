
// This should be the same instance you pass to MsalProvider
export const acquireAccessToken = async (msalInstance: {
        getAllAccounts: () => any; acquireTokenSilent: (arg0: {
            scopes: string[]; account: any; // Use the first account if multiple accounts exist
        }) => any;
    }) => {
  const accounts = await msalInstance.getAllAccounts();

  if (accounts.length === 0) {
    /*
     * User is not signed in. Throw error or wait for user to login.
     * Do not attempt to log a user in outside of the context of MsalProvider
     */
    throw new Error('User is not signed in. Please log in.');
  }

  const request = {
    scopes: ['User.Read'],
    account: accounts[0] // Use the first account if multiple accounts exist
  };

  try {
    const authResult = await msalInstance.acquireTokenSilent(request);
    return authResult.accessToken;
  } catch (error) {
    // Handle token acquisition errors
    console.error('Error acquiring access token:', error);
    throw error; // You can throw the error or handle it as needed
  }
};

export default acquireAccessToken;
