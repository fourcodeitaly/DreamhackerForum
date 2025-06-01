// import { readFile } from "fs/promises";

// // Define the interface for the university ranking data
// interface University {
//   index: number;
//   rank: number;
//   institution: string;
//   location: string;
// }

// // Function to parse the CSV file
// async function parseQSWorldRankings(filePath: string): Promise<University[]> {
//   try {
//     // Read the CSV file
//     const fileContent = await readFile(filePath, "utf-8");

//     // Split the content into lines and remove empty lines
//     const lines = fileContent.split("\n").filter((line) => line.trim() !== "");

//     // Initialize the array to store parsed data
//     const universities: University[] = [];

//     // Skip the header line and process each data line
//     for (let i = 1; i < lines.length; i++) {
//       // Split the line by tabs (assuming tab-separated values as shown in the input)
//       const [index, rank, institution, location] = lines[i]
//         .split("\t")
//         .map((item) => item.trim());

//       // Create a university object
//       const university: University = {
//         index: parseInt(index),
//         rank: parseInt(rank),
//         institution,
//         location,
//       };

//       // Add to the array
//       universities.push(university);
//     }

//     return universities;
//   } catch (error) {
//     console.error("Error reading or parsing the CSV file:", error);
//     return [];
//   }
// }

// // Function to display the parsed data
// function displayRankings(universities: University[]): void {
//   console.log("2025 QS World University Rankings:");
//   universities.forEach((university) => {
//     console.log(
//       `Index: ${university.index}, Rank: ${university.rank}, Institution: ${university.institution}, Location: ${university.location}`
//     );
//   });
// }

// // Main function to execute the script
// async function main() {
//   const filePath = "qs_rankings_2025.csv";
//   const universities = await parseQSWorldRankings(filePath);

//   if (universities.length > 0) {
//     displayRankings(universities);
//   } else {
//     console.log("No data was parsed from the CSV file.");
//   }
// }

// // Run the script
// main();
