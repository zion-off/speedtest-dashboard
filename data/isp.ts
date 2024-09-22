import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

// Function to fetch and sort companies from Firestore
export const fetchCompanies = async (): Promise<string[]> => {
  const companies: string[] = [];
  const collectionRef = collection(db, "companies");

  try {
    const q = query(collectionRef, orderBy("name", "asc"));
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      const companyData = doc.data();
      if (companyData?.name) {
        companies.push(companyData.name);
      }
    });
    return companies;
  } catch (error) {
    console.error("Error fetching companies from Firestore:", error);
    return [];
  }
};
