/**
 * Blood type color mapping for consistent UI across the app
 */
export const BLOOD_TYPE_COLORS = {
  'O+': '#FF6B6B',
  'O-': '#FFA07A',
  'A+': '#4ECDC4',
  'A-': '#45B7D1',
  'B+': '#F7DC6F',
  'B-': '#F39C12',
  'AB+': '#BB8FCE',
  'AB-': '#9B59B6'
}

/**
 * All valid blood type values
 */
export const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

/**
 * Blood type select options (for v-select)
 */
export const BLOOD_TYPE_OPTIONS = BLOOD_TYPES.map(type => ({
  title: type,
  value: type
}))

/**
 * Get color for a blood type
 * @param {string} bloodType 
 * @returns {string} hex color
 */
export function getBloodTypeColor(bloodType) {
  return BLOOD_TYPE_COLORS[bloodType] || '#95A5A6'
}

/**
 * Days before a donor is eligible to donate again
 */
export const DONATION_COOLDOWN_DAYS = 56

/**
 * Check if a donor is eligible to donate based on last donation date
 * @param {string|Date} lastDonationDate 
 * @returns {{ eligible: boolean, daysRemaining: number }}
 */
export function checkDonationEligibility(lastDonationDate) {
  if (!lastDonationDate) return { eligible: true, daysRemaining: 0 }
  
  const lastDate = new Date(lastDonationDate)
  const now = new Date()
  const diffTime = now - lastDate
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  return {
    eligible: diffDays >= DONATION_COOLDOWN_DAYS,
    daysRemaining: Math.max(0, DONATION_COOLDOWN_DAYS - diffDays)
  }
}

/**
 * Egyptian phone number validation regex
 * Matches: 01[0125]XXXXXXXX (11 digits total)
 */
export const EGYPTIAN_PHONE_REGEX = /^01[0125][0-9]{8}$/

/**
 * Calculate age from birth date
 * @param {string|Date} birthDate 
 * @returns {number}
 */
export function calculateAge(birthDate) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}
