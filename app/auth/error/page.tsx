// "use client";

// import { useSearchParams } from "next/navigation";
// import Link from "next/link";

// export default function AuthError() {
//   const searchParams = useSearchParams();
//   const error = searchParams.get("error");

//   let errorMessage = "An error occurred during authentication.";

//   switch (error) {
//     case "Configuration":
//       errorMessage = "There is a problem with the server configuration.";
//       break;
//     case "AccessDenied":
//       errorMessage = "You do not have permission to sign in.";
//       break;
//     case "Verification":
//       errorMessage =
//         "The verification link may have expired or already been used.";
//       break;
//     case "Default":
//       errorMessage = "Unable to sign in.";
//       break;
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Authentication Error
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             {errorMessage}
//           </p>
//         </div>
//         <div className="text-center">
//           <Link
//             href="/auth/signin"
//             className="font-medium text-indigo-600 hover:text-indigo-500"
//           >
//             Return to sign in
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
