import React, { useContext } from 'react';
import { AccountInfo } from '@azure/msal-browser';

import { useMsal } from '@azure/msal-react';
import { UserContext } from './userContext';

interface Identifier {
  ProfileIdType: string;
  ProfileId: string;
  OrganizationId: string;
}

const CanAuthorize = (roles: string[]): boolean => {
  const user = useContext(UserContext);
  
  const { instance } = useMsal();
  const currentAccount: AccountInfo | null = instance.getActiveAccount();

  if (currentAccount && currentAccount.idTokenClaims?.extension_user_claims) {
    const userExtRole = (currentAccount.idTokenClaims.extension_user_claims ?? '').toString();
    const userRoles: string[] = userExtRole.split(',');
    const intersection = roles.filter((role) => userRoles.includes(role));
    return intersection.length > 0;
  }
  
  return false;
};

const CanAuthorize2 = (roles: string[]): boolean => {
  const { instance } = useMsal();
  const currentAccount: AccountInfo | null = instance.getActiveAccount();
  
  if (currentAccount && currentAccount.idTokenClaims?.extension_user_claims) {
    const userExtRole = (currentAccount.idTokenClaims.extension_user_claims ?? '').toString();
    const userRoles: string[] = userExtRole.split(',');
    const intersection = roles.filter((role) => userRoles.includes(role));
    return intersection.length > 0;
  }

  return false;
};

export default CanAuthorize;

const GetUserRoles = (): string[] => {
  const { instance } = useMsal();
  const currentAccount: AccountInfo | null = instance.getActiveAccount();
  
  if (currentAccount && currentAccount.idTokenClaims?.extension_user_roles) {
    const roles = extractRolesFromClaims(currentAccount.idTokenClaims);
    return roles.length > 0 ? roles : ['default'];
  }
  
  return ['default'];
};

export function extractRolesFromClaims(claims: any): string[] {
  if (typeof claims.extension_user_roles === 'string') {
    try {
      const rolesArray = JSON.parse(claims.extension_user_roles);
      if (Array.isArray(rolesArray)) {
        return rolesArray.map(roleObj => roleObj.Role);
      }
    } catch (error) {
      console.error('Failed to parse roles:', error);
      return [];
    }
  }
  return [];
}

export function extractPermissions(claims: any): { [Role: string]: string[] } {
  const permissions: { [role: string]: string[] } = {};
  
  if (typeof claims.extension_user_roles === 'string') {
    try {
      const userRoles = JSON.parse(claims.extension_user_roles);
      userRoles.forEach((roleObj: any) => {
        permissions[roleObj.Role] = roleObj.Entitlements;
      });
    } catch (error) {
      console.error('Failed to parse roles:', error);
    }
  }
  
  return permissions;
}

export function extractIdentifiers(claims: any, idType: string): Identifier | null {
  if (typeof claims.extension_identifiers === 'string') {
    try {
      const identifiersArray: Identifier[] = JSON.parse(claims.extension_identifiers);
      const identifierObj = identifiersArray.find(obj => obj.ProfileIdType === idType);
      return identifierObj ? {
        ProfileId: identifierObj.ProfileId,
        OrganizationId: identifierObj.OrganizationId,
        ProfileIdType: identifierObj.ProfileIdType,
      } : null;
    } catch (error) {
      console.error('Failed to parse identifiers:', error);
      return null;
    }
  }
  return null;
}

export { GetUserRoles };
