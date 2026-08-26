export interface GSTStateInfo {
  code: string;
  name: string;
  defaultCity: string;
  defaultPincode: string;
  defaultArea: string;
}

export const GST_STATE_MAP: Record<string, GSTStateInfo> = {
  '01': { code: '01', name: 'Jammu and Kashmir', defaultCity: 'Srinagar', defaultPincode: '190001', defaultArea: 'Residency Road Commercial Area' },
  '02': { code: '02', name: 'Himachal Pradesh', defaultCity: 'Shimla', defaultPincode: '171001', defaultArea: 'The Mall Road' },
  '03': { code: '03', name: 'Punjab', defaultCity: 'Ludhiana', defaultPincode: '141001', defaultArea: 'Focal Point Phase V, Industrial Hub' },
  '04': { code: '04', name: 'Chandigarh', defaultCity: 'Chandigarh', defaultPincode: '160017', defaultArea: 'Sector 17 Commercial Complex' },
  '05': { code: '05', name: 'Uttarakhand', defaultCity: 'Dehradun', defaultPincode: '248001', defaultArea: 'Rajpur Road Business Arcade' },
  '06': { code: '06', name: 'Haryana', defaultCity: 'Gurugram', defaultPincode: '122016', defaultArea: 'Udyog Vihar Phase IV' },
  '07': { code: '07', name: 'Delhi', defaultCity: 'New Delhi', defaultPincode: '110020', defaultArea: 'Plot 42, Okhla Industrial Area Phase-III' },
  '08': { code: '08', name: 'Rajasthan', defaultCity: 'Jaipur', defaultPincode: '302001', defaultArea: 'Sitapura Industrial Area, Tonk Road' },
  '09': { code: '09', name: 'Uttar Pradesh', defaultCity: 'Noida', defaultPincode: '201301', defaultArea: 'Sector 63, Electronic City Industrial Zone' },
  '10': { code: '10', name: 'Bihar', defaultCity: 'Patna', defaultPincode: '800001', defaultArea: 'Exhibition Road, Fraser Road Commercial Centre' },
  '11': { code: '11', name: 'Sikkim', defaultCity: 'Gangtok', defaultPincode: '737101', defaultArea: 'MG Marg Commercial Zone' },
  '12': { code: '12', name: 'Arunachal Pradesh', defaultCity: 'Itanagar', defaultPincode: '791111', defaultArea: 'Bank Tinali Main Market' },
  '13': { code: '13', name: 'Nagaland', defaultCity: 'Dimapur', defaultPincode: '797112', defaultArea: 'Circular Road Business Park' },
  '14': { code: '14', name: 'Manipur', defaultCity: 'Imphal', defaultPincode: '795001', defaultArea: 'Thangal Bazar' },
  '15': { code: '15', name: 'Mizoram', defaultCity: 'Aizawl', defaultPincode: '796001', defaultArea: 'Bawngkawn Commercial Hub' },
  '16': { code: '16', name: 'Tripura', defaultCity: 'Agartala', defaultPincode: '799001', defaultArea: 'Akhaura Road Market' },
  '17': { code: '17', name: 'Meghalaya', defaultCity: 'Shillong', defaultPincode: '793001', defaultArea: 'Police Bazar Point' },
  '18': { code: '18', name: 'Assam', defaultCity: 'Guwahati', defaultPincode: '781005', defaultArea: 'GS Road, Christian Basti Trade Center' },
  '19': { code: '19', name: 'West Bengal', defaultCity: 'Kolkata', defaultPincode: '700001', defaultArea: 'Park Street Business Park, Camac Street' },
  '20': { code: '20', name: 'Jharkhand', defaultCity: 'Ranchi', defaultPincode: '834001', defaultArea: 'Main Road Commercial Plaza' },
  '21': { code: '21', name: 'Odisha', defaultCity: 'Bhubaneswar', defaultPincode: '751024', defaultArea: 'Infocity Trade Tower, Chandrasekharpur' },
  '22': { code: '22', name: 'Chhattisgarh', defaultCity: 'Raipur', defaultPincode: '492001', defaultArea: 'Pandri Cloth & Hardware Market' },
  '23': { code: '23', name: 'Madhya Pradesh', defaultCity: 'Indore', defaultPincode: '452001', defaultArea: 'Sanwer Road Industrial Area' },
  '24': { code: '24', name: 'Gujarat', defaultCity: 'Ahmedabad', defaultPincode: '380009', defaultArea: 'GIDC Industrial Estate, Naroda & SG Highway' },
  '27': { code: '27', name: 'Maharashtra', defaultCity: 'Mumbai', defaultPincode: '400013', defaultArea: 'Floor 4, Peninsula Business Park, Lower Parel' },
  '29': { code: '29', name: 'Karnataka', defaultCity: 'Bengaluru', defaultPincode: '560038', defaultArea: '100 Feet Road, Indiranagar Tech Corridor' },
  '30': { code: '30', name: 'Goa', defaultCity: 'Panaji', defaultPincode: '403001', defaultArea: 'Patto Plaza Business Enclave' },
  '32': { code: '32', name: 'Kerala', defaultCity: 'Kochi', defaultPincode: '682016', defaultArea: 'MG Road Trade Avenue, Ernakulam' },
  '33': { code: '33', name: 'Tamil Nadu', defaultCity: 'Chennai', defaultPincode: '600034', defaultArea: 'Nungambakkam High Road, Trade Hub' },
  '36': { code: '36', name: 'Telangana', defaultCity: 'Hyderabad', defaultPincode: '500081', defaultArea: 'HITEC City Cyber Towers, Madhapur' },
  '37': { code: '37', name: 'Andhra Pradesh', defaultCity: 'Visakhapatnam', defaultPincode: '530002', defaultArea: 'Dwaraka Nagar Commercial Street' },
  '38': { code: '38', name: 'Ladakh', defaultCity: 'Leh', defaultPincode: '194101', defaultArea: 'Main Bazaar Road' },
};

export const BUSINESS_CATEGORIES: string[] = [
  'Retail & Departmental Store',
  'Wholesale & Bulk Distribution',
  'Manufacturing & Industrial Production',
  'IT, Software & Digital Services',
  'Construction, Real Estate & Building Materials',
  'Logistics, Transport & Warehousing',
  'Healthcare, Pharmacy & Medical Diagnostics',
  'Food, Beverages, Restaurant & Cloud Kitchen',
  'Textiles, Apparel & Garments Trading',
  'Electronics, Electricals & Hardware Supplies',
  'FMCG & Packaged Consumer Goods',
  'Automotive, Spare Parts & Garage Services',
  'Professional Consulting, CA & Legal Services',
  'Education, Coaching & Skill Training',
  'Agriculture, Seeds & Farm Equipment',
  'Gems, Jewellery & Precious Metals',
  'Printing, Packaging & Media Services',
  'Chemicals, Plastics & Polymers',
  'Solar Energy & Clean Tech Systems',
  'Other / General Enterprise',
];

export interface GSTINValidationResult {
  isValid: boolean;
  cleanGstin: string;
  error?: string;
  stateCode?: string;
  stateName?: string;
  pan?: string;
  entityCode?: string;
  seededAddress?: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
}

/**
 * Validates an Indian GSTIN format and extracts registered entity details.
 * Pattern: 2 digits (State Code) + 5 letters (PAN) + 4 digits (PAN) + 1 letter (PAN) + 1 char (Entity #) + 'Z' + 1 char (Checksum)
 */
export function validateGSTIN(rawGstin: string): GSTINValidationResult {
  const clean = (rawGstin || '').trim().toUpperCase().replace(/[\s-]/g, '');

  if (!clean) {
    return {
      isValid: false,
      cleanGstin: '',
      error: 'GSTIN cannot be empty.',
    };
  }

  if (clean.length < 15) {
    return {
      isValid: false,
      cleanGstin: clean,
      error: `GSTIN must be 15 characters long (currently ${clean.length} characters).`,
    };
  }

  if (clean.length > 15) {
    return {
      isValid: false,
      cleanGstin: clean,
      error: `GSTIN cannot exceed 15 characters (currently ${clean.length} characters).`,
    };
  }

  // Regex format test
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(clean)) {
    // Determine specific helpful failure reason
    const stateCodePart = clean.substring(0, 2);
    if (!/^[0-9]{2}$/.test(stateCodePart)) {
      return {
        isValid: false,
        cleanGstin: clean,
        error: 'First 2 characters must be a numeric State Code (01-38).',
      };
    }

    const panPart = clean.substring(2, 12);
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panPart)) {
      return {
        isValid: false,
        cleanGstin: clean,
        error: 'Characters 3 to 12 must be a valid 10-character PAN number (5 letters, 4 numbers, 1 letter).',
      };
    }

    if (clean.charAt(13) !== 'Z') {
      return {
        isValid: false,
        cleanGstin: clean,
        error: '14th character of GSTIN must be "Z".',
      };
    }

    return {
      isValid: false,
      cleanGstin: clean,
      error: 'Invalid GSTIN structure. Expected format: 07AAAAA0000A1Z5',
    };
  }

  const stateCode = clean.substring(0, 2);
  const stateInfo = GST_STATE_MAP[stateCode];

  if (!stateInfo) {
    return {
      isValid: false,
      cleanGstin: clean,
      error: `Invalid state code '${stateCode}'. Must be between 01 and 38.`,
    };
  }

  const pan = clean.substring(2, 12);
  const entityCode = clean.substring(12, 13);

  return {
    isValid: true,
    cleanGstin: clean,
    stateCode,
    stateName: stateInfo.name,
    pan,
    entityCode,
    seededAddress: {
      addressLine: stateInfo.defaultArea,
      city: stateInfo.defaultCity,
      state: `${stateInfo.name} (${stateCode})`,
      pincode: stateInfo.defaultPincode,
    },
  };
}
