/**
 * Cliente del motor de reserva público (web_booking_lambda.py, API
 * pública sin autenticación — mismo criterio que el resto del proyecto de
 * no ocultar URLs de servicio en variables de entorno cuando igual van a
 * quedar expuestas en el bundle del cliente).
 */
const API_BASE = "https://s3m6ovprj6.execute-api.us-east-2.amazonaws.com";

export type RoomId = "Standard" | "Deluxe Terraza 1" | "Deluxe Terraza 2" | "Deluxe Superior" | "Suite Principal";

export type RateEntry = {
  basico_clp: number;
  basico_usd: number;
  media_pension_clp: number;
  media_pension_usd: number;
};

export type AvailabilityResponse = {
  dias: string[];
  habitaciones: { room_id: RoomId; disponible: boolean[] }[];
  tarifas: Record<RoomId, RateEntry>;
};

export async function fetchAvailability(): Promise<AvailabilityResponse> {
  const res = await fetch(`${API_BASE}/public/disponibilidad`, { cache: "no-store" });
  if (!res.ok) throw new Error("No pudimos cargar el calendario de disponibilidad.");
  return res.json();
}

export type CreateBookingPayload = {
  RoomID: RoomId;
  CheckIn: string;
  CheckOut: string;
  Plan: "basico" | "media_pension";
  Currency: "CLP" | "USD";
  Adults: number;
  ChildrenAges: number[];
  Guest: {
    FullName: string;
    Contact: { Email?: string; WhatsApp?: string };
    OriginCountry?: string;
    SpecialNotes?: string;
    DietaryRestrictions?: string[];
    Preferences?: { actividad_preferida?: string };
  };
  BookingNotes?: string;
};

export type CreateBookingResult =
  | { ok: true; BookingID: string; TotalAmount: number; Currency: string; Nights: number; message: string }
  | { ok: false; status: number; error: string };

export async function createBooking(payload: CreateBookingPayload): Promise<CreateBookingResult> {
  try {
    const res = await fetch(`${API_BASE}/public/reservas`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, status: res.status, error: data.error || "No pudimos procesar la solicitud." };
    }
    return { ok: true, ...data };
  } catch {
    return { ok: false, status: 0, error: "No pudimos conectar con el servidor. Escríbenos por WhatsApp si el problema sigue." };
  }
}

export type SimulatePaymentResult = { ok: true; Status: string } | { ok: false; error: string };

/**
 * SIMULACIÓN para la demo — no es una pasarela de pago real ([PASARELA]
 * sigue sin definir). No pide ni transmite ningún dato de tarjeta, real
 * ni falso. Transiciona la reserva real a CONFIRMED en el PMS, igual que
 * lo haría un webhook real el día que exista una pasarela.
 */
export async function simulatePayment(bookingId: string): Promise<SimulatePaymentResult> {
  try {
    const res = await fetch(`${API_BASE}/public/reservas/${bookingId}/simular-pago`, { method: "PATCH" });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || "No pudimos simular el pago." };
    return { ok: true, Status: data.Status };
  } catch {
    return { ok: false, error: "No pudimos conectar con el servidor." };
  }
}

/** Misma fórmula que _compute_price en web_booking_lambda.py — para mostrar el precio en vivo antes de enviar. El servidor siempre recalcula. */
export function estimatePrice(
  rate: RateEntry,
  plan: "basico" | "media_pension",
  currency: "CLP" | "USD",
  nights: number,
  childrenAges: number[]
): number {
  const key = `${plan === "basico" ? "basico" : "media_pension"}_${currency === "USD" ? "usd" : "clp"}` as keyof RateEntry;
  const perNight = rate[key];
  let total = perNight * nights;
  const perPersonNight = perNight / 2;
  for (const age of childrenAges) {
    const pct = age <= 2 ? 0 : age <= 12 ? 0.5 : 0.6;
    total += perPersonNight * pct * nights;
  }
  return Math.round(total);
}

export const ROOM_LABELS: Record<RoomId, string> = {
  Standard: "Habitación Standard",
  "Deluxe Terraza 1": "Deluxe Terraza 1",
  "Deluxe Terraza 2": "Deluxe Terraza 2",
  "Deluxe Superior": "Deluxe Superior",
  "Suite Principal": "Suite Principal",
};

/** Foto real por habitación — mismas curadas a mano que las landings de /habitaciones. */
export const ROOM_PHOTOS: Record<RoomId, { src: string; alt: string }> = {
  "Suite Principal": { src: "/images/suite-principal/suite-principal-01-card.webp", alt: "Suite Principal, Alto Castillo Lodge" },
  "Deluxe Superior": { src: "/images/deluxe-superior/deluxe-superior-04-card.webp", alt: "Deluxe Superior, Alto Castillo Lodge" },
  "Deluxe Terraza 1": { src: "/images/deluxe/deluxe-09-card.webp", alt: "Deluxe Terraza 1, Alto Castillo Lodge" },
  "Deluxe Terraza 2": { src: "/images/deluxe/deluxe-03-card.webp", alt: "Deluxe Terraza 2, Alto Castillo Lodge" },
  Standard: { src: "/images/standard/standard-01-card.webp", alt: "Habitación Standard, Alto Castillo Lodge" },
};
