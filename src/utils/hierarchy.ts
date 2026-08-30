// Railway Zones and Administrative Hierarchy Definitions for Rail Gate Status

export interface RailwayZone {
  code: string;
  name: string;
  headquarters: string;
  divisions: string[];
  primaryStates: string[];
}

export const RAILWAY_ZONES: RailwayZone[] = [
  {
    code: "SCR",
    name: "South Central Railway",
    headquarters: "Secunderabad",
    divisions: ["Vijayawada (BZA)", "Guntur (GNT)", "Secunderabad (SC)", "Hyderabad (HYB)", "Guntakal (GTL)", "Nanded (NED)"],
    primaryStates: ["Andhra Pradesh", "Telangana", "Karnataka", "Maharashtra"],
  },
  {
    code: "SR",
    name: "Southern Railway",
    headquarters: "Chennai",
    divisions: ["Chennai (MAS)", "Tiruchirappalli (TPJ)", "Madurai (MDU)", "Salem (SA)", "Palakkad (PGT)", "Thiruvananthapuram (TVC)"],
    primaryStates: ["Tamil Nadu", "Kerala", "Andhra Pradesh", "Puducherry"],
  },
  {
    code: "ECoR",
    name: "East Coast Railway",
    headquarters: "Bhubaneswar",
    divisions: ["Waltair (WAT)", "Khurda Road (KUR)", "Sambalpur (SBP)"],
    primaryStates: ["Andhra Pradesh", "Odisha", "Chhattisgarh"],
  },
  {
    code: "SWR",
    name: "South Western Railway",
    headquarters: "Hubballi",
    divisions: ["Bengaluru (SBC)", "Mysuru (MYS)", "Hubballi (UBL)"],
    primaryStates: ["Karnataka", "Andhra Pradesh", "Goa"],
  },
  {
    code: "CR",
    name: "Central Railway",
    headquarters: "Mumbai CSMT",
    divisions: ["Mumbai (CSMT)", "Pune (PUN)", "Solapur (SUR)", "Bhusawal (BSL)", "Nagpur (NGP)"],
    primaryStates: ["Maharashtra", "Karnataka", "Madhya Pradesh"],
  },
  {
    code: "WR",
    name: "Western Railway",
    headquarters: "Mumbai Churchgate",
    divisions: ["Mumbai Central (BCT)", "Vadodara (BRC)", "Ratlam (RTM)", "Ahmedabad (ADI)", "Rajkot (RJT)", "Bhavnagar (BVP)"],
    primaryStates: ["Gujarat", "Maharashtra", "Rajasthan", "Madhya Pradesh"],
  },
  {
    code: "NR",
    name: "Northern Railway",
    headquarters: "New Delhi",
    divisions: ["Delhi (DLI)", "Ambala (UMB)", "Firozpur (FZR)", "Lucknow (LKO)", "Moradabad (MB)"],
    primaryStates: ["Delhi", "Punjab", "Haryana", "Uttar Pradesh", "Himachal Pradesh", "Jammu and Kashmir"],
  },
];

export const STATE_DISTRICT_TOWNS: Record<string, Record<string, string[]>> = {
  "Andhra Pradesh": {
    "Bapatla": [
      "Bapatla",
      "Chirala",
      "Vetapalem",
      "Repalle",
      "Karlapalem",
      "Karamchedu",
      "Appikatla",
      "Tsundur",
    ],
    "Guntur": [
      "Guntur City",
      "Tenali",
      "Mangalagiri",
      "Ponnur",
      "Sattenapalle",
      "Tadikonda",
    ],
    "Prakasam": [
      "Ongole",
      "Singarayakonda",
      "Tangutur",
      "Kandukur",
      "Addanki",
      "Markapur",
    ],
    "Krishna": [
      "Vijayawada",
      "Machilipatnam",
      "Gudivada",
      "Nuzvid",
      "Vuyyuru",
    ],
  },
  "Telangana": {
    "Hyderabad": ["Secunderabad", "Begumpet", "Kacheguda", "Nampally", "Sanathnagar"],
    "Warangal": ["Warangal", "Kazipet", "Jangaon", "Mahabubabad"],
    "Rangareddy": ["Moula Ali", "Cherlapally", "Ghatkesar", "Shadnagar"],
  },
  "Tamil Nadu": {
    "Chennai": ["Chennai Central", "Egmore", "Tambaram", "Perambur", "Avadi"],
    "Tiruvallur": ["Tiruvallur", "Arakkonam Junction", "Gummidipoondi"],
  },
  "Karnataka": {
    "Bengaluru Urban": ["Bengaluru City (SBC)", "Yesvantpur", "Bengaluru Cantt", "Whitefield", "K.R. Puram"],
  },
};

// Helper function to resolve primary zone for a state & district
export function getDefaultZoneForLocation(state?: string, district?: string): { zone: string; division: string } {
  if (state === "Andhra Pradesh") {
    if (district === "Bapatla" || district === "Krishna") {
      return { zone: "South Central Railway (SCR)", division: "Vijayawada (BZA)" };
    }
    if (district === "Guntur") {
      return { zone: "South Central Railway (SCR)", division: "Guntur (GNT)" };
    }
    return { zone: "South Central Railway (SCR)", division: "Vijayawada (BZA)" };
  }
  if (state === "Telangana") {
    return { zone: "South Central Railway (SCR)", division: "Secunderabad (SC)" };
  }
  if (state === "Tamil Nadu") {
    return { zone: "Southern Railway (SR)", division: "Chennai (MAS)" };
  }
  if (state === "Karnataka") {
    return { zone: "South Western Railway (SWR)", division: "Bengaluru (SBC)" };
  }
  return { zone: "South Central Railway (SCR)", division: "Vijayawada (BZA)" };
}
