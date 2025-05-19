import { defineStore } from "pinia";
import { AuthActionTypes, AnalyticsActionTypes } from "./actions/action-types.enum";
import axios from "axios";
import { BASE_API_URL, AnalyticsApiUrl } from "@shared/variables/urls";
import { useAuthStore } from "./auth";

const authStore = useAuthStore();

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    analytics: null
  }),
  actions: {
    [AnalyticsActionTypes.GET_ANALYTICS]() {
      return axios({
        method: 'GET',
        url: BASE_API_URL + AnalyticsApiUrl.CONTROLLER + AnalyticsApiUrl.GET_ANALYTICS,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    },
    [AnalyticsActionTypes.GET_AI_INSIGHTS]() {
      return axios({
        method: 'GET',
        url: BASE_API_URL + AnalyticsApiUrl.CONTROLLER + AnalyticsApiUrl.GET_AI_INSIGHTS,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    }
  }
})
