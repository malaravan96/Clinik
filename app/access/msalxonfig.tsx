// msalConfig.js
import { PublicClientApplication } from '@azure/msal-browser';

export const b2cPolicies = {
    names: {
      signUpSignIn: 'B2C_1_SignupSignIn',
      forgotPassword: 'B2C_1_PasswordReset',
      editProfile: 'B2C_1_ProfileEdit'
    },
    authorities: {
      signUpSignIn: {
        authority: 'https://carelabsad.b2clogin.com/carelabsad.onmicrosoft.com/B2C_1_SignupSignIn'
      },
      forgotPassword: {
        authority: 'https://carelabsad.b2clogin.com/carelabsad.onmicrosoft.com/B2C_1_PasswordReset'
      },
      editProfile: {
        authority: 'https://carelabsad.b2clogin.com/carelabsad.onmicrosoft.com/B2C_1_ProfileEdit'
      }
    },
    authorityDomain: 'carelabsad.b2clogin.com'
  }
  
const msalConfig = {
    auth: {
        clientId: '09298e99-351a-4129-8157-88924ba3ac29', 
        authority: b2cPolicies.authorities.signUpSignIn.authority, 
        knownAuthorities: [b2cPolicies.authorityDomain],
        
    },
};

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;
      