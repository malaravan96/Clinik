import { AuthenticationResult, EventType, PublicClientApplication } from '@azure/msal-browser'
import React, { ReactNode, createContext, useState, useEffect, useContext } from 'react'
import { extractIdentifiers, extractPermissions, extractRolesFromClaims } from './authorizeAccess'


export type UserContextInfo = {
  name: string
  email: string
  patientId?: string
  providerId?: string
  selectedpatientId?: string
  organizationId?: string
  roles?: string[]
  permissions?: { [Role: string]: string[] }
}

// Define the type for the context value
type UserContextType = {
  user: UserContextInfo
  setUser: (user: UserContextInfo) => void;
  updateUser: (newUserInfo: UserContextInfo) => void
}

const initialUserInfo: UserContextInfo = {
  name: '',
  email: ''
}

const defaultUpdateUser = (user: UserContextInfo) => {
  // This is a placeholder and should be replaced by actual function logic
}

// Create a context with a default user value
export const UserContext = createContext<UserContextType>({ user: initialUserInfo,setUser: defaultUpdateUser,  updateUser: defaultUpdateUser })



export const UserProvider = ({ children, msalInstance }: { children: ReactNode; msalInstance: PublicClientApplication }) => {
  // Load initial user info from sessionStorage
  const [user, setUser] = useState(() => {
    let savedUserInfo = initialUserInfo;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionData = window.sessionStorage.getItem('user');
      savedUserInfo = sessionData ? JSON.parse(sessionData) : initialUserInfo;
    }
    return savedUserInfo;
  });




  msalInstance.addEventCallback(event => {
    const payload = event.payload as AuthenticationResult
    if (
      (event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        event.eventType === EventType.SSO_SILENT_SUCCESS ||
        event.eventType === EventType.RESTORE_FROM_BFCACHE) &&
      payload.account
    ) {
      const account = payload.account
      msalInstance.setActiveAccount(account)
      const userInfo = BuildUserContextInfo(account)
      //alert('Building UserContext: LOGIN_SUCCESS')
      setUser(userInfo)

    }
  })

  const updateUser = (newUserInfo: UserContextInfo) => {
    setUser((prevState : any) => {
      const updatedUserInfo = { ...prevState, ...newUserInfo };
      // Save updated user info to sessionStorage
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem('user', JSON.stringify(updatedUserInfo));
      }
      return updatedUserInfo;
    });
  };


  msalInstance.addEventCallback(event => {
    const payload = event.payload as AuthenticationResult
    if (
      (event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        event.eventType === EventType.SSO_SILENT_SUCCESS ||
        event.eventType === EventType.RESTORE_FROM_BFCACHE) &&
      payload.account
    ) {
      const account = payload.account
      msalInstance.setActiveAccount(account)
      //alert('Building UserContext: LOGIN_SUCCESS')
      const userInfo = BuildUserContextInfo(account)
      setUser(userInfo)
    }
  })

  useEffect(() => {
    // Check if there's a token in the session storage
    const token = window.sessionStorage.getItem('msal.idtoken');
    if (token) {
      // If a token exists, use it to get the user info and set the user state
      const account = msalInstance.getAccountByHomeId(token);
      if (account) {
        const userInfo = BuildUserContextInfo(account);
        setUser(userInfo);
      }
    }
  }, [msalInstance]);

  return <UserContext.Provider value={{ user, setUser, updateUser }}>{children}</UserContext.Provider>
}

function BuildUserContextInfo(account: any): UserContextInfo {
  const userInfo: UserContextInfo = {
    name: account.name || 'n/a', // Fallback to empty string if name is undefined
    email: account.username || 'n/a' // Email is usually in the 'username' field
  }
  if (account.idTokenClaims && account.idTokenClaims.extension_user_roles) {
    userInfo.roles = extractRolesFromClaims(account.idTokenClaims)
  }
  if (account.idTokenClaims && account.idTokenClaims.extension_user_roles) {
    userInfo.permissions = extractPermissions(account.idTokenClaims)
  }
  if (account.idTokenClaims && account.idTokenClaims.extension_identifiers) {
    const indentifier = extractIdentifiers(account.idTokenClaims, 'Patient')
    if (indentifier) {
      userInfo.patientId = indentifier.ProfileId
      userInfo.organizationId = indentifier.OrganizationId
    } 
    
    
    else {
      const indentifier = extractIdentifiers(account.idTokenClaims, 'Provider')
      if (indentifier) {
        userInfo.providerId = indentifier.ProfileId
        // userInfo.selectedpatientId = indentifier.PatientId
        userInfo.organizationId = indentifier.OrganizationId
      }
      else {
        const indentifier = extractIdentifiers(account.idTokenClaims, 'Receptionist');
      if (indentifier) {
        userInfo.providerId = indentifier.ProfileId
        // userInfo.selectedpatientId = indentifier.PatientId
        userInfo.organizationId = indentifier.OrganizationId
      }
      }
    }
  }
  return userInfo
}

export const useUser = () => useContext(UserContext)
