import axios from 'axios';
import { FormResponseT, InventoryFieldResponse } from '../types';
import { apiClient } from '@/configs/config';
import { ApiResponse } from '@/types/general';

// export const getFormById = async (site: string, formId: string) => {
// 	const res = await apiClient.get<ApiResponse<FormResponseT>>(`/${site}/form/${formId}`);
// 	return res.data.data;
// };

export const getFormById = async (site: string, formId: string) => {
	const res = await fetch(`/api/get-form/${formId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ site }), // Send `site` as part of the request body
		credentials: 'include',
	});

	if (!res.ok) {
		throw new Error('Failed to fetch form data');
	}

	const data = await res.json();
	return data.data as FormResponseT;
};

// export const submitForm = async (site: string, formId: string, payload: any) => {
// 	const res = await apiClient.post<ApiResponse<FormResponseT>>(`/${site}/form/${formId}`, payload);
// 	return res.data.data;
// };

export const submitForm = async (site: string, formId: string, payload: any) => {
	const res = await fetch(`/api/submit-form/${formId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ site, payload }),
	});

	if (!res.ok) {
		throw new Error('Failed to submit form data');
	}

	const data = await res.json();
	return data.data;
};

export const getInventoryFields = async (site: string, payload: any) => {
	const res = await apiClient.post<ApiResponse<InventoryFieldResponse>>(`/${site}/form/get-inventory-fields`, payload);
	return res.data.data;
};

export const fetchCsrfToken = async (): Promise<string> => {
	const response = await apiClient.get<{ csrfToken: string }>('/v1/csrf/');
	return response.data.csrfToken;
};

export const validateForm = async (csrfToken: string) => {
	const res = await apiClient.post('/v1/validateToken/', {
		csrfToken,
	});
	return res;
};

export const validateAndSubmit = async (
	site: string,
	formId: string,
	payload: any
	// csrfToken: string
) => {
	// await validateForm(csrfToken);
	const response = await submitForm(site, formId, payload);
	return response;
};
