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
    code: "SCoR",
    name: "South Coast Railway",
    headquarters: "Visakhapatnam",
    divisions: ["Visakhapatnam (WAT)", "Vijayawada (BZA)", "Guntur (GNT)", "Guntakal (GTL)"],
    primaryStates: ["Andhra Pradesh", "Odisha", "Telangana"],
  },
  {
    code: "SR",
    name: "Southern Railway",
    headquarters: "Chennai",
    divisions: ["Chennai (MAS)", "Tiruchirappalli (TPJ)", "Madurai (MDU)", "Salem (SA)", "Palakkad (PGT)", "Thiruvananthapuram (TVC)"],
    primaryStates: ["Tamil Nadu", "Kerala", "Andhra Pradesh", "Puducherry", "Karnataka", "Andaman and Nicobar Islands", "Lakshadweep"],
  },
  {
    code: "SWR",
    name: "South Western Railway",
    headquarters: "Hubballi",
    divisions: ["Bengaluru (SBC)", "Mysuru (MYS)", "Hubballi (UBL)"],
    primaryStates: ["Karnataka", "Andhra Pradesh", "Goa", "Tamil Nadu", "Maharashtra"],
  },
  {
    code: "CR",
    name: "Central Railway",
    headquarters: "Mumbai CSMT",
    divisions: ["Mumbai (CSMT)", "Pune (PUN)", "Solapur (SUR)", "Bhusawal (BSL)", "Nagpur (NGP)"],
    primaryStates: ["Maharashtra", "Karnataka", "Madhya Pradesh", "Goa"],
  },
  {
    code: "WR",
    name: "Western Railway",
    headquarters: "Mumbai Churchgate",
    divisions: ["Mumbai Central (BCT)", "Vadodara (BRC)", "Ratlam (RTM)", "Ahmedabad (ADI)", "Rajkot (RJT)", "Bhavnagar (BVP)"],
    primaryStates: ["Gujarat", "Maharashtra", "Rajasthan", "Madhya Pradesh", "Dadra and Nagar Haveli and Daman and Diu"],
  },
  {
    code: "NR",
    name: "Northern Railway",
    headquarters: "New Delhi",
    divisions: ["Delhi (DLI)", "Ambala (UMB)", "Firozpur (FZR)", "Lucknow (LKO)", "Moradabad (MB)"],
    primaryStates: ["Delhi", "Punjab", "Haryana", "Uttar Pradesh", "Himachal Pradesh", "Jammu and Kashmir", "Ladakh", "Uttarakhand", "Chandigarh"],
  },
  {
    code: "NCR",
    name: "North Central Railway",
    headquarters: "Prayagraj",
    divisions: ["Prayagraj (PRYJ)", "Agra (AGC)", "Jhansi (JHS)"],
    primaryStates: ["Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Haryana", "Delhi"],
  },
  {
    code: "NER",
    name: "North Eastern Railway",
    headquarters: "Gorakhpur",
    divisions: ["Izzatnagar (IZN)", "Lucknow (LJN)", "Varanasi (BSB)"],
    primaryStates: ["Uttar Pradesh", "Bihar", "Uttarakhand"],
  },
  {
    code: "NFR",
    name: "Northeast Frontier Railway",
    headquarters: "Guwahati",
    divisions: ["Katihar (KIR)", "Alipurduar (APDJ)", "Rangiya (RNY)", "Lumding (LMG)", "Tinsukia (TSK)"],
    primaryStates: ["Assam", "West Bengal", "Bihar", "Tripura", "Nagaland", "Manipur", "Meghalaya", "Mizoram", "Arunachal Pradesh", "Sikkim"],
  },
  {
    code: "NWR",
    name: "North Western Railway",
    headquarters: "Jaipur",
    divisions: ["Jaipur (JP)", "Ajmer (AII)", "Bikaner (BKN)", "Jodhpur (JU)"],
    primaryStates: ["Rajasthan", "Gujarat", "Punjab", "Haryana", "Delhi"],
  },
  {
    code: "ER",
    name: "Eastern Railway",
    headquarters: "Kolkata",
    divisions: ["Howrah (HWH)", "Sealdah (SDAH)", "Asansol (ASN)", "Malda (MLDT)"],
    primaryStates: ["West Bengal", "Jharkhand", "Bihar"],
  },
  {
    code: "ECR",
    name: "East Central Railway",
    headquarters: "Hajipur",
    divisions: ["Danapur (DNR)", "Dhanbad (DHN)", "Pt. Deen Dayal Upadhyaya (DDU)", "Samastipur (SPJ)", "Sonpur (SEE)"],
    primaryStates: ["Bihar", "Jharkhand", "Uttar Pradesh", "Madhya Pradesh"],
  },
  {
    code: "ECoR",
    name: "East Coast Railway",
    headquarters: "Bhubaneswar",
    divisions: ["Khurda Road (KUR)", "Sambalpur (SBP)", "Waltair (WAT)"],
    primaryStates: ["Odisha", "Andhra Pradesh", "Chhattisgarh"],
  },
  {
    code: "SECR",
    name: "South East Central Railway",
    headquarters: "Bilaspur",
    divisions: ["Bilaspur (BSP)", "Raipur (R)", "Nagpur (NGP)"],
    primaryStates: ["Chhattisgarh", "Maharashtra", "Madhya Pradesh", "Odisha", "Telangana"],
  },
  {
    code: "SER",
    name: "South Eastern Railway",
    headquarters: "Kolkata",
    divisions: ["Adra (ADRA)", "Chakradharpur (CKP)", "Kharagpur (KGP)", "Ranchi (RNC)"],
    primaryStates: ["West Bengal", "Jharkhand", "Odisha", "Chhattisgarh"],
  },
  {
    code: "WCR",
    name: "West Central Railway",
    headquarters: "Jabalpur",
    divisions: ["Jabalpur (JBP)", "Bhopal (BPL)", "Kota (KOTA)"],
    primaryStates: ["Madhya Pradesh", "Rajasthan", "Uttar Pradesh"],
  },
  {
    code: "Metro",
    name: "Metro Railway Kolkata",
    headquarters: "Kolkata",
    divisions: ["Kolkata Metro"],
    primaryStates: ["West Bengal"],
  },
];

// Mapping of Railway Divisions to their constituent Districts
export const DIVISION_DISTRICTS_MAP: Record<string, string[]> = {
  // South Central Railway (SCR)
  "Vijayawada (BZA)": [
    "Krishna", "NTR", "Bapatla", "Prakasam", "West Godavari", "East Godavari", "Kakinada", "Eluru", "Konaseema"
  ],
  "Guntur (GNT)": [
    "Guntur", "Palnadu", "Bapatla", "Prakasam", "Nalgonda"
  ],
  "Secunderabad (SC)": [
    "Hyderabad", "Medchal-Malkajgiri", "Rangareddy", "Warangal", "Hanumakonda", "Khammam", "Nalgonda", "Bhadradri Kothagudem", "Mahabubabad", "Jangaon", "Karimnagar", "Peddapalli", "Yadadri Bhuvanagiri"
  ],
  "Hyderabad (HYB)": [
    "Hyderabad", "Medchal-Malkajgiri", "Rangareddy", "Mahbubnagar", "Nizamabad", "Kamareddy", "Medak", "Kurnool"
  ],
  "Guntakal (GTL)": [
    "Anantapur", "Sri Sathya Sai", "Kurnool", "Nandyal", "Kadapa", "Tirupati", "Chittoor", "Ballari", "Raichur"
  ],
  "Nanded (NED)": [
    "Nanded", "Parbhani", "Hingoli", "Jalna", "Aurangabad", "Latur", "Nizamabad", "Adilabad", "Nirmal"
  ],

  // South Coast Railway (SCoR)
  "Visakhapatnam (WAT)": [
    "Visakhapatnam", "Anakapalli", "Vizianagaram", "Srikakulam", "Kakinada", "East Godavari", "Koraput", "Rayagada"
  ],

  // Southern Railway (SR)
  "Chennai (MAS)": [
    "Chennai", "Tiruvallur", "Chengalpattu", "Kanchipuram", "Vellore", "Ranipet", "Tirupattur", "Nellore", "Chittoor", "Tirupati"
  ],
  "Tiruchirappalli (TPJ)": [
    "Tiruchirappalli", "Thanjavur", "Tiruvarur", "Nagapattinam", "Cuddalore", "Ariyalur", "Perambalur", "Pudukkottai", "Karaikal"
  ],
  "Madurai (MDU)": [
    "Madurai", "Dindigul", "Theni", "Virudhunagar", "Sivaganga", "Ramanathapuram", "Thoothukudi", "Tirunelveli", "Tenkasi"
  ],
  "Salem (SA)": [
    "Salem", "Erode", "Coimbatore", "Tiruppur", "Namakkal", "Dharmapuri", "Karur", "Nilgiris"
  ],
  "Palakkad (PGT)": [
    "Palakkad", "Kozhikode", "Malappuram", "Kannur", "Kasaragod", "Thrissur", "Coimbatore"
  ],
  "Thiruvananthapuram (TVC)": [
    "Thiruvananthapuram", "Kollam", "Alappuzha", "Pathanamthitta", "Kottayam", "Ernakulam", "Thrissur", "Kanyakumari", "Tirunelveli"
  ],

  // South Western Railway (SWR)
  "Bengaluru (SBC)": [
    "Bengaluru Urban", "Bengaluru Rural", "Ramanagara", "Tumakuru", "Kolar", "Chikkaballapura", "Mandya", "Dharmapuri", "Krishnagiri"
  ],
  "Mysuru (MYS)": [
    "Mysuru", "Hassan", "Chamarajanagar", "Mandya", "Shivamogga", "Chikkamagaluru", "Davanagere", "Haveri"
  ],
  "Hubballi (UBL)": [
    "Dharwad", "Belagavi", "Bagalkot", "Vijayapura", "Gadag", "Ballari", "Vijayanagara", "Uttara Kannada", "Haveri", "Koppal"
  ],

  // Central Railway (CR)
  "Mumbai (CSMT)": [
    "Mumbai", "Mumbai Suburban", "Thane", "Palghar", "Raigad", "Pune", "Nashik"
  ],
  "Pune (PUN)": [
    "Pune", "Satara", "Sangli", "Kolhapur", "Solapur", "Ahmednagar"
  ],
  "Solapur (SUR)": [
    "Solapur", "Ahmednagar", "Osmanabad", "Latur", "Kalaburagi", "Yadgir", "Vijayapura"
  ],
  "Bhusawal (BSL)": [
    "Jalgaon", "Nashik", "Dhule", "Nandurbar", "Buldhana", "Akola", "Amravati", "Burhanpur", "Khandwa"
  ],
  "Nagpur (NGP)": [
    "Nagpur", "Wardha", "Chandrapur", "Bhandara", "Gondia", "Amravati", "Yavatmal", "Betul", "Chhindwara"
  ],

  // Western Railway (WR)
  "Mumbai Central (BCT)": [
    "Mumbai", "Mumbai Suburban", "Thane", "Palghar", "Surat", "Navsari", "Valsad"
  ],
  "Vadodara (BRC)": [
    "Vadodara", "Anand", "Bharuch", "Narmada", "Panchmahal", "Dahod", "Kheda"
  ],
  "Ratlam (RTM)": [
    "Ratlam", "Ujjain", "Indore", "Dewas", "Mandsaur", "Neemuch", "Chittorgarh", "Dahod", "Jhabua"
  ],
  "Ahmedabad (ADI)": [
    "Ahmedabad", "Gandhinagar", "Mehsana", "Sabarkantha", "Banaskantha", "Patan", "Surendranagar"
  ],
  "Rajkot (RJT)": [
    "Rajkot", "Surendranagar", "Jamnagar", "Devbhumi Dwarka", "Morbi", "Junagadh"
  ],
  "Bhavnagar (BVP)": [
    "Bhavnagar", "Botad", "Amreli", "Junagadh", "Gir Somnath", "Porbandar"
  ],

  // Northern Railway (NR)
  "Delhi (DLI)": [
    "New Delhi", "Central Delhi", "North Delhi", "South Delhi", "Ghaziabad", "Gautam Buddha Nagar", "Gurugram", "Faridabad", "Panipat", "Sonipat", "Meerut"
  ],
  "Ambala (UMB)": [
    "Ambala", "Kurukshetra", "Karnal", "Yamunanagar", "Patiala", "Saharanpur", "Chandigarh", "Shimla", "Panchkula", "Ludhiana"
  ],
  "Firozpur (FZR)": [
    "Firozpur", "Amritsar", "Jalandhar", "Ludhiana", "Bathinda", "Gurdaspur", "Pathankot", "Jammu", "Srinagar"
  ],
  "Lucknow (LKO)": [
    "Lucknow", "Rae Bareli", "Amethi", "Ayodhya", "Sultanpur", "Pratapgarh", "Varanasi", "Jaunpur", "Barabanki", "Unnao"
  ],
  "Moradabad (MB)": [
    "Moradabad", "Bareilly", "Rampur", "Shahjahanpur", "Bijnor", "Haridwar", "Dehradun"
  ],

  // North Central Railway (NCR)
  "Prayagraj (PRYJ)": [
    "Prayagraj", "Fatehpur", "Kanpur Nagar", "Kanpur Dehat", "Kaushambi", "Mirzapur", "Aligarh"
  ],
  "Agra (AGC)": [
    "Agra", "Mathura", "Firozabad", "Bharatpur", "Dholpur"
  ],
  "Jhansi (JHS)": [
    "Jhansi", "Lalitpur", "Gwalior", "Morena", "Datia", "Shivpuri", "Banda", "Mahoba", "Jalaun"
  ],

  // North Eastern Railway (NER)
  "Izzatnagar (IZN)": [
    "Bareilly", "Pilibhit", "Badaun", "Kashipur", "Kathgodam", "Nainital", "Farrukhabad"
  ],
  "Lucknow (LJN)": [
    "Lucknow", "Sitapur", "Lakhimpur Kheri", "Bahraich", "Gonda", "Barabanki"
  ],
  "Varanasi (BSB)": [
    "Varanasi", "Gorakhpur", "Deoria", "Ballia", "Mau", "Azamgarh", "Ghazipur", "Chhapra", "Siwan"
  ],

  // East Central Railway (ECR)
  "Danapur (DNR)": [
    "Patna", "Nalanda", "Bhojpur", "Buxar", "Rohtas", "Kaimur", "Jehanabad", "Gaya", "Nawada"
  ],
  "Dhanbad (DHN)": [
    "Dhanbad", "Bokaro", "Giridih", "Hazaribagh", "Koderma", "Singrauli"
  ],
  "Pt. Deen Dayal Upadhyaya (DDU)": [
    "Chandauli", "Varanasi", "Mirzapur", "Sonbhadra", "Kaimur", "Rohtas", "Gaya"
  ],
  "Samastipur (SPJ)": [
    "Samastipur", "Darbhanga", "Madhubani", "Muzaffarpur", "Sitamarhi", "Champaran"
  ],
  "Sonpur (SEE)": [
    "Saran", "Vaishali", "Muzaffarpur", "Begusarai", "Khagaria", "Samastipur"
  ],

  // Eastern Railway (ER)
  "Howrah (HWH)": [
    "Kolkata", "Howrah", "Hooghly", "Purba Bardhaman", "Birbhum"
  ],
  "Sealdah (SDAH)": [
    "Kolkata", "North 24 Parganas", "South 24 Parganas", "Nadia", "Murshidabad"
  ],
  "Asansol (ASN)": [
    "Paschim Bardhaman", "Purba Bardhaman", "Dhanbad", "Deoghar", "Dumka", "Jamtara"
  ],
  "Malda (MLDT)": [
    "Malda", "Murshidabad", "Sahibganj", "Pakur", "Bhagalpur"
  ],

  // East Coast Railway (ECoR)
  "Khurda Road (KUR)": [
    "Khordha", "Puri", "Cuttack", "Ganjam", "Balasore", "Bhadrak", "Jajpur", "Jagatsinghpur", "Kendrapara", "Srikakulam"
  ],
  "Sambalpur (SBP)": [
    "Sambalpur", "Bargarh", "Jharsuguda", "Balangir", "Titilagarh", "Rayagada", "Koraput"
  ],
  "Waltair (WAT)": [
    "Visakhapatnam", "Vizianagaram", "Srikakulam", "Koraput", "Rayagada"
  ],

  // South East Central Railway (SECR)
  "Bilaspur (BSP)": [
    "Bilaspur", "Korba", "Janjgir-Champa", "Raigarh", "Anuppur", "Shahdol"
  ],
  "Raipur (R)": [
    "Raipur", "Durg", "Rajnandgaon", "Mahasamund", "Baloda Bazar"
  ],

  // South Eastern Railway (SER)
  "Adra (ADRA)": [
    "Purulia", "Bankura", "Paschim Bardhaman", "Bokaro", "Dhanbad"
  ],
  "Chakradharpur (CKP)": [
    "East Singhbhum", "West Singhbhum", "Saraikela Kharsawan", "Sundargarh", "Jharsuguda"
  ],
  "Kharagpur (KGP)": [
    "Paschim Medinipur", "Purba Medinipur", "Jhargram", "Howrah", "Balasore", "Mayurbhanj"
  ],
  "Ranchi (RNC)": [
    "Ranchi", "Ramgarh", "Lohardaga", "Gumla", "Bokaro"
  ],

  // West Central Railway (WCR)
  "Jabalpur (JBP)": [
    "Jabalpur", "Katni", "Satna", "Rewa", "Damoh", "Sagar", "Narsinghpur"
  ],
  "Bhopal (BPL)": [
    "Bhopal", "Sehore", "Raisen", "Vidisha", "Hoshangabad", "Itarsi", "Betul", "Guna"
  ],
  "Kota (KOTA)": [
    "Kota", "Bundi", "Baran", "Jhalawar", "Sawai Madhopur", "Bharatpur", "Mathura"
  ],

  // North Western Railway (NWR)
  "Jaipur (JP)": [
    "Jaipur", "Dausa", "Alwar", "Sikar", "Jhunjhunu", "Rewari"
  ],
  "Ajmer (AII)": [
    "Ajmer", "Bhilwara", "Udaipur", "Chittorgarh", "Rajsamand", "Pali", "Sirohi", "Abu Road"
  ],
  "Bikaner (BKN)": [
    "Bikaner", "Sri Ganganagar", "Hanumangarh", "Churu", "Hisar", "Sirsa"
  ],
  "Jodhpur (JU)": [
    "Jodhpur", "Pali", "Barmer", "Jaisalmer", "Nagaur", "Jalore"
  ],

  // Northeast Frontier Railway (NFR)
  "Katihar (KIR)": [
    "Katihar", "Purnia", "Araria", "Kishanganj", "Siliguri", "Jalpaiguri", "Darjeeling"
  ],
  "Alipurduar (APDJ)": [
    "Alipurduar", "Jalpaiguri", "Cooch Behar", "Kokrajhar", "Bongaigaon"
  ],
  "Rangiya (RNY)": [
    "Kamrup", "Kamrup Metropolitan", "Baksa", "Barpeta", "Nalbari", "Darrang", "Sonitpur"
  ],
  "Lumding (LMG)": [
    "Nagaon", "Hojai", "Karbi Anglong", "Dima Hasao", "Cachar", "Hailakandi", "Karimganj", "Dimapur"
  ],
  "Tinsukia (TSK)": [
    "Tinsukia", "Dibrugarh", "Sivasagar", "Jorhat", "Golaghat"
  ],

  // Metro
  "Kolkata Metro": [
    "Kolkata", "North 24 Parganas", "South 24 Parganas", "Howrah"
  ],
};

export const STATE_DISTRICT_TOWNS: Record<string, Record<string, string[]>> = {
  "Andhra Pradesh": {
    "Bapatla": ["Bapatla", "Chirala", "Vetapalem", "Repalle", "Karlapalem", "Karamchedu", "Appikatla", "Tsundur", "Pittalavanipalem", "Nizampatnam"],
    "Guntur": ["Guntur City", "Tenali", "Mangalagiri", "Ponnur", "Sattenapalle", "Tadikonda", "Chebrolu", "Prathipadu", "Duggirala", "Kollipara"],
    "Krishna": ["Machilipatnam", "Gudivada", "Nuzvid", "Vuyyuru", "Pedana", "Avanigadda", "Pamarru", "Gannavaram"],
    "NTR": ["Vijayawada", "Jaggayyapeta", "Nandigama", "Tiruvuru", "Mylavaram", "Ibrahimpatnam"],
    "Prakasam": ["Ongole", "Singarayakonda", "Tangutur", "Kandukur", "Addanki", "Markapur", "Chimakurthy", "Giddalur", "Podili", "Kanigiri"],
    "Visakhapatnam": ["Visakhapatnam City", "Anakapalle", "Bheemunipatnam", "Gajuwaka", "Pendurthi", "Simhachalam", "Duvvada"],
    "Anakapalli": ["Anakapalle", "Chodavaram", "Elamanchili", "Narsipatnam", "Payakaraopeta", "Kasimkota"],
    "Tirupati": ["Tirupati", "Srikalahasti", "Gudur", "Sullurpeta", "Venkatagiri", "Renigunta", "Chandragiri"],
    "Kurnool": ["Kurnool City", "Adoni", "Yemmiganur", "Dhone", "Kodumur", "Pattikonda"],
    "East Godavari": ["Rajahmundry", "Kovvur", "Nidadavole", "Korukonda", "Anaparthi"],
    "West Godavari": ["Bhimavaram", "Tadepalligudem", "Tanuku", "Palakollu", "Narasapuram"],
    "Kakinada": ["Kakinada City", "Samalkot", "Pithapuram", "Tuni", "Peddapuram"],
    "Palnadu": ["Narasaraopet", "Chilakaluripet", "Vinukonda", "Macherla", "Piduguralla"],
    "Konaseema": ["Amalapuram", "Ravulapalem", "Razole", "Mummidivaram", "Mandapeta"],
    "Eluru": ["Eluru City", "Jangareddygudem", "Chintalapudi", "Kaikalur"],
    "Nellore": ["Nellore City", "Kavali", "Atmakur", "Kovur", "Buchireddypalem"],
    "Kadapa": ["Kadapa City", "Proddatur", "Jammalamadugu", "Pulivendula", "Badvel", "Rayachoti"],
    "Anantapur": ["Anantapur City", "Guntakal", "Tadipatri", "Dharmavaram", "Kalyandurg"],
    "Chittoor": ["Chittoor City", "Nagari", "Palamaner", "Kuppam", "Punganur"],
    "Srikakulam": ["Srikakulam City", "Amadalavalasa", "Palasa", "Narasannapeta", "Tekkali"],
    "Vizianagaram": ["Vizianagaram City", "Bobbili", "Salur", "Cheepurupalli", "Gajapathinagaram"],
    "Nandyal": ["Nandyal City", "Allagadda", "Banaganapalle", "Nandikotkur", "Atmakur"],
    "Sri Sathya Sai": ["Puttaparthi", "Hindupur", "Kadiri", "Penukonda", "Madakasira"],
  },
  "Telangana": {
    "Hyderabad": ["Secunderabad", "Begumpet", "Kacheguda", "Nampally", "Sanathnagar", "Sitaphalmandi", "Falaknuma", "Charlapalli"],
    "Rangareddy": ["Moula Ali", "Cherlapally", "Ghatkesar", "Shadnagar", "Shamshabad", "Rajendranagar", "Ibrahimpatnam"],
    "Medchal-Malkajgiri": ["Malkajgiri", "Medchal", "Kukatpally", "Alwal", "Quthbullapur", "Balanagar"],
    "Warangal": ["Warangal City", "Kazipet", "Narsampet", "Wardhannapet"],
    "Hanumakonda": ["Hanumakonda", "Kazipet Junction", "Hasanparthy"],
    "Karimnagar": ["Karimnagar City", "Huzurabad", "Jammikunta", "Choppadandi"],
    "Khammam": ["Khammam City", "Madhira", "Sathupalli", "Wyra", "Kothagudem"],
    "Nizamabad": ["Nizamabad City", "Bodhan", "Armoor", "Banswada"],
    "Nalgonda": ["Nalgonda City", "Miryalaguda", "Devarakonda", "Nakrekal"],
    "Mahbubnagar": ["Mahbubnagar City", "Jadcherla", "Bhoothpur", "Devarkadra"],
    "Sangareddy": ["Sangareddy", "Patancheru", "Zahirabad", "Sadashivpet"],
    "Bhadradri Kothagudem": ["Kothagudem", "Bhadrachalam", "Yellandu", "Manuguru"],
    "Mahabubabad": ["Mahabubabad", "Dornakal", "Kesamudram", "Maripeda"],
    "Jangaon": ["Jangaon", "Palakurthi", "Station Ghanpur"],
    "Peddapalli": ["Peddapalli", "Ramagundam", "Godavarikhani", "Manthani"],
    "Yadadri Bhuvanagiri": ["Bhongir", "Yadagirigutta", "Alair", "Choutuppal"],
    "Kamareddy": ["Kamareddy", "Banswada", "Yellareddy"],
    "Medak": ["Medak", "Narsapur", "Chegunta"],
    "Adilabad": ["Adilabad", "Boath", "Utnoor"],
    "Nirmal": ["Nirmal", "Bhainsa", "Khanapur"],
  },
  "Tamil Nadu": {
    "Chennai": ["Chennai Central", "Egmore", "Tambaram", "Perambur", "Avadi", "Guindy", "T. Nagar", "Mylapore"],
    "Tiruvallur": ["Tiruvallur", "Arakkonam Junction", "Gummidipoondi", "Ponneri", "Pattabiram"],
    "Chengalpattu": ["Chengalpattu", "Tambaram", "Pallavaram", "Chromepet", "Mahabalipuram"],
    "Kanchipuram": ["Kanchipuram", "Sriperumbudur", "Walajabad"],
    "Vellore": ["Vellore", "Katpadi Junction", "Gudiyatham"],
    "Ranipet": ["Ranipet", "Arakkonam", "Walajah", "Arcot"],
    "Tirupattur": ["Tirupattur", "Jolarpettai Junction", "Vaniyambadi", "Ambur"],
    "Coimbatore": ["Coimbatore Junction", "Pollachi", "Mettupalayam", "Sulur", "Podanur"],
    "Madurai": ["Madurai Junction", "Melur", "Usilampatti", "Thirumangalam", "Vadipatti"],
    "Tiruchirappalli": ["Tiruchirappalli Junction (TPJ)", "Srirangam", "Golden Rock", "Manapparai", "Thuvakudi"],
    "Salem": ["Salem Junction", "Attur", "Mettur", "Omalur", "Sankari"],
    "Erode": ["Erode Junction", "Gobichettipalayam", "Bhavani", "Perundurai"],
    "Tiruppur": ["Tiruppur", "Avinashi", "Dharapuram", "Kangeyam", "Udumalaipettai"],
    "Namakkal": ["Namakkal", "Rasipuram", "Tiruchengode", "Paramathi Velur"],
    "Dharmapuri": ["Dharmapuri", "Harur", "Palacode", "Pennagaram"],
    "Krishnagiri": ["Krishnagiri", "Hosur", "Pochampalli", "Denkanikottai"],
    "Thanjavur": ["Thanjavur", "Kumbakonam", "Papanasam", "Pattukkottai"],
    "Tiruvarur": ["Tiruvarur", "Mannargudi", "Nannilam", "Thiruthuraipoondi"],
    "Nagapattinam": ["Nagapattinam", "Velankanni", "Vedaranyam", "Kilvelur"],
    "Cuddalore": ["Cuddalore", "Chidambaram", "Panruti", "Virudhachalam"],
    "Dindigul": ["Dindigul", "Palani", "Kodaikanal", "Natham"],
    "Theni": ["Theni", "Periyakulam", "Bodinayakanur", "Cumbum"],
    "Virudhunagar": ["Virudhunagar", "Sivakasi", "Rajapalayam", "Srivilliputhur"],
    "Sivaganga": ["Sivaganga", "Karaikudi", "Manamadurai", "Devakottai"],
    "Ramanathapuram": ["Ramanathapuram", "Rameswaram", "Paramakudi", "Mudukulathur"],
    "Thoothukudi": ["Thoothukudi", "Kovilpatti", "Tiruchendur", "Srivaikuntam"],
    "Tirunelveli": ["Tirunelveli", "Palayamkottai", "Ambasamudram", "Nanguneri"],
    "Tenkasi": ["Tenkasi", "Sankarankovil", "Kadayanallur", "Courtallam"],
    "Kanyakumari": ["Nagercoil", "Kanyakumari", "Padmanabhapuram", "Thuckalay"],
    "Nilgiris": ["Udhagamandalam (Ooty)", "Coonoor", "Kotagiri", "Gudalur"],
    "Karur": ["Karur", "Kulithalai", "Aravakurichi"],
  },
  "Karnataka": {
    "Bengaluru Urban": ["Bengaluru City (SBC)", "Yesvantpur (YPR)", "Bengaluru Cantt (BNC)", "Whitefield", "K.R. Puram", "Yelahanka", "Hebbal"],
    "Bengaluru Rural": ["Doddaballapura", "Devanahalli", "Hosakote", "Nelamangala"],
    "Ramanagara": ["Ramanagara", "Channapatna", "Kanakapura", "Magadi"],
    "Tumakuru": ["Tumakuru", "Tiptur", "Kunigal", "Sira", "Gubbi"],
    "Kolar": ["Kolar", "Bangarapet", "KGF (Kolar Gold Fields)", "Malur"],
    "Chikkaballapura": ["Chikkaballapura", "Gauribidanur", "Chintamani", "Sidlaghatta"],
    "Mysuru": ["Mysuru City", "Nanjangud", "Hunsur", "T. Narasipura", "K.R. Nagar"],
    "Hassan": ["Hassan", "Arsikere", "Channarayapatna", "Sakleshpur", "Holenarasipura"],
    "Chamarajanagar": ["Chamarajanagar", "Kollegal", "Gundlupet", "Yelandur"],
    "Mandya": ["Mandya", "Maddur", "Pandavapura", "Srirangapatna", "Malavalli"],
    "Shivamogga": ["Shivamogga", "Bhadravati", "Sagar", "Shikaripura", "Thirthahalli"],
    "Chikkamagaluru": ["Chikkamagaluru", "Kadur", "Tarikere", "Mudigere", "Koppa"],
    "Davanagere": ["Davanagere", "Harihar", "Channagiri", "Honnali"],
    "Dharwad": ["Hubballi (Hubli)", "Dharwad City", "Navalgund", "Kalghatgi", "Kundgol"],
    "Belagavi": ["Belagavi City", "Gokak", "Chikkodi", "Bailhongal", "Athani", "Nipani"],
    "Bagalkot": ["Bagalkot", "Badami", "Jamkhandi", "Mudhol", "Ilkal"],
    "Vijayapura": ["Vijayapura", "Basavana Bagewadi", "Indi", "Muddebihal", "Sindagi"],
    "Gadag": ["Gadag-Betageri", "Ron", "Shirhatti", "Nargund", "Mundargi"],
    "Ballari": ["Ballari City", "Hosapete (Hampi)", "Sandur", "Siruguppa", "Kampli"],
    "Vijayanagara": ["Hosapete", "Hampi", "Kudligi", "Hagaribommanahalli", "Harapanahalli"],
    "Uttara Kannada": ["Karwar", "Kumta", "Bhatkal", "Sirsi", "Ankola", "Dandeli"],
    "Haveri": ["Haveri", "Ranebennur", "Byadgi", "Hirekerur", "Hangal"],
    "Koppal": ["Koppal", "Gangavathi", "Kushtagi", "Yelburga"],
    "Kalaburagi": ["Kalaburagi (Gulbarga)", "Sedam", "Wadi", "Shahabad", "Afzalpur", "Chittapur"],
    "Yadgir": ["Yadgir", "Shahapur", "Shorapur", "Gurmitkal"],
    "Raichur": ["Raichur", "Manvi", "Sindhanur", "Devadurga", "Lingasugur"],
    "Dakshina Kannada": ["Mangaluru Central", "Mangaluru Junction", "Bantwal", "Puttur", "Belthangady", "Sullia"],
    "Udupi": ["Udupi", "Kundapura", "Karkala", "Manipal", "Byndoor"],
  },
  "Maharashtra": {
    "Mumbai": ["Mumbai CSMT", "Churchgate", "Dadar", "Bandra", "Kurla", "Andheri", "Borivali", "Marine Lines"],
    "Mumbai Suburban": ["Andheri", "Borivali", "Bandra", "Ghatkopar", "Kurla", "Mulund", "Malad", "Kandivali"],
    "Thane": ["Thane", "Kalyan", "Dombivli", "Ulhasnagar", "Bhiwandi", "Mumbra", "Diva"],
    "Palghar": ["Palghar", "Virar", "Vasai", "Dahanu", "Boisar", "Safale"],
    "Raigad": ["Panvel", "Karjat", "Alibag", "Roha", "Pen", "Mahad", "Khopoli"],
    "Pune": ["Pune Junction", "Shivajinagar", "Hadapsar", "Lonavala", "Daund", "Baramati", "Pimpri-Chinchwad"],
    "Satara": ["Satara", "Karad", "Phaltan", "Wai", "Mahabaleshwar"],
    "Sangli": ["Sangli", "Miraj Junction", "Islampur", "Tasgaon", "Vita"],
    "Kolhapur": ["Kolhapur (CSMT)", "Ichalkaranji", "Jaysingpur", "Kagal", "Gadhinglaj"],
    "Solapur": ["Solapur City", "Pandharpur", "Kurduvadi", "Barshi", "Akkalkot", "Mohol"],
    "Ahmednagar": ["Ahmednagar", "Kopargaon", "Shirdi", "Rahata", "Shrirampur", "Sangamner"],
    "Nashik": ["Nashik Road", "Manmad Junction", "Igatpuri", "Sinnar", "Malegaon", "Lasalgaon"],
    "Jalgaon": ["Jalgaon", "Bhusawal Junction", "Chalisgaon", "Amalner", "Pachora"],
    "Dhule": ["Dhule", "Shirpur", "Sakri", "Sindkheda"],
    "Nandurbar": ["Nandurbar", "Navapur", "Shahada", "Taloda"],
    "Buldhana": ["Buldhana", "Khamgaon", "Malkapur", "Shegaon", "Chikhli"],
    "Akola": ["Akola Junction", "Murtizapur", "Akot", "Balapur", "Telhara"],
    "Amravati": ["Amravati", "Badnera Junction", "Achalpur", "Chandur", "Morshi"],
    "Nagpur": ["Nagpur Junction", "Ajni", "Kamptee", "Umred", "Katol", "Ramtek", "Kalmeshwar"],
    "Wardha": ["Wardha Junction", "Sevagram", "Hinganghat", "Arvi", "Pulgaon"],
    "Chandrapur": ["Chandrapur", "Ballarpur Junction", "Warora", "Bhadravati", "Rajura"],
    "Bhandara": ["Bhandara Road", "Tumsar Road", "Pauni", "Sakoli"],
    "Gondia": ["Gondia Junction", "Tirora", "Goregaon", "Amgaon"],
    "Yavatmal": ["Yavatmal", "Pusad", "Umarkhed", "Wani", "Darwha"],
    "Nanded": ["Nanded City", "Mudkhed", "Degloor", "Mukhed", "Kinwat", "Loha"],
    "Parbhani": ["Parbhani", "Gangakhed", "Pathri", "Jintur", "Sailu"],
    "Hingoli": ["Hingoli", "Basmath", "Kalamnuri", "Sengaon"],
    "Jalna": ["Jalna", "Partur", "Ambad", "Bhokardan"],
    "Aurangabad": ["Chhatrapati Sambhajinagar (Aurangabad)", "Chikalthana", "Paithan", "Vaijapur", "Gangapur"],
    "Latur": ["Latur", "Udgir", "Ausa", "Nilanga", "Ahmedpur"],
    "Osmanabad": ["Dharashiv (Osmanabad)", "Tuljapur", "Omerga", "Kalamb", "Paranda"],
  },
  "Gujarat": {
    "Ahmedabad": ["Ahmedabad Junction (ADI)", "Sabarmati", "Maninagar", "Viramgam", "Sanand", "Dhandhuka"],
    "Gandhinagar": ["Gandhinagar Capital", "Kalol", "Dahegam", "Mansa"],
    "Mehsana": ["Mehsana", "Kadi", "Visnagar", "Unjha", "Vadnagar"],
    "Sabarkantha": ["Himatnagar", "Idar", "Prantij", "Khedbrahma"],
    "Banaskantha": ["Palanpur", "Deesa", "Dhanera", "Tharad"],
    "Patan": ["Patan", "Sidhpur", "Radhanpur", "Chanasma"],
    "Vadodara": ["Vadodara Junction (BRC)", "Makarpura", "Padra", "Dabhoi", "Karjan"],
    "Anand": ["Anand", "Khambhat", "Petlad", "Borsad", "Umreth"],
    "Bharuch": ["Bharuch Junction", "Ankleshwar", "Jambusar", "Amod", "Hansot"],
    "Narmada": ["Rajpipla", "Kevadiya (Ekta Nagar)", "Dediapada", "Tilakwada"],
    "Panchmahal": ["Godhra", "Halol", "Kalol", "Shehra"],
    "Dahod": ["Dahod", "Jhalod", "Devgadh Baria", "Limkheda"],
    "Kheda": ["Nadiad", "Kapadvanj", "Kheda", "Mahudha", "Kathlal"],
    "Surat": ["Surat City", "Udhna", "Bardoli", "Navsari", "Sachin", "Kim", "Kosamba"],
    "Navsari": ["Navsari", "Bilimora Junction", "Gandevi", "Chikhli", "Vansda"],
    "Valsad": ["Valsad", "Vapi", "Umbergaon", "Pardi", "Dharampur"],
    "Rajkot": ["Rajkot Junction", "Bhakti Nagar", "Gondal", "Morbi", "Jetpur", "Dhoraji"],
    "Surendranagar": ["Surendranagar", "Wadhwan", "Dhrangadhra", "Limbdi", "Chotila"],
    "Jamnagar": ["Jamnagar", "Hapa", "Dhrol", "Jodiya", "Jamjodhpur"],
    "Devbhumi Dwarka": ["Dwarka", "Khambhalia", "Okha", "Kalyanpur"],
    "Morbi": ["Morbi", "Wankaner", "Maliya", "Tankara", "Halvad"],
    "Bhavnagar": ["Bhavnagar Terminus", "Sihor", "Palitana", "Talaja", "Mahuva"],
    "Botad": ["Botad", "Gadhada", "Barwala", "Ranpur"],
    "Amreli": ["Amreli", "Savarkundla", "Bagasara", "Dhari", "Rajula"],
    "Junagadh": ["Junagadh Junction", "Keshod", "Manavadar", "Mangrol", "Visavadar"],
    "Gir Somnath": ["Veraval", "Somnath", "Talala", "Una", "Kodinar"],
    "Porbandar": ["Porbandar", "Ranavav", "Kutiyana"],
  },
  "Uttar Pradesh": {
    "Lucknow": ["Lucknow Charbagh", "Lucknow Junction (LJN)", "Alambagh", "Badshahnagar", "Gomti Nagar", "Manak Nagar"],
    "Varanasi": ["Varanasi Junction", "Banaras (Manduadih)", "Pt. Deen Dayal Upadhyaya (DDU)", "Kashi", "Shivpur"],
    "Prayagraj": ["Prayagraj Junction", "Prayagraj Chheoki", "Subedarganj", "Naini Junction", "Phaphamau", "Jhunsi"],
    "Kanpur Nagar": ["Kanpur Central", "Govindpuri", "Panki Dham", "Kalyanpur", "Rawatpur", "Chakeri"],
    "Kanpur Dehat": ["Rura", "Jhinjhak", "Akbarpur", "Rasulabad", "Derapur"],
    "Gorakhpur": ["Gorakhpur Junction", "Sahjanwa", "Chauri Chaura", "Kushinagar", "Pipraich"],
    "Agra": ["Agra Cantt", "Agra Fort", "Raja Ki Mandi", "Fatehabad", "Achhnera", "Etmadpur"],
    "Mathura": ["Mathura Junction", "Mathura Cantt", "Vrindavan", "Goverdhan", "Kosi Kalan"],
    "Firozabad": ["Firozabad", "Shikohabad", "Tundla Junction", "Jasrana", "Sirsaganj"],
    "Jhansi": ["Jhansi (VGLJ)", "Babina", "Mauranipur", "Moth", "Garautha"],
    "Lalitpur": ["Lalitpur", "Talbehat", "Mehroni", "Mahroni", "Pali"],
    "Bareilly": ["Bareilly Junction", "Bareilly City", "Izzatnagar", "Aonla", "Faridpur", "Baheri"],
    "Moradabad": ["Moradabad", "Chandausi", "Sambhal", "Kanth", "Bilari"],
    "Rampur": ["Rampur", "Bilaspur", "Milak", "Shahabad", "Tanda"],
    "Shahjahanpur": ["Shahjahanpur", "Tilhar", "Jalalabad", "Powayan"],
    "Bijnor": ["Bijnor", "Najibabad", "Nagina", "Chandpur", "Dhampur"],
    "Rae Bareli": ["Rae Bareli", "Lalganj", "Bachhrawan", "Salon", "Maharajganj"],
    "Amethi": ["Amethi", "Gauriganj", "Musafirkhana", "Tiloi"],
    "Ayodhya": ["Ayodhya Dham", "Ayodhya Cantt", "Rudauli", "Bhikapur", "Sohawal"],
    "Sultanpur": ["Sultanpur", "Kadipur", "Lambhua", "Jaisinghpur"],
    "Pratapgarh": ["Pratapgarh", "Kunda", "Patti", "Raniganj", "Lalganj"],
    "Jaunpur": ["Jaunpur Junction", "Shahganj", "Kerakat", "Machhlishahr", "Badlapur"],
    "Barabanki": ["Barabanki", "Ramsanehighat", "Haidergarh", "Fatehpur", "Nawabganj"],
    "Unnao": ["Unnao", "Shuklaganj", "Safipur", "Purwa", "Bangarmau"],
    "Fatehpur": ["Fatehpur", "Bindki", "Khaga", "Haswa"],
    "Kaushambi": ["Manjhanpur", "Chail", "Sirathu", "Bharwari"],
    "Mirzapur": ["Mirzapur", "Chunar Junction", "Vindhyachal", "Lalganj"],
    "Sonbhadra": ["Robertsganj", "Chopan", "Renukoot", "Anpara", "Shaktinagar"],
    "Chandauli": ["Pt. Deen Dayal Upadhyaya Nagar", "Chandauli", "Sakaldiha", "Chakia"],
    "Sitapur": ["Sitapur", "Biswan", "Mahmoodabad", "Sidhauli", "Laharpur"],
    "Lakhimpur Kheri": ["Lakhimpur", "Gola Gokarannath", "Mohammadi", "Nighasan"],
    "Bahraich": ["Bahraich", "Nanpara", "Jarwal", "Mahsi"],
    "Gonda": ["Gonda Junction", "Colonelganj", "Tarabganj", "Mankapur"],
    "Deoria": ["Deoria Sadar", "Bhatni Junction", "Salempur", "Rudrapur"],
    "Ballia": ["Ballia", "Rasra", "Bairia", "Belthara Road", "Bansdih"],
    "Mau": ["Mau Junction", "Muhammadabad", "Ghosi", "Madhuban"],
    "Azamgarh": ["Azamgarh", "Phoolpur", "Lalganj", "Sagri", "Mehnagar"],
    "Ghazipur": ["Ghazipur City", "Zamania", "Saidpur", "Mohammadabad"],
    "Pilibhit": ["Pilibhit", "Puranpur", "Bisalpur", "Barkhera"],
    "Badaun": ["Badaun", "Ujhani", "Bisauli", "Dataganj", "Sahaswan"],
    "Farrukhabad": ["Farrukhabad", "Fatehgarh", "Kaimganj", "Amritpur"],
    "Banda": ["Banda", "Atarra", "Baberu", "Naraini"],
    "Mahoba": ["Mahoba", "Charkhari", "Kulpahar"],
    "Jalaun": ["Orai", "Jalaun", "Konch", "Kalpi"],
    "Aligarh": ["Aligarh Junction", "Atrauli", "Khair", "Iglas", "Gabhana"],
    "Ghaziabad": ["Ghaziabad", "Modinagar", "Muradnagar", "Loni"],
    "Gautam Buddha Nagar": ["Noida", "Greater Noida", "Dadri", "Jewar"],
    "Meerut": ["Meerut City", "Meerut Cantt", "Sardhana", "Mawana"],
  },
  "Delhi": {
    "New Delhi": ["New Delhi Railway Station (NDLS)", "Connaught Place", "Barakhamba", "Chanakyapuri"],
    "Central Delhi": ["Old Delhi (DLI)", "Karol Bagh", "Pahar Ganj", "Daryaganj"],
    "North Delhi": ["Sarai Rohilla (DEE)", "Sabzi Mandi", "Narela", "Model Town", "Civil Lines"],
    "South Delhi": ["Hazrat Nizamuddin (NZM)", "Okhla", "Saket", "Hauz Khas", "Lajpat Nagar"],
    "East Delhi": ["Anand Vihar Terminal (ANVT)", "Preet Vihar", "Mayur Vihar", "Laxmi Nagar"],
    "West Delhi": ["Delhi Cantt", "Patel Nagar", "Punjabi Bagh", "Janakpuri", "Rajouri Garden"],
  },
  "West Bengal": {
    "Kolkata": ["Howrah Junction", "Sealdah", "Kolkata Terminal (Chitpur)", "Shalimar", "Santragachi", "Dum Dum", "Majerhat", "Ballygunge"],
    "Howrah": ["Howrah", "Bally", "Uluberia", "Bagnan", "Amta"],
    "Hooghly": ["Bandel Junction", "Serampore", "Chinsurah", "Chandannagar", "Tarakeswar", "Rishra"],
    "North 24 Parganas": ["Barrackpore", "Barasat", "Naihati", "Habra", "Basirhat", "Bangaon"],
    "South 24 Parganas": ["Sonarpur", "Baruipur", "Diamond Harbour", "Canning", "Kakdwip"],
    "Nadia": ["Ranaghat", "Krishnanagar", "Kalyani", "Santipur", "Nabadwip"],
    "Murshidabad": ["Berhampore", "Lalgola", "Jangipur", "Jiaganj", "Kandi"],
    "Paschim Bardhaman": ["Asansol Junction", "Durgapur", "Raniganj", "Andal", "Kulti", "Jamuria"],
    "Purba Bardhaman": ["Bardhaman Junction", "Katwa", "Kalna", "Memari"],
    "Birbhum": ["Bolpur Santiniketan", "Sainthia", "Rampurhat", "Suri"],
    "Malda": ["Malda Town", "Old Malda", "Gazole", "Chanchal", "Harischandrapur"],
    "Paschim Medinipur": ["Kharagpur Junction", "Midnapore", "Ghatal", "Debra"],
    "Purba Medinipur": ["Tamluk", "Haldia", "Digha", "Contai", "Panskura"],
    "Jhargram": ["Jhargram", "Gopiballavpur", "Belpahari"],
    "Purulia": ["Purulia", "Adra", "Raghunathpur", "Jhalda", "Balarampur"],
    "Bankura": ["Bankura", "Bishnupur", "Onda", "Khatra"],
    "Darjeeling": ["Darjeeling", "Siliguri Junction", "Kurseong", "Mirik"],
    "Jalpaiguri": ["Jalpaiguri", "New Jalpaiguri (NJP)", "Dhupguri", "Malbazar"],
    "Alipurduar": ["Alipurduar Junction", "New Alipurduar", "Falakata", "Birpara"],
    "Cooch Behar": ["Cooch Behar", "New Cooch Behar", "Dinhata", "Mathabhanga"],
  },
  "Bihar": {
    "Patna": ["Patna Junction", "Danapur", "Patliputra", "Rajendra Nagar Terminal", "Fatuha", "Bakhtiyarpur", "Mokama", "Bihta"],
    "Nalanda": ["Bihar Sharif", "Rajgir", "Islampur", "Hilsa", "Harnaut"],
    "Bhojpur": ["Ara (Arrah)", "Jagdishpur", "Piro", "Bihiya", "Koilwar"],
    "Buxar": ["Buxar", "Dumraon", "Brahmpur", "Itarhi"],
    "Rohtas": ["Sasaram", "Dehri on Sone", "Bikramganj", "Nokha"],
    "Kaimur": ["Bhabua", "Mohania (Bhabua Road)", "Kudra", "Ramgarh"],
    "Gaya": ["Gaya Junction", "Bodh Gaya", "Manpur", "Sherghati", "Tekari"],
    "Jehanabad": ["Jehanabad", "Makhdumpur", "Kako"],
    "Nawada": ["Nawada", "Rajauli", "Hisua", "Warisaliganj"],
    "Samastipur": ["Samastipur Junction", "Darbhanga", "Rosera", "Dalsinghsarai", "Pusa"],
    "Darbhanga": ["Darbhanga Junction", "Laheriasarai", "Benipur", "Baheri"],
    "Madhubani": ["Madhubani", "Jayanagar", "Jhanjharpur", "Benipatti"],
    "Muzaffarpur": ["Muzaffarpur Junction", "Motipur", "Kanti", "Sakra"],
    "Sitamarhi": ["Sitamarhi", "Bairgania", "Pupri", "Dumra"],
    "Champaran": ["Motihari", "Bettiah", "Narkatiaganj", "Bagaha", "Raxaul"],
    "Saran": ["Chhapra", "Sonpur Junction", "Dighwara", "Marhaura"],
    "Vaishali": ["Hajipur Junction", "Lalganj", "Mahnar", "Mahua"],
    "Begusarai": ["Begusarai", "Barauni Junction", "Teghra", "Bakhri"],
    "Khagaria": ["Khagaria", "Mansi", "Gogri", "Parbatta"],
    "Katihar": ["Katihar Junction", "Manihari", "Barsoi", "Karhagola Road"],
    "Purnia": ["Purnia Junction", "Banmankhi", "Kasba", "Dhamdaha"],
    "Araria": ["Araria", "Forbesganj", "Jogbani", "Raniganj"],
    "Kishanganj": ["Kishanganj", "Thakurganj", "Bahadurganj"],
    "Bhagalpur": ["Bhagalpur Junction", "Kahalgon", "Naugachia", "Sultanganj"],
    "Dhanbad": ["Dhanbad Junction", "Gomoh", "Katrasgarh", "Jharia"],
  },
  "Odisha": {
    "Khordha": ["Bhubaneswar", "Khurda Road Junction", "Jatni", "Balipatna"],
    "Puri": ["Puri City", "Konark", "Pipili", "Nimapada", "Delang"],
    "Cuttack": ["Cuttack Junction", "Choudwar", "Athagarh", "Salepur"],
    "Ganjam": ["Brahmapur (Berhampur)", "Chhatrapur", "Gopalpur", "Aska", "Bhanjanagar"],
    "Balasore": ["Balasore", "Jaleswar", "Soro", "Basta"],
    "Bhadrak": ["Bhadrak", "Dhamra", "Chandbali", "Basudevpur"],
    "Jajpur": ["Jajpur Keonjhar Road", "Jajpur Town", "Chandikhole"],
    "Jagatsinghpur": ["Paradeep", "Jagatsinghpur", "Kujang", "Tirtol"],
    "Kendrapara": ["Kendrapara", "Pattamundai", "Aul", "Rajkanika"],
    "Sambalpur": ["Sambalpur Junction", "Sambalpur City", "Burla", "Rairakhol", "Kuchinda"],
    "Bargarh": ["Bargarh Road", "Barpali", "Attabira", "Padampur"],
    "Jharsuguda": ["Jharsuguda Junction", "Belpahar", "Brajarajnagar"],
    "Balangir": ["Balangir", "Titilagarh Junction", "Kantabanji", "Patnagarh"],
    "Rayagada": ["Rayagada", "Gunupur", "Muniguda", "Singapur Road"],
    "Koraput": ["Koraput", "Jeypore", "Damanjodi", "Sunabeda"],
    "Sundargarh": ["Rourkela Junction", "Sundargarh", "Rajgangpur", "Biramitrapur"],
    "Mayurbhanj": ["Baripada", "Rairangpur", "Karanjia", "Betnoti"],
  },
  "Rajasthan": {
    "Jaipur": ["Jaipur Junction", "Gandhinagar Jaipur", "Durgapura", "Phulera Junction", "Kishangarh Renwal", "Chomu"],
    "Dausa": ["Dausa", "Bandikui Junction", "Mahwa", "Lalsot"],
    "Alwar": ["Alwar Junction", "Rajgarh", "Khairthal", "Behror", "Tijara"],
    "Sikar": ["Sikar Junction", "Ringas Junction", "Fatehpur", "Laxmangarh", "Neem Ka Thana"],
    "Jhunjhunu": ["Jhunjhunu", "Nawalgarh", "Chirawa", "Khetri", "Pilani"],
    "Ajmer": ["Ajmer Junction", "Madar", "Kishangarh", "Beawar", "Nasirabad"],
    "Bhilwara": ["Bhilwara", "Gulabpura", "Mandal", "Shahpura"],
    "Udaipur": ["Udaipur City", "Rana Pratap Nagar", "Mavli Junction", "Fatehnagar"],
    "Chittorgarh": ["Chittorgarh Junction", "Chanderiya", "Nimbahera", "Kapasan"],
    "Rajsamand": ["Rajsamand (Kankroli)", "Nathdwara", "Amet", "Deogarh"],
    "Pali": ["Pali Marwar", "Falna", "Marwar Junction", "Sojat Road", "Rani"],
    "Sirohi": ["Abu Road", "Sirohi Road (Pindwara)", "Sheoganj", "Mount Abu"],
    "Bikaner": ["Bikaner Junction", "Lalgarh Junction", "Nokha", "Deshnoke", "Kolayat", "Lunkaransar"],
    "Sri Ganganagar": ["Sri Ganganagar", "Suratgarh Junction", "Raisinghnagar", "Anupgarh"],
    "Hanumangarh": ["Hanumangarh Junction", "Hanumangarh Town", "Nohar", "Bhadra", "Pilibanga"],
    "Churu": ["Churu", "Ratangarh Junction", "Sujangarh", "Sadulpur (Rajgarh)", "Sardarshahar"],
    "Jodhpur": ["Jodhpur Junction", "Bhagat Ki Kothi", "Luni Junction", "Bilara", "Piparcity", "Phalodi"],
    "Barmer": ["Barmer", "Balotra", "Baytu", "Uttarlai"],
    "Jaisalmer": ["Jaisalmer", "Pokaran", "Ramgarh"],
    "Nagaur": ["Nagaur", "Merta Road Junction", "Makrana Junction", "Degana Junction", "Didwana", "Ladnun"],
    "Jalore": ["Jalore", "Bhinmal", "Raniwara", "Ahore"],
    "Kota": ["Kota Junction", "Dakaniya Talav", "Ramganj Mandi", "Sogaria"],
    "Bundi": ["Bundi", "Keshoraipatan", "Indragarh", "Nainwa"],
    "Baran": ["Baran", "Chhabra Gugor", "Atru", "Antah"],
    "Jhalawar": ["Jhalawar City", "Bhawani Mandi", "Jhalrapatan", "Pirawa"],
    "Sawai Madhopur": ["Sawai Madhopur Junction", "Gangapur City", "Bonli", "Bamanwas"],
    "Bharatpur": ["Bharatpur Junction", "Bayana Junction", "Deeg", "Kaman", "Nadbai"],
    "Dholpur": ["Dholpur", "Bari", "Rajakhera", "Baseri"],
  },
  "Kerala": {
    "Thiruvananthapuram": ["Thiruvananthapuram Central (TVC)", "Kochuveli", "Neyyattinkara", "Varkala", "Kazhakkoottam"],
    "Kollam": ["Kollam Junction (QLN)", "Paravur", "Karunagappally", "Punalur", "Kottarakkara"],
    "Alappuzha": ["Alappuzha", "Chengannur", "Kayamkulam Junction", "Mavelikkara", "Cherthala", "Ambalapuzha"],
    "Pathanamthitta": ["Thiruvalla", "Adoor", "Pathanamthitta", "Ranni", "Konni"],
    "Kottayam": ["Kottayam", "Changanassery", "Vaikom Road", "Ettumanoor", "Pala"],
    "Ernakulam": ["Ernakulam Junction (ERS)", "Ernakulam Town (ERN)", "Aluva", "Angamaly", "Tripunithura", "Piravom Road"],
    "Thrissur": ["Thrissur", "Guruvayur", "Shoranur (Nearby)", "Chalakudi", "Irinjalakuda", "Wadakkanchery"],
    "Palakkad": ["Palakkad Junction (PGT)", "Palakkad Town", "Ottapalam", "Shoranur Junction", "Pattambi"],
    "Malappuram": ["Tirur", "Kuttippuram", "Parappanangadi", "Angadippuram", "Nilambur Road"],
    "Kozhikode": ["Kozhikode (Calicut)", "Ferok", "Koyilandy", "Vadakara"],
    "Kannur": ["Kannur", "Thalassery", "Payyanur", "Kannur South"],
    "Kasaragod": ["Kasaragod", "Kanhangad", "Nileshwar", "Uppala", "Kumbla"],
  },
  "Madhya Pradesh": {
    "Bhopal": ["Bhopal Junction", "Habibganj (Rani Kamlapati)", "Bairagarh (Sant Hirdaram Nagar)", "Misrod"],
    "Sehore": ["Sehore", "Ashta", "Ichhawar", "Budhni"],
    "Raisen": ["Raisen", "Mandi Bamora", "Gairatganj", "Begamganj"],
    "Vidisha": ["Vidisha", "Ganj Basoda", "Sanchi", "Kurwai"],
    "Hoshangabad": ["Narmadapuram (Hoshangabad)", "Itarsi Junction", "Pipariya", "Sohagpur"],
    "Betul": ["Betul", "Amla Junction", "Multai", "Ghoda Dongri"],
    "Guna": ["Guna", "Raghogarh", "Chhabra (Nearby)", "Aaron"],
    "Jabalpur": ["Jabalpur Junction", "Madan Mahal", "Sihora Road", "Patan", "Shahpura"],
    "Katni": ["Katni Junction", "Katni Murwara", "Katni South", "Sleemanabad", "Sihora"],
    "Satna": ["Satna Junction", "Maihar", "Nagod", "Birsinghpur"],
    "Rewa": ["Rewa", "Govindgarh", "Semariya", "Mangawan"],
    "Damoh": ["Damoh", "Patharia", "Hatta", "Patera"],
    "Sagar": ["Sagar", "Bina Junction", "Khurai", "Banda"],
    "Narsinghpur": ["Narsinghpur", "Gadarwara", "Kareli", "Gotegaon"],
    "Indore": ["Indore Junction", "Dr. Ambedkar Nagar (Mhow)", "Laxmibai Nagar", "Rau"],
    "Ujjain": ["Ujjain Junction", "Nagda Junction", "Tarana Road", "Khachrod"],
    "Dewas": ["Dewas", "Sonkatch", "Hatpiplya", "Kannod"],
    "Ratlam": ["Ratlam Junction", "Jaora", "Sailana", "Alot"],
    "Mandsaur": ["Mandsaur", "Piplia", "Sitamau", "Garoth"],
    "Neemuch": ["Neemuch", "Jawad", "Manasa", "Singoli"],
    "Gwalior": ["Gwalior Junction", "Dabra", "Birlanagar", "Ghatigaon"],
    "Morena": ["Morena", "Ambah", "Porsa", "Joura"],
    "Datia": ["Datia", "Seondha", "Bhander"],
    "Shivpuri": ["Shivpuri", "Kolaras", "Karera", "Pichhore"],
    "Chhindwara": ["Chhindwara Junction", "Parasia", "Sausar", "Junnardeo"],
    "Balaghat": ["Balaghat Junction", "Waraseoni", "Katangi", "Baihar"],
    "Burhanpur": ["Burhanpur", "Nepanagar", "Shahpur"],
    "Khandwa": ["Khandwa Junction", "Sanawad", "Omkareshwar Road", "Pandhana"],
    "Anuppur": ["Anuppur Junction", "Kotma", "Jaithari"],
    "Shahdol": ["Shahdol", "Burhar", "Beohari"],
    "Singrauli": ["Singrauli", "Bargawan", "Morwa", "Waidhan"],
    "Jhabua": ["Jhabua", "Meghnagar", "Thandla"],
  },
  "Chhattisgarh": {
    "Raipur": ["Raipur Junction", "Mandir Hasaud", "Abhanpur", "Tilda"],
    "Bilaspur": ["Bilaspur Junction", "Kota", "Takhatpur", "Masturi"],
    "Durg": ["Durg Junction", "Bhilai Nagar", "Bhilai Power House", "Patan"],
    "Rajnandgaon": ["Rajnandgaon", "Dongargarh", "Chhuikhadan"],
    "Korba": ["Korba", "Katghora", "Gevra Road", "Dipka"],
    "Janjgir-Champa": ["Champa Junction", "Janjgir Naila", "Akaltara", "Sakti"],
    "Raigarh": ["Raigarh", "Kharsia", "Gharghoda", "Sarangarh"],
    "Mahasamund": ["Mahasamund", "Bagbahra", "Saraipali", "Basna"],
    "Baloda Bazar": ["Baloda Bazar", "Bhatapara", "Kasdol", "Simga"],
  },
  "Jharkhand": {
    "Ranchi": ["Ranchi Junction", "Hatia", "Muri Junction", "Namkum"],
    "Dhanbad": ["Dhanbad Junction", "Gomoh (NSCB)", "Katrasgarh", "Jharia", "Kumardhubi"],
    "Bokaro": ["Bokaro Steel City", "Chandrapura Junction", "Bermo", "Tenughat"],
    "East Singhbhum": ["Tatanagar Junction (Jamshedpur)", "Ghatsila", "Chakulia", "Mosabani"],
    "West Singhbhum": ["Chakradharpur", "Chaibasa", "Jhinkpani", "Manoharpur"],
    "Saraikela Kharsawan": ["Sini Junction", "Saraikela", "Chandil Junction", "Kandra"],
    "Ramgarh": ["Ramgarh Cantt", "Barkakana Junction", "Patratu", "Gola"],
    "Giridih": ["Giridih", "Parasnath", "Madhupur (Nearby)", "Bagodar"],
    "Hazaribagh": ["Hazaribagh Town", "Hazaribagh Road", "Barkatha"],
    "Koderma": ["Koderma Junction", "Jhumri Telaiya", "Domchanch"],
    "Deoghar": ["Jasidih Junction", "Deoghar Junction", "Madhupur Junction"],
    "Dumka": ["Dumka", "Basukinath", "Jama", "Sarath"],
    "Jamtara": ["Jamtara", "Mihijam", "Chittaranjan (Nearby)"],
    "Sahibganj": ["Sahibganj", "Barharwa Junction", "Rajmahal"],
    "Pakur": ["Pakur", "Hiranpur", "Maheshpur"],
    "Lohardaga": ["Lohardaga", "Kisko", "Kuru"],
    "Gumla": ["Gumla", "Ranchi Road", "Sisai"],
  },
  "Punjab": {
    "Amritsar": ["Amritsar Junction", "Beas Junction", "Attari", "Majitha", "Ajnala"],
    "Ludhiana": ["Ludhiana Junction", "Khanna", "Jagraon", "Samrala", "Sahnewal"],
    "Jalandhar": ["Jalandhar City", "Jalandhar Cantt", "Phagwara (Nearby)", "Phillaur", "Nakodar"],
    "Patiala": ["Patiala", "Rajpura Junction", "Nabha", "Samana"],
    "Firozpur": ["Firozpur Cantt", "Firozpur City", "Zira", "Guru Har Sahai"],
    "Bathinda": ["Bathinda Junction", "Rampura Phul", "Talwandi Sabo", "Goniana"],
    "Gurdaspur": ["Gurdaspur", "Batala Junction", "Dera Baba Nanak"],
    "Pathankot": ["Pathankot Junction", "Pathankot Cantt (Chakki Bank)"],
  },
  "Haryana": {
    "Ambala": ["Ambala Cantt Junction", "Ambala City", "Barara", "Naraingarh"],
    "Kurukshetra": ["Kurukshetra Junction", "Thanesar", "Shahbad Markanda", "Pehowa"],
    "Karnal": ["Karnal", "Gharaunda", "Nilokheri", "Indri"],
    "Yamunanagar": ["Yamunanagar-Jagadhri", "Jagadhri Workshop", "Bilaspur"],
    "Panchkula": ["Kalka (Nearby)", "Pinjore", "Raipur Rani"],
    "Panipat": ["Panipat Junction", "Samalkha", "Israna"],
    "Sonipat": ["Sonipat", "Ganaur", "Murthal", "Gohana"],
    "Gurugram": ["Gurgaon Railway Station", "Garhi Harsaru", "Pataudi Road", "Sohna"],
    "Faridabad": ["Faridabad", "Ballabgarh", "Palwal (Nearby)", "Old Faridabad"],
    "Hisar": ["Hisar Junction", "Hansi", "Barwala", "Uklana"],
    "Sirsa": ["Sirsa", "Kalanwali", "Dabwali", "Ellenabad"],
    "Rewari": ["Rewari Junction", "Bawal", "Kosli", "Dharuhera"],
  },
  "Assam": {
    "Kamrup": ["Rangiya Junction", "Boko", "Chaygaon", "Palasbari"],
    "Kamrup Metropolitan": ["Guwahati", "Kamakhya Junction", "Maligaon", "Dispur"],
    "Nagaon": ["Nagaon", "Chaparmukh Junction", "Raha", "Kaliabor"],
    "Hojai": ["Hojai", "Lumding Junction", "Lanka", "Doboka"],
    "Karbi Anglong": ["Diphu", "Bokajan", "Howraghat"],
    "Dima Hasao": ["Haflong", "New Haflong", "Mahur", "Maibang"],
    "Cachar": ["Silchar", "Badarpur Junction", "Katigorah", "Lakhipur"],
    "Hailakandi": ["Hailakandi", "Lala", "Algapur"],
    "Karimganj": ["Karimganj Junction", "Badarpur", "Patharkandi"],
    "Tinsukia": ["Tinsukia Junction", "New Tinsukia", "Makum Junction", "Digboi", "Margherita"],
    "Dibrugarh": ["Dibrugarh", "Dibrugarh Town", "Chabua", "Moranhat"],
    "Sivasagar": ["Sivasagar Town", "Nazira", "Simaluguri Junction", "Amguri"],
    "Jorhat": ["Jorhat Town", "Mariani Junction", "Titabar", "Teok"],
    "Golaghat": ["Golaghat", "Furkating Junction", "Bokakhat", "Sarupathar"],
    "Baksa": ["Mushalpur", "Barama", "Tamulpur"],
    "Barpeta": ["Barpeta Road", "Barpeta Town", "Sorbhog", "Sarthebari"],
    "Nalbari": ["Nalbari", "Tihu", "Belsor"],
    "Darrang": ["Mangaldai", "Kharupetia", "Sipajhar"],
    "Sonitpur": ["Tezpur", "Rangapara North Junction", "Dhekiajuli Road", "Biswanath Chariali"],
    "Kokrajhar": ["Kokrajhar", "Fakiragram Junction", "Gossaigaon"],
    "Bongaigaon": ["Bongaigaon", "New Bongaigaon Junction", "Abhayapuri"],
  },
  "Uttarakhand": {
    "Dehradun": ["Dehradun", "Rishikesh", "Yog Nagari Rishikesh", "Vikasnagar"],
    "Haridwar": ["Haridwar Junction", "Roorkee", "Laksar Junction", "Jwalapur"],
    "Nainital": ["Kathgodam", "Haldwani", "Lalkuan Junction", "Ramnagar"],
    "Kashipur": ["Kashipur Junction", "Jaspur", "Bazpur"],
  },
  "Himachal Pradesh": {
    "Shimla": ["Shimla", "Summer Hill", "Taradevi", "Shoghi", "Jutogh"],
    "Solan": ["Solan", "Kalka-Shimla Line", "Kandaghat", "Dharampur"],
    "Kangra": ["Kangra", "Palampur Himachal", "Nagrota", "Baijnath Paprola"],
    "Una": ["Una Himachal", "Amb Andaura", "Daulatpur Chowk"],
  },
  "Jammu and Kashmir": {
    "Jammu": ["Jammu Tawi", "Bari Brahman", "Vijaypur Jammu"],
    "Srinagar": ["Srinagar", "Budgam", "Nowgam", "Pampore"],
    "Udhampur": ["Udhampur", "Shri Mata Vaishno Devi Katra"],
    "Anantnag": ["Anantnag", "Bijbehara", "Qazigund"],
    "Baramulla": ["Baramulla", "Sopore", "Pattan"],
  },
  "Goa": {
    "North Goa": ["Thivim", "Karmali", "Mapusa", "Panaji"],
    "South Goa": ["Madgaon Junction (Margao)", "Vasco da Gama", "Canacona", "Curchorem (Sanvordem)"],
  },
  "Chandigarh": {
    "Chandigarh": ["Chandigarh Junction", "Sector 17", "Manimajra"],
  },
  "Puducherry": {
    "Puducherry": ["Puducherry (Pondicherry)", "Villianur"],
    "Karaikal": ["Karaikal", "Nagore (Nearby)", "T.R. Pattinam"],
  },
  "Tripura": {
    "West Tripura": ["Agartala", "Jogendranagar", "Jirania"],
    "Dhalai": ["Ambassa", "Manu", "Teliamura"],
    "North Tripura": ["Dharmanagar", "Kumarghat", "Panisagar"],
  },
  "Nagaland": {
    "Dimapur": ["Dimapur", "Rangapahar"],
  },
  "Manipur": {
    "Imphal West": ["Imphal", "Khongsang (Nearby)"],
  },
  "Meghalaya": {
    "East Khasi Hills": ["Shillong", "Mendipathar (North Garo Hills)"],
  },
  "Mizoram": {
    "Aizawl": ["Aizawl", "Bairabi"],
  },
  "Sikkim": {
    "East Sikkim": ["Gangtok", "Rangpo (Upcoming Railway)"],
  },
  "Arunachal Pradesh": {
    "Papum Pare": ["Naharlagun", "Itanagar"],
  },
  "Ladakh": {
    "Leh": ["Leh", "Kargil"],
  },
  "Andaman and Nicobar Islands": {
    "South Andaman": ["Port Blair", "Garacharma", "Prothrapur"],
  },
  "Dadra and Nagar Haveli and Daman and Diu": {
    "Daman": ["Daman", "Vapi (Nearby)"],
    "Diu": ["Diu", "Delvada (Nearby)"],
    "Dadra and Nagar Haveli": ["Silvassa"],
  },
  "Lakshadweep": {
    "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy"],
  },
};

// Return all available 28 States and 8 Union Territories in India
export const ALL_INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
].sort();

// Helper to get Railway Zones serving a given state
export function getZonesForState(stateName?: string): RailwayZone[] {
  if (!stateName) return RAILWAY_ZONES;
  const cleanState = stateName.trim().toLowerCase();
  const matched = RAILWAY_ZONES.filter((z) =>
    z.primaryStates.some((s) => s.toLowerCase() === cleanState)
  );
  if (matched.length > 0) {
    return matched;
  }
  return RAILWAY_ZONES;
}

// Helper to get divisions for a given zone code or name
export function getDivisionsForZone(zoneIdentifier?: string): string[] {
  if (!zoneIdentifier) return [];
  const cleanId = zoneIdentifier.trim().toLowerCase();
  
  const foundZone = RAILWAY_ZONES.find(
    (z) =>
      z.code.toLowerCase() === cleanId ||
      z.name.toLowerCase() === cleanId ||
      cleanId.includes(z.code.toLowerCase()) ||
      cleanId.includes(z.name.toLowerCase())
  );

  if (foundZone) {
    return foundZone.divisions;
  }

  return [];
}

// Helper to get districts for a given state
export function getDistrictsForState(stateName?: string): string[] {
  if (!stateName) return [];
  const stateData = STATE_DISTRICT_TOWNS[stateName];
  if (stateData) {
    return Object.keys(stateData).sort();
  }
  return [];
}

// Helper to get districts strictly falling under a selected Railway Division
export function getDistrictsForDivision(divisionIdentifier?: string, stateName?: string): string[] {
  if (!divisionIdentifier) {
    return getDistrictsForState(stateName);
  }
  const cleanDiv = divisionIdentifier.trim().toLowerCase();

  let matchedDistricts: string[] = [];
  for (const [key, districts] of Object.entries(DIVISION_DISTRICTS_MAP)) {
    if (
      key.toLowerCase() === cleanDiv ||
      key.toLowerCase().includes(cleanDiv) ||
      cleanDiv.includes(key.toLowerCase()) ||
      (cleanDiv.includes("bza") && key.includes("BZA")) ||
      (cleanDiv.includes("gnt") && key.includes("GNT")) ||
      (cleanDiv.includes("wat") && key.includes("WAT")) ||
      (cleanDiv.includes("gtl") && key.includes("GTL")) ||
      (cleanDiv.includes("sc") && key.includes("(SC)")) ||
      (cleanDiv.includes("hyb") && key.includes("(HYB)")) ||
      (cleanDiv.includes("ned") && key.includes("(NED)")) ||
      (cleanDiv.includes("mas") && key.includes("MAS")) ||
      (cleanDiv.includes("sbc") && key.includes("SBC")) ||
      (cleanDiv.includes("csmt") && key.includes("CSMT"))
    ) {
      matchedDistricts = districts;
      break;
    }
  }

  // Fallback if not matched
  if (matchedDistricts.length === 0) {
    return getDistrictsForState(stateName);
  }

  // If a state is selected, filter districts under that division to only those in the chosen state if matching exists
  if (stateName && STATE_DISTRICT_TOWNS[stateName]) {
    const stateDistricts = Object.keys(STATE_DISTRICT_TOWNS[stateName]);
    const filtered = matchedDistricts.filter((d) => stateDistricts.includes(d));
    if (filtered.length > 0) {
      return filtered.sort();
    }
  }

  return [...matchedDistricts].sort();
}

// Helper to get mandals/towns for a state and district
export function getTownsForDistrict(stateName?: string, districtName?: string): string[] {
  if (!districtName) return [];
  
  // First check in the given state
  if (stateName && STATE_DISTRICT_TOWNS[stateName]) {
    const towns = STATE_DISTRICT_TOWNS[stateName][districtName];
    if (towns && towns.length > 0) {
      return [...towns].sort();
    }
  }

  // Search in all states for this district
  for (const st of Object.keys(STATE_DISTRICT_TOWNS)) {
    const towns = STATE_DISTRICT_TOWNS[st][districtName];
    if (towns && towns.length > 0) {
      return [...towns].sort();
    }
  }

  return [districtName];
}

// Helper function to resolve primary zone for a state & district
export function getDefaultZoneForLocation(state?: string, district?: string): { zone: string; division: string } {
  if (state === "Andhra Pradesh") {
    if (district === "Guntur" || district === "Palnadu") {
      return { zone: "SCR", division: "Guntur (GNT)" };
    }
    if (district === "Visakhapatnam" || district === "Srikakulam" || district === "Vizianagaram" || district === "Anakapalli") {
      return { zone: "SCoR", division: "Visakhapatnam (WAT)" };
    }
    if (district === "Kurnool" || district === "Anantapur" || district === "Sri Sathya Sai" || district === "Nandyal") {
      return { zone: "SCR", division: "Guntakal (GTL)" };
    }
    return { zone: "SCR", division: "Vijayawada (BZA)" };
  }
  if (state === "Telangana") {
    if (district === "Nizamabad" || district === "Mahbubnagar" || district === "Kamareddy") {
      return { zone: "SCR", division: "Hyderabad (HYB)" };
    }
    if (district === "Adilabad" || district === "Nirmal") {
      return { zone: "SCR", division: "Nanded (NED)" };
    }
    return { zone: "SCR", division: "Secunderabad (SC)" };
  }
  if (state === "Tamil Nadu") {
    if (district === "Madurai" || district === "Dindigul" || district === "Virudhunagar") {
      return { zone: "SR", division: "Madurai (MDU)" };
    }
    if (district === "Salem" || district === "Erode" || district === "Coimbatore") {
      return { zone: "SR", division: "Salem (SA)" };
    }
    if (district === "Tiruchirappalli" || district === "Thanjavur") {
      return { zone: "SR", division: "Tiruchirappalli (TPJ)" };
    }
    return { zone: "SR", division: "Chennai (MAS)" };
  }
  if (state === "Karnataka") {
    if (district === "Mysuru" || district === "Hassan" || district === "Shivamogga") {
      return { zone: "SWR", division: "Mysuru (MYS)" };
    }
    if (district === "Dharwad" || district === "Belagavi" || district === "Bagalkot" || district === "Gadag") {
      return { zone: "SWR", division: "Hubballi (UBL)" };
    }
    return { zone: "SWR", division: "Bengaluru (SBC)" };
  }
  if (state === "Maharashtra") {
    if (district === "Pune" || district === "Satara" || district === "Kolhapur") {
      return { zone: "CR", division: "Pune (PUN)" };
    }
    if (district === "Solapur" || district === "Latur") {
      return { zone: "CR", division: "Solapur (SUR)" };
    }
    if (district === "Nagpur" || district === "Wardha" || district === "Chandrapur") {
      return { zone: "CR", division: "Nagpur (NGP)" };
    }
    if (district === "Nanded" || district === "Parbhani" || district === "Aurangabad") {
      return { zone: "SCR", division: "Nanded (NED)" };
    }
    if (district === "Jalgaon" || district === "Bhusawal") {
      return { zone: "CR", division: "Bhusawal (BSL)" };
    }
    return { zone: "CR", division: "Mumbai (CSMT)" };
  }
  if (state === "Gujarat") {
    if (district === "Vadodara" || district === "Anand" || district === "Bharuch") {
      return { zone: "WR", division: "Vadodara (BRC)" };
    }
    if (district === "Surat" || district === "Navsari" || district === "Valsad") {
      return { zone: "WR", division: "Mumbai Central (BCT)" };
    }
    if (district === "Rajkot" || district === "Jamnagar" || district === "Morbi") {
      return { zone: "WR", division: "Rajkot (RJT)" };
    }
    if (district === "Bhavnagar" || district === "Amreli" || district === "Junagadh") {
      return { zone: "WR", division: "Bhavnagar (BVP)" };
    }
    return { zone: "WR", division: "Ahmedabad (ADI)" };
  }
  if (state === "Delhi") {
    return { zone: "NR", division: "Delhi (DLI)" };
  }
  if (state === "Uttar Pradesh") {
    if (district === "Prayagraj" || district === "Kanpur Nagar") {
      return { zone: "NCR", division: "Prayagraj (PRYJ)" };
    }
    if (district === "Agra" || district === "Mathura") {
      return { zone: "NCR", division: "Agra (AGC)" };
    }
    if (district === "Jhansi") {
      return { zone: "NCR", division: "Jhansi (JHS)" };
    }
    if (district === "Gorakhpur" || district === "Varanasi") {
      return { zone: "NER", division: "Varanasi (BSB)" };
    }
    if (district === "Bareilly") {
      return { zone: "NER", division: "Izzatnagar (IZN)" };
    }
    return { zone: "NR", division: "Lucknow (LKO)" };
  }
  if (state === "West Bengal") {
    if (district === "Paschim Bardhaman") {
      return { zone: "ER", division: "Asansol (ASN)" };
    }
    if (district === "Malda") {
      return { zone: "ER", division: "Malda (MLDT)" };
    }
    if (district === "Kharagpur" || district === "Paschim Medinipur") {
      return { zone: "SER", division: "Kharagpur (KGP)" };
    }
    return { zone: "ER", division: "Howrah (HWH)" };
  }
  if (state === "Bihar") {
    if (district === "Samastipur" || district === "Darbhanga") {
      return { zone: "ECR", division: "Samastipur (SPJ)" };
    }
    if (district === "Katihar") {
      return { zone: "NFR", division: "Katihar (KIR)" };
    }
    return { zone: "ECR", division: "Danapur (DNR)" };
  }
  if (state === "Odisha") {
    if (district === "Sambalpur" || district === "Jharsuguda") {
      return { zone: "ECoR", division: "Sambalpur (SBP)" };
    }
    return { zone: "ECoR", division: "Khurda Road (KUR)" };
  }
  if (state === "Rajasthan") {
    if (district === "Ajmer" || district === "Udaipur") {
      return { zone: "NWR", division: "Ajmer (AII)" };
    }
    if (district === "Bikaner") {
      return { zone: "NWR", division: "Bikaner (BKN)" };
    }
    if (district === "Jodhpur") {
      return { zone: "NWR", division: "Jodhpur (JU)" };
    }
    if (district === "Kota") {
      return { zone: "WCR", division: "Kota (KOTA)" };
    }
    return { zone: "NWR", division: "Jaipur (JP)" };
  }
  if (state === "Kerala") {
    if (district === "Palakkad" || district === "Kozhikode" || district === "Kannur") {
      return { zone: "SR", division: "Palakkad (PGT)" };
    }
    return { zone: "SR", division: "Thiruvananthapuram (TVC)" };
  }

  return { zone: "SCR", division: "Vijayawada (BZA)" };
}
