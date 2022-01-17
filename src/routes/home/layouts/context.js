import React from 'react';

export const defaultUserPref = {
  geoCity: 'Delhi',
  geoLang: 'Hindi',
  userPreference: {},
};

export const UserPreferenceContext = React.createContext(
  defaultUserPref, // default value
);

export const UseIntersectionObeserver = React.createContext(false);
