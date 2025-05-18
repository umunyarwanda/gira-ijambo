import { defineStore } from "pinia";
import { AuthActionTypes } from "./actions/action-types.enum";
import axios from "axios";
import { AuthApiUrl, BASE_API_URL } from "@shared/variables/urls";
import router from "@/router";
import { IAuthTokenData } from "@shared/interfaces/auth/response/ILoginResDto";
import { ILoginAuthDto } from "@shared/interfaces/auth/request/ILoginAuthDto";

/**
 * Auth Store
 * 
 * This store manages authentication state and operations.
 */
export const useAuthStore = defineStore('auth', {
  /**
   * Defines the initial state of the auth store
   * @returns An object containing the initial state properties
   */
  state: () => ({
    isAuthenticated: false,
    user: null as IAuthTokenData | null,
    token: null as string | null,
    tokenName: 'GIRA_IJAMBO_ACCESS_TOKEN'
  }),
  actions: {
    /**
     * Logs in the user
     * @param payload - The login credentials
     * @returns A promise that resolves with the login response
     */
    [AuthActionTypes.LOGIN](payload: ILoginAuthDto) {
      return axios({
        method: 'POST',
        url: BASE_API_URL + AuthApiUrl.CONTROLLER + AuthApiUrl.LOGIN,
        data: payload
      })
    },

    /**
     * Retrieves the authentication token from cookies
     * @returns The token string if found, otherwise an empty string
     */
    [AuthActionTypes.GET_TOKEN](){
      let name = this.tokenName + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      
      return "";
    },

    /**
     * Parses the JWT token, extracting user information from the token
     * @returns A promise that resolves with the decoded token payload
     */
    async [AuthActionTypes.PARSE_TOKEN]() {
      try {
        let cookieToken = await this[AuthActionTypes.GET_TOKEN]();
        let base64Url = cookieToken.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

      return JSON.parse(jsonPayload);
      } catch (error) {
        this[AuthActionTypes.LOGOUT]();
      }
    },

    /**
     * Sets the authentication token in cookies
     * @param value - The token string to set
     */
    [AuthActionTypes.SET_TOKEN](value: string) {
      var expires = "";
      var date = new Date();
      date.setTime(date.getTime() + (90 * 24 * 60 * 60 * 1000)); // Set token to expire in 90 days
      expires = "; expires=" + date.toUTCString();
      document.cookie = this.tokenName + "=" + (value || "") + expires + "; path=/";
      this[AuthActionTypes.CHECK_TOKEN](); // Check if the token is valid and update the authentication state
    },

    /**
     * Checks if a valid token exists and updates the authentication state
     */
    async [AuthActionTypes.CHECK_TOKEN]() {
      let cookie = await this[AuthActionTypes.GET_TOKEN]();
      if (cookie) {
        let token = await this[AuthActionTypes.PARSE_TOKEN]();
        if (token) {
          if (token.exp > Date.now() / 1000) {
            this.isAuthenticated = true;
            this.token = cookie;
            this.user = token as IAuthTokenData;
          }
        }
      } else {
        this.isAuthenticated = false;
      }
    },

    /**
     * Deletes the authentication token from cookies
     * @param name - The name of the cookie to delete
     * @param path - The path of the cookie (default: '/')
     * @param domain - The domain of the cookie (default: '')
     * @returns A promise that resolves to true if the token was deleted, false otherwise
     */
    async [AuthActionTypes.DELETE_TOKEN](name: string, path: string = '/', domain: string = '') {
      const token = await this[AuthActionTypes.GET_TOKEN]();
      if (token) {
        document.cookie = name + "=" +
              ((path) ? ";path=" + path : "") +
              ((domain) ? ";domain=" + domain : "") +
              ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
            return true;
      }
      return false;
    },

    /**
     * Logs out the authenticated user
     * Deletes the token, resets the auth state, and redirects to the home page
     */
    async [AuthActionTypes.LOGOUT]() {
      const deleteToken = await this[AuthActionTypes.DELETE_TOKEN](this.tokenName);
      if (deleteToken) {
        this.isAuthenticated = false;
        this.user = null;
        router.push('/');
      }
    }
  },

  /**
   * Defines the getters for the auth store
   */
  getters: {
    /**
     * Returns the authentication status
     * @param state - The current state of the store
     * @returns A boolean indicating whether the user is authenticated
     */
    [AuthActionTypes.IS_AUTHENTICATED]: (state) => state.isAuthenticated,
    
    /**
     * Returns the authenticated user
     * @param state - The current state of the store
     * @returns The authenticated user object or null if not authenticated
     */
    [AuthActionTypes.AUTH_USER]: (state) => state.user,

    /**
     * Returns the authentication token
     * @param state - The current state of the store
     * @returns The authentication token string or null if not available
     */
    [AuthActionTypes.AUTH_TOKEN]: (state) => state.token,
  }
})
