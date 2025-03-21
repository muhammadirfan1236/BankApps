const getTypes = [0, 1, 2, 3];
const getRoles = [0, 1, 2, 3, 4];
const getDealerClassifications = [0, 1, 2];
const getPersonalTypes = [0, 1, 2, 3, 4];
const types = {
  STANDARD: 0,
  FACEBOOK: 1,
  GOOGLE: 2,
  APPLE: 3,
};

const roles = {
  ADMIN: 0,
  DEALER: 1,
  INSTITUTION: 2,
  PERSONAL: 3,
  ENDUSER: 4,
};
const rolesReverseForVerifyingRoles = {
  0: "ADMIN",
  1: "DEALER",
  2: "INSTITUTION",
  3: "PERSONAL",
};
const personalType = {
  ADMIN_PERSONAL: 0,
  DEALER_PERSONAL: 1,
  INSTITUTION_PERSONAL: 2,
  PERSONAL_PERSONAL: 3,
  INSTITUTION_USER: 4,
};
const dealerClassifications = {
  NETSELLER: 0,
  SKRILL: 1,
  BTC: 2,
};
module.exports = {
  types,
  roles,
  getTypes,
  getRoles,
  dealerClassifications,
  getDealerClassifications,
  rolesReverseForVerifyingRoles,
  personalType,
  getPersonalTypes,
};
