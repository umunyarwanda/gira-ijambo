import { defineStore } from "pinia";
import { AuthActionTypes, ComplaintsActionTypes } from "./actions/action-types.enum";
import axios from "axios";
import { BASE_API_URL, ComplaintApiUrl } from "@shared/variables/urls";
import { useAuthStore } from "./auth";
import { ICreateComplaintReq, IUpdateComplaintReq } from "@shared/interfaces/complaints/request/IComplaintReq.dto";

const authStore = useAuthStore();

export const useComplaintsStore = defineStore('complaints', {
  state: () => ({
    complaints: [],
    localComplaintKey: 'LOCAL_COMPLAINTS'
  }),
  actions: {
    [ComplaintsActionTypes.GET_COMPLAINTS]() {
      return axios({
        method: 'GET',
        url: BASE_API_URL + ComplaintApiUrl.CONTROLLER + ComplaintApiUrl.GET_COMPLAINTS,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    },
    [ComplaintsActionTypes.CREATE_COMPLAINT](payload: ICreateComplaintReq) {
      return axios({
        method: 'POST',
        url: BASE_API_URL + ComplaintApiUrl.CONTROLLER + ComplaintApiUrl.CREATE_COMPLAINT,
        data: payload
      })
    },
    [ComplaintsActionTypes.UPDATE_COMPLAINT](id: number, payload: IUpdateComplaintReq) {
      return axios({
        method: 'PATCH',
        url: BASE_API_URL + ComplaintApiUrl.CONTROLLER + ComplaintApiUrl.UPDATE_COMPLAINT + `/${id}`,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        },
        data: payload
      })
    },
    [ComplaintsActionTypes.DELETE_COMPLAINT](id: number) {
      return axios({
        method: 'DELETE',
        url: BASE_API_URL + ComplaintApiUrl.CONTROLLER + ComplaintApiUrl.DELETE_COMPLAINT + `/${id}`,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    },
    [ComplaintsActionTypes.GET_COMPLAINT](token: string) {
      return axios({
        method: 'GET',
        url: BASE_API_URL + ComplaintApiUrl.CONTROLLER + ComplaintApiUrl.GET_COMPLAINT + `/${token}`,
        headers: {
          Authorization: `Bearer ${authStore[AuthActionTypes.AUTH_TOKEN]}`
        }
      })
    },
    [ComplaintsActionTypes.SAVE_COMPLAINT](token: string) {
      const localComplaints = localStorage.getItem(this.localComplaintKey);
      if (localComplaints) {
        const complaints = JSON.parse(localComplaints);
        complaints.unshift(token);
        localStorage.setItem(this.localComplaintKey, JSON.stringify(complaints));
      } else {
        localStorage.setItem(this.localComplaintKey, JSON.stringify([token]));
      }
    },
    [ComplaintsActionTypes.GET_LOCAL_COMPLAINTS]() {
      const localComplaints = localStorage.getItem(this.localComplaintKey);
      if (localComplaints) {
        return JSON.parse(localComplaints);
      }
      return [];
    },
    [ComplaintsActionTypes.GET_BULK_COMPLAINTS](trackingCodes: string[]) {
      return axios({
        method: 'POST',
        url: BASE_API_URL + ComplaintApiUrl.CONTROLLER + ComplaintApiUrl.GET_BULK_COMPLAINTS,
        data: trackingCodes
      })
    }
  }
})
