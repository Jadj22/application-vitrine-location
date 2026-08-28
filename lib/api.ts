const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"

type FetchOptions = {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...opts.headers,
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const url = path.startsWith("http://") || path.startsWith("https://") ? path : `${API_BASE}${path}`
  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

/* -------------------------------------------------------------------------- */
/*  Auth                                                                       */
/* -------------------------------------------------------------------------- */

export const auth = {
  async register(data: { email: string; password: string; first_name?: string; last_name?: string }) {
    return apiFetch<{ access: string; refresh: string; user: unknown }>("/auth/register/", { method: "POST", body: data })
  },
  async login(data: { email: string; password: string }) {
    return apiFetch<{ access: string; refresh: string; user: unknown }>("/auth/login/", { method: "POST", body: data })
  },
  async me() {
    return apiFetch<unknown>("/auth/me/")
  },
}

/* -------------------------------------------------------------------------- */
/*  Public Business                                                            */
/* -------------------------------------------------------------------------- */

export type PublicBusiness = {
  id: string
  slug: string
  nom: string
  public_name: string
  business_type: string
  adresse: string
  telephone: string
  email: string
  logo_url: string
  created_at: string
}

export const publicBusiness = {
  async get(slug: string) {
    return apiFetch<PublicBusiness>(`/public/b/${slug}/`)
  },
}

/* -------------------------------------------------------------------------- */
/*  Public Catalog                                                             */
/* -------------------------------------------------------------------------- */

export type PublicItem = {
  id: string
  nom: string
  reference?: string
  public_description: string
  description?: string
  prix: number
  unite: string
  statut: string
  is_published: boolean
  photo_url?: string
  category_nom?: string
  characteristics: Record<string, unknown>
  qr_code: string
}

export type CatalogAvailability = PublicItem & {
  total_stock: number
  disponible: number
  reserves_pendant_periode: number
  booking_requests_pendantes: number
  en_entretien: number
  en_stock_physique: number
  peut_reserver: boolean
}

export type AvailabilityDetail = {
  item_id: string
  item_nom: string
  date_debut: string
  date_fin: string
  total_stock: number
  disponible: number
  reserves_pendant_periode: number
  booking_requests_pendantes: number
  en_entretien: number
  en_stock_physique: number
  peut_reserver: boolean
  detail_reservations: { id: string; date_debut: string; date_fin: string; quantite: number; statut: string }[]
  detail_booking_requests: { id: string; date_debut: string; date_fin: string; quantite: number; statut: string; client_nom: string }[]
}

export const catalog = {
  async list(slug: string, opts?: { page?: number; pageSize?: number }) {
    const params = new URLSearchParams();
    if (opts?.page) params.set("page", String(opts.page));
    if (opts?.pageSize) params.set("page_size", String(opts.pageSize));
    const qs = params.toString();
    const data: any = await apiFetch<any>(`/public/b/${slug}/items/${qs ? `?${qs}` : ""}`);
    if (Array.isArray(data)) return data as PublicItem[];
    if (data && typeof data === "object" && "results" in data) return data.results as PublicItem[];
    return data as PublicItem[];
  },
  async availability(slug: string, dateDebut: string, dateFin: string, opts?: { page?: number; pageSize?: number }) {
    const params = new URLSearchParams();
    params.set("date_debut", dateDebut);
    params.set("date_fin", dateFin);
    if (opts?.page) params.set("page", String(opts.page));
    if (opts?.pageSize) params.set("page_size", String(opts.pageSize));
    const data: any = await apiFetch<any>(`/public/b/${slug}/items/?${params.toString()}`);
    if (Array.isArray(data)) return data as CatalogAvailability[];
    if (data && typeof data === "object" && "results" in data) return data.results as CatalogAvailability[];
    return data as CatalogAvailability[];
  },
  async itemAvailability(slug: string, itemId: string, dateDebut: string, dateFin: string) {
    return apiFetch<AvailabilityDetail>(`/public/b/${slug}/items/${itemId}/availability/?date_debut=${dateDebut}&date_fin=${dateFin}`)
  },
}

export type PublicCategory = {
  id: string
  nom: string
  description: string
  image_url: string | null
}

export const publicCategories = {
  async list(slug: string) {
    return apiFetch<PublicCategory[]>(`/public/b/${slug}/categories/`)
  },
}

/* -------------------------------------------------------------------------- */
/*  Public Booking Requests                                                    */
/* -------------------------------------------------------------------------- */

export type BookingRequestInput = {
  item_id: string
  client_nom: string
  client_email: string
  client_telephone?: string
  date_debut: string
  date_fin: string
  quantite: number
  message?: string
  lieu_nom?: string
  lieu_adresse?: string
  contact_nom?: string
  contact_telephone?: string
  notes_livraison?: string
  visitor_id?: string
  idempotency_key?: string
}

export type BookingRequestResult = {
  id: string
  access_token: string
  expires_at: string
  detail_url: string
  message: string
}

export type CounterProposal = {
  date_debut: string
  date_fin: string
  quantite: number
  prix?: number
  message?: string
}

export type BookingRequestDetail = {
  id: string
  item_id: string
  client_nom: string
  client_email: string
  client_telephone: string
  date_debut: string
  date_fin: string
  quantite: number
  message: string
  statut: string
  contre_proposition?: CounterProposal
  motif_refus: string
  lieu_nom: string
  lieu_adresse: string
  contact_nom: string
  contact_telephone: string
  notes_livraison: string
  access_token: string
  expires_at: string
  created_at: string
  updated_at: string
}

export const bookingRequests = {
  async create(
    slug: string,
    input: BookingRequestInput,
    opts?: { visitorId?: string; idempotencyKey?: string }
  ) {
    const headers: Record<string, string> = {};
    if (opts?.visitorId) headers["X-Visitor-Id"] = opts.visitorId;
    if (opts?.idempotencyKey) headers["Idempotency-Key"] = opts.idempotencyKey;
    // Fallback body fields for robustness
    const body: any = { ...input };
    if (opts?.visitorId && !body.visitor_id) body.visitor_id = opts.visitorId;
    if (opts?.idempotencyKey && !body.idempotency_key) body.idempotency_key = opts.idempotencyKey;
    return apiFetch<BookingRequestResult>(`/public/b/${slug}/booking-requests/`, {
      method: "POST",
      body,
      headers,
    });
  },
  async getByToken(token: string) {
    return apiFetch<BookingRequestDetail & { business_slug: string }>(`/public/booking-requests/${token}/`)
  },
  async get(slug: string, token: string) {
    return apiFetch<BookingRequestDetail>(`/public/b/${slug}/booking-requests/${token}/`)
  },
  async cancel(slug: string, token: string) {
    return apiFetch<{ success: boolean; message: string }>(`/public/b/${slug}/booking-requests/${token}/cancel/`, { method: "POST" })
  },
  async acceptCounter(slug: string, token: string) {
    return apiFetch<{ success: boolean; reservation_id?: string; message: string }>(`/public/b/${slug}/booking-requests/${token}/accept-counter/`, { method: "POST" })
  },
  async rejectCounter(slug: string, token: string, motifRefus?: string) {
    return apiFetch<{ success: boolean; message: string }>(`/public/b/${slug}/booking-requests/${token}/reject-counter/`, { method: "POST", body: { motif_refus: motifRefus } })
  },
  async activeRequest(slug: string, visitorId: string) {
    return apiFetch<{ hasActiveRequest: boolean; request: any }>(
      `/public/b/${slug}/active-request/?visitor_id=${encodeURIComponent(visitorId)}`,
      { headers: { "X-Visitor-Id": visitorId } }
    );
  },
  async recover(slug: string, data: { email?: string; phone?: string; visitor_id?: string }) {
    return apiFetch<{ results: any[] }>(`/public/b/${slug}/recover/`, { method: "POST", body: data })
  },
  async myRequests(slug: string, visitorId: string) {
    return apiFetch<{ results: any[] }>(
      `/public/b/${slug}/customer-requests/?visitor_id=${encodeURIComponent(visitorId)}`,
      { headers: { "X-Visitor-Id": visitorId } }
    )
  },
}

/* -------------------------------------------------------------------------- */
/*  Public Invoice                                                             */
/* -------------------------------------------------------------------------- */

export type InvoiceLine = {
  description: string
  quantite: number
  prix_unitaire: number
  total: number
}

export type Invoice = {
  id: string
  numero: string
  type: string
  statut: string
  client_nom: string
  client_email: string
  client_telephone: string
  client_adresse: string
  lignes: InvoiceLine[]
  sous_total: number
  tva_taux: number
  tva_montant: number
  total_ttc: number
  generee_le: string
  envoyee_le?: string
  payee_le?: string
}

export const invoices = {
  async getPublic(slug: string, reservationId: string) {
    return apiFetch<Invoice>(`/public/b/${slug}/invoices/${reservationId}/`)
  },
  async downloadPdf(slug: string, reservationId: string) {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    const headers: Record<string, string> = {}
    if (token) headers["Authorization"] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}/public/b/${slug}/invoices/${reservationId}/pdf/`, { headers })
    if (!res.ok) throw new Error("Impossible de télécharger le PDF")
    return res.blob()
  },
}

/* -------------------------------------------------------------------------- */
/*  Team: Booking Requests                                                     */
/* -------------------------------------------------------------------------- */

export const teamBookingRequests = {
  async list(businessId: string, filters?: { statut?: string; page?: number; page_size?: number }) {
    const params = new URLSearchParams()
    if (filters?.statut) params.set("statut", filters.statut)
    if (filters?.page) params.set("page", String(filters.page))
    if (filters?.page_size) params.set("page_size", String(filters.page_size))
    const qs = params.toString()
    return apiFetch<{ count: number; next?: string; previous?: string; results: BookingRequestDetail[] }>(
      `/businesses/${businessId}/booking-requests/${qs ? `?${qs}` : ""}`
    )
  },
  async get(businessId: string, requestId: string) {
    return apiFetch<BookingRequestDetail>(`/businesses/${businessId}/booking-requests/${requestId}/`)
  },
  async action(businessId: string, requestId: string, action: "accepter" | "refuser" | "contre_proposer", data?: Record<string, unknown>) {
    return apiFetch<{ success: boolean; message: string }>(`/businesses/${businessId}/booking-requests/${requestId}/action/`, {
      method: "POST",
      body: { action, ...data },
    })
  },
}

/* -------------------------------------------------------------------------- */
/*  Team: Invoices                                                             */
/* -------------------------------------------------------------------------- */

export type InvoiceCreateInput = {
  reservation_id: string
  type: string
  tva_taux: number
  lignes: { description: string; quantite: number; prix_unitaire: number }[]
}

export const teamInvoices = {
  async list(businessId: string, filters?: { statut?: string; page?: number }) {
    const params = new URLSearchParams()
    if (filters?.statut) params.set("statut", filters.statut)
    if (filters?.page) params.set("page", String(filters.page))
    const qs = params.toString()
    return apiFetch<{ count: number; next?: string; previous?: string; results: Invoice[] }>(
      `/businesses/${businessId}/invoices/${qs ? `?${qs}` : ""}`
    )
  },
  async create(businessId: string, input: InvoiceCreateInput) {
    return apiFetch<Invoice>(`/businesses/${businessId}/invoices/`, { method: "POST", body: input })
  },
  async get(businessId: string, invoiceId: string) {
    return apiFetch<Invoice>(`/businesses/${businessId}/invoices/${invoiceId}/`)
  },
  async markSent(businessId: string, invoiceId: string) {
    return apiFetch<{ success: boolean }>(`/businesses/${businessId}/invoices/${invoiceId}/mark-sent/`, { method: "POST" })
  },
  async markPaid(businessId: string, invoiceId: string) {
    return apiFetch<{ success: boolean }>(`/businesses/${businessId}/invoices/${invoiceId}/mark-paid/`, { method: "POST" })
  },
  async downloadPdf(businessId: string, invoiceId: string) {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    const headers: Record<string, string> = {}
    if (token) headers["Authorization"] = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/businesses/${businessId}/invoices/${invoiceId}/pdf/`, { headers })
    if (!res.ok) throw new Error("Impossible de télécharger le PDF")
    return res.blob()
  },
}

/* -------------------------------------------------------------------------- */
/*  Business (team)                                                            */
/* -------------------------------------------------------------------------- */

export type Business = {
  id: string
  slug: string
  nom: string
  tagline: string
  description: string
  city: string
  phone?: string
  email?: string
  logo_url?: string
  public_name?: string
  adresse?: string
  categories: string[]
  business_type: string
  created_at: string
}

export const businesses = {
  async list() {
    return apiFetch<Business[]>("/businesses/")
  },
  async get(businessId: string) {
    return apiFetch<Business>(`/businesses/${businessId}/`)
  },
}