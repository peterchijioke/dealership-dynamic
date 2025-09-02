
import axios from 'axios'



const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export const getVehicleData = async (
  site: string,
  slug: string
): Promise<any> => {
  console.log('====================================');
  console.log(`Fetching vehicle data for slug: ${slug}`,site);
  console.log('====================================');
  const res = await apiClient.get(`/${site}/get-vehicle?vdp_url=${slug}`);
  console.log('====================================');
  console.log(res.data);
  console.log('====================================');
  return res.data;
};
