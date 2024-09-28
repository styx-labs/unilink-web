// TODO for now, weird bug where loading always flips back and forth

// import { useState, useEffect } from "react";
// import {
//   CandidateWithId,
//   CandidateCreate,
//   CandidateUpdate,
// } from "../client/types.gen";
// import {
//   listCandidatesEndpointCandidatesGet,
//   createCandidateEndpointCandidatesPost,
//   updateCandidateEndpointCandidatesCandidateIdPut,
//   deleteCandidateEndpointCandidatesCandidateIdDelete,
// } from "../client/services.gen";
// import {
//   CandidateCreateSchema,
//   CandidateUpdateSchema,
// } from "../client/schemas.gen";

// export function useCandidates() {
//   const [candidates, setCandidates] = useState<CandidateWithId[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [nextCursor, setNextCursor] = useState<string | null>(null);
//   const [hasMore, setHasMore] = useState<boolean>(true);

//   const fetchCandidates = async (cursorParam?: string | null) => {
//     setLoading(true);
//     const { data, error } = await listCandidatesEndpointCandidatesGet({
//       query: {
//         cursor: cursorParam || undefined,
//         limit: 20,
//       },
//     });
//     if (error) {
//       console.error("Error fetching candidates:", error);
//     } else {
//       const [newCandidates, newNextCursor] = data!;

//       setCandidates((prev) =>
//         cursorParam ? [...prev, ...newCandidates] : newCandidates
//       );
//       setNextCursor(newNextCursor);
//       setHasMore(!!newNextCursor);
//     }
//     setLoading(false);
//   };

//   const addCandidate = async (candidate: Partial<CandidateWithId>) => {
//     const completeCandidate = Object.keys(
//       CandidateCreateSchema.properties
//     ).reduce((acc, key) => {
//       if (
//         key !== "created_at" &&
//         key !== "updated_at" &&
//         key !== "github_rating" &&
//         key !== "portfolio_rating"
//       ) {
//         acc[key as keyof CandidateCreate] =
//           (candidate[key as keyof CandidateCreate] as any) ?? "";
//       }
//       return acc;
//     }, {} as Partial<CandidateCreate>);

//     const { error } = await createCandidateEndpointCandidatesPost({
//       body: completeCandidate as CandidateCreate,
//     });
//     if (error) {
//       console.error("Error adding candidate:", error);
//     } else {
//       fetchCandidates();
//     }
//   };

//   const updateCandidate = async (candidate: CandidateWithId) => {
//     const completeCandidate = Object.keys(
//       CandidateUpdateSchema.properties
//     ).reduce((acc, key) => {
//       if (
//         key !== "created_at" &&
//         key !== "updated_at" &&
//         key !== "github_rating"
//       ) {
//         acc[key as keyof CandidateUpdate] =
//           (candidate[key as keyof CandidateUpdate] as any) ?? "";
//       }
//       return acc;
//     }, {} as Partial<CandidateUpdate>);
//     const { error } = await updateCandidateEndpointCandidatesCandidateIdPut({
//       body: completeCandidate as CandidateUpdate,
//       path: { candidate_id: candidate.candidate_id },
//     });
//     if (error) {
//       console.error("Error updating candidate:", error);
//     } else {
//       fetchCandidates();
//     }
//   };

//   const deleteCandidate = async (id: string) => {
//     const { error } = await deleteCandidateEndpointCandidatesCandidateIdDelete({
//       path: { candidate_id: id },
//     });
//     if (error) {
//       console.error("Error deleting candidate:", error);
//     } else {
//       fetchCandidates();
//     }
//   };

//   useEffect(() => {
//     fetchCandidates();
//   }, [fetchCandidates]);

//   return {
//     candidates,
//     loading,
//     hasMore,
//     nextCursor,
//     fetchCandidates,
//     addCandidate,
//     updateCandidate,
//     deleteCandidate,
//   };
// }
