import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://ims-ol63.onrender.com/api';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) { headers.set('authorization', `Bearer ${token}`); }
            return headers;
        }
    }),
    tagTypes: ['Product', 'Movement'],
    endpoints: (builder) => ({
        getStats: builder.query({
            query: () => '/products/stats',
            providesTags: ['Product', 'Movement']
        }),
        getProducts: builder.query({
            query: ({ page, search }) => `/products?page=${page}&search=${search}`,
            providesTags: ['Product']
        }),
        createProduct: builder.mutation({
            query: (newProduct) => ({
                url: '/products',
                method: 'POST',
                body: newProduct
            }),
            invalidatesTags: ['Product']
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product', 'Movement'],
        }),

        updateProduct: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/products/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ['Product'],
        }),

        adjustStock: builder.mutation({
            query: (data) => ({
                url: '/products/stock',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Product', 'Movement']
        }),
        getMovements: builder.query({
            query: () => '/movements',
            providesTags: ['Movement']
        }),
    })
});

export const {
    useGetStatsQuery,
    useGetProductsQuery,
    useCreateProductMutation,
    useAdjustStockMutation,
    useGetMovementsQuery,
    useDeleteProductMutation,
    useUpdateProductMutation,
} = apiSlice;