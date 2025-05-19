import { EPermissionType } from "../../enums/EPermissionType.enum";
import { EUserRole } from "../../enums/EUserRole.enum";

export const permissions = {
  // User Management
  createUsers: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  getAllUsers: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  updateUser: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  deleteUser: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },

  // Category Management
  createCategory: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  getCategoriesWithComplainCount: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  updateCategory: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  deleteCategory: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },

  // Agency Management
  createAgency: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  updateAgency: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  deleteAgency: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  
  // Complaint Management
  createComplaint: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  getComplaints: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  getComplaint: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  updateComplaint: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  deleteComplaint: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
  respondComplaint: {
    roles: [
      EUserRole.SUPER_ADMIN, EUserRole.AGENCY_ADMIN, 
    ],
  },

  // Analytics
  getAnalytics: {
    roles: [
      EUserRole.SUPER_ADMIN, 
    ],
  },
};
