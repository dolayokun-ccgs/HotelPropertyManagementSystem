// Guest types
export interface Guest {
  guestId: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  organisation?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  idType?: string
  idNumber?: string
  dateOfBirth?: string
  nationality?: string
  comments?: string
  isActive: boolean
  createdDate: string
  totalReservations: number
  lastStayDate?: string
}

export interface CreateGuestRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  organisation?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  idType?: string
  idNumber?: string
  dateOfBirth?: string
  nationality?: string
  comments?: string
}

export interface UpdateGuestRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  organisation?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  idType?: string
  idNumber?: string
  dateOfBirth?: string
  nationality?: string
  comments?: string
  isActive?: boolean
}
