import { baseApi } from "@/redux/api/baseApi";

export const assignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    assignmentStatsInstructor: builder.query({
      query: () => ({
        url: "/assignments/assignment-stats/instructor",
        method: "GET",
      }),
      providesTags: ["Assignment"],
    }),

    recentAssignments: builder.query({
      query: () => ({
        url: "/assignments/recent-assignments/instructor",
        method: "GET",
      }),
      providesTags: ["Assignment"],
    }),

    crateAssignment: builder.mutation({
      query: (data) => ({
        url: "/assignments/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Assignment"],
    }),
    getAllAssignmentByInstructor: builder.query({
      query: () => ({
        url: "/assignments/all-assignments/instructor",
        method: "GET",
      }),
      providesTags: ["Assignment"],
    }),
  }),
});

export const {
  useAssignmentStatsInstructorQuery,
  useRecentAssignmentsQuery,
  useCrateAssignmentMutation,
  useGetAllAssignmentByInstructorQuery
} = assignmentApi;
