import { apiClient, baseUrl } from "@/configs/config";
import axios from "axios";

  export const submitForm = async (formValues: Record<string, any>, formId: string, dealerDomain: string) => {

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${dealerDomain}/v1/form/${formId}`,
        formValues,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }

  }
     

  export const getFormField = async ( formId: string, site: string) => {
    try {
      const response = await axios.get(
       `${baseUrl + "/" + site}/v1/form/${formId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }

  }
  export const getSimilarVehicles = async (vehicleId: string, site: string) => {
    try {
      const response = await apiClient.get(
        `/${site}/v1/get-similar-vehicles?vdp_slug=${vehicleId}`
      );
     
      return response.data;
    } catch (error) {
      console.error("Error fetching similar vehicles:", error);
      throw error;
    }

  }
     