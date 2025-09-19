import { baseUrl } from "@/configs/config";
import axios from "axios";

  export const getFormField = async (formValues: Record<string, any>, formId: string, dealerDomain: string) => {

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
     