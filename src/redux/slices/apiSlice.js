import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use relative URL to go through Vite proxy
const API_URL = "/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include' // Include cookies in requests
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Task', 'User', 'Dashboard'],
  endpoints: (builder) => ({}),
});
