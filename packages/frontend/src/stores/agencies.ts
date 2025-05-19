import { defineStore } from "pinia";
import { AgenciesActionTypes, AuthActionTypes, ComplaintsActionTypes } from "./actions/action-types.enum";
import axios from "axios";
import { AgencyApiUrl, BASE_API_URL, ComplaintApiUrl } from "@shared/variables/urls";
import { useAuthStore } from "./auth";
import { ICreateAgencyReqDto, IUpdateAgencyReqDto } from "@shared/interfaces/agencies/request/IAgencyReq.dto";

const authStore = useAuthStore();

export const useAgenciesStore = defineStore('agencies', {
  state: () => ({
    agencies: []
  }),
  actions: {
    [AgenciesActionTypes.GET_AGENCIES]() {
      return axios({
        method: 'GET',
        url: BASE_API_URL + AgencyApiUrl.CONTROLLER + AgencyApiUrl.GET_AGENCIES,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    },
    [AgenciesActionTypes.CREATE_AGENCY](payload: ICreateAgencyReqDto) {
      return axios({
        method: 'POST',
        url: BASE_API_URL + AgencyApiUrl.CONTROLLER + AgencyApiUrl.CREATE_AGENCY,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        },
        data: payload
      })
    },
    [AgenciesActionTypes.UPDATE_AGENCY](id: number, payload: IUpdateAgencyReqDto) {
      return axios({
        method: 'PATCH',
        url: BASE_API_URL + AgencyApiUrl.CONTROLLER + AgencyApiUrl.UPDATE_AGENCY + `/${id}`,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        },
        data: payload
      })
    },
    [AgenciesActionTypes.DELETE_AGENCY](id: number) {
      return axios({
        method: 'DELETE',
        url: BASE_API_URL + AgencyApiUrl.CONTROLLER + AgencyApiUrl.DELETE_AGENCY + `/${id}`,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    },
    [AgenciesActionTypes.GET_AGENCY](token: string) {
      return axios({
        method: 'GET',
        url: BASE_API_URL + AgencyApiUrl.CONTROLLER + AgencyApiUrl.GET_AGENCY + `/${token}`,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    }
  }
})
