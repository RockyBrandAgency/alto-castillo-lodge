"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { AvailabilityCalendar } from "@/components/booking/AvailabilityCalendar";
import { FlightRouteSuggestion } from "@/components/booking/FlightRouteSuggestion";
import {
  fetchAvailability,
  createBooking,
  simulatePayment,
  estimatePrice,
  ROOM_LABELS,
  ROOM_PHOTOS,
  type AvailabilityResponse,
  type RoomId,
  type CreateBookingResult,
} from "@/lib/booking-api";
import styles from "./page.module.css";

const CURRENCY_LABEL = { CLP: "CLP", USD: "USD" } as const;

const ACTIVITY_OPTIONS = [
  "Golden Hour Circuit",
  "Baqueano Fire Cooking (Asado al Palo)",
  "Wild Wellness (senderos y cascadas)",
  "No lo tengo considerado",
] as const;

export default function ReservarPage() {
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedRoom, setSelectedRoom] = useState<RoomId | null>(null);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [plan, setPlan] = useState<"basico" | "media_pension">("basico");
  const [currency, setCurrency] = useState<"CLP" | "USD">("CLP");
  const [adults, setAdults] = useState(2);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [preferredActivity, setPreferredActivity] = useState<string>("");

  const [submitState, setSubmitState] = useState<"idle" | "loading" | "done">("idle");
  const [submitResult, setSubmitResult] = useState<CreateBookingResult | null>(null);
  const [paymentState, setPaymentState] = useState<"idle" | "loading" | "confirmed" | "error">("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchAvailability()
      .then((data) => {
        setAvailability(data);
        if (!selectedRoom) setSelectedRoom(data.habitaciones[0]?.room_id ?? null);
      })
      .catch((e) => setLoadError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roomAvailability = useMemo(() => {
    if (!availability || !selectedRoom) return null;
    return availability.habitaciones.find((h) => h.room_id === selectedRoom) ?? null;
  }, [availability, selectedRoom]);

  const dispoByDate = useMemo(() => {
    const map = new Map<string, boolean>();
    if (availability && roomAvailability) {
      availability.dias.forEach((d, i) => map.set(d, roomAvailability.disponible[i]));
    }
    return map;
  }, [availability, roomAvailability]);

  function handleSelectDay(date: string) {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }
    if (date <= checkIn) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }
    // Verifica que TODO el rango este realmente disponible, no solo los extremos.
    let d = checkIn;
    let allFree = true;
    while (d < date) {
      if (dispoByDate.get(d) === false) {
        allFree = false;
        break;
      }
      const next = new Date(d + "T00:00:00");
      next.setDate(next.getDate() + 1);
      d = next.toISOString().slice(0, 10);
    }
    if (!allFree) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }
    setCheckOut(date);
  }

  const nights = checkIn && checkOut ? Math.round((+new Date(checkOut) - +new Date(checkIn)) / 86400000) : 0;
  const rate = availability && selectedRoom ? availability.tarifas[selectedRoom] : null;
  const estimatedTotal = rate && nights >= 2 ? estimatePrice(rate, plan, currency, nights, childrenAges) : null;

  function addChild() {
    setChildrenAges((ages) => [...ages, 5]);
  }
  function updateChildAge(index: number, age: number) {
    setChildrenAges((ages) => ages.map((a, i) => (i === index ? age : a)));
  }
  function removeChild(index: number) {
    setChildrenAges((ages) => ages.filter((_, i) => i !== index));
  }

  const canSubmit = selectedRoom && checkIn && checkOut && nights >= 2 && fullName.trim() && (email.trim() || whatsapp.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !selectedRoom || !checkIn || !checkOut) return;
    setSubmitState("loading");
    const result = await createBooking({
      RoomID: selectedRoom,
      CheckIn: checkIn,
      CheckOut: checkOut,
      Plan: plan,
      Currency: currency,
      Adults: adults,
      ChildrenAges: childrenAges,
      Guest: {
        FullName: fullName,
        Contact: { Email: email || undefined, WhatsApp: whatsapp || undefined },
        OriginCountry: originCountry || undefined,
        SpecialNotes: specialNotes || undefined,
        Preferences: preferredActivity ? { actividad_preferida: preferredActivity } : undefined,
      },
    });
    setSubmitResult(result);
    setSubmitState("done");
  }

  async function handleSimulatePayment() {
    if (!submitResult?.ok) return;
    setPaymentState("loading");
    setPaymentError(null);
    const result = await simulatePayment(submitResult.BookingID);
    if (result.ok) {
      setPaymentState("confirmed");
    } else {
      setPaymentState("error");
      setPaymentError(result.error);
    }
  }

  return (
    <main>
      <div className={styles.hero}>
        <Container>
          <h1 className={styles.title}>Reservar</h1>
        </Container>
      </div>

      <Container>
        {loadError && <div className={`${styles.statusBox} ${styles.statusError}`}>{loadError} — escríbenos por WhatsApp: +56 9 7267 3885.</div>}

        {!loadError && !availability && <p>Cargando disponibilidad…</p>}

        {availability && (
          <>
            <p className={styles.intro}>
              Elegí una habitación para ver su calendario real de disponibilidad. Seleccioná primero la fecha de
              llegada y después la de salida (mínimo 2 noches) — los días no disponibles aparecen tachados. El precio
              se actualiza solo a medida que completás los pasos.
            </p>
            <FlightRouteSuggestion />
          </>
        )}

        {availability && (
          <form className={styles.layout} onSubmit={handleSubmit}>
            <div>
              <div className={styles.step}>
                <span className={styles.stepLabel}>1 · Habitación</span>
                <div className={styles.roomGrid}>
                  {availability.habitaciones.map((h) => (
                    <button
                      type="button"
                      key={h.room_id}
                      className={`${styles.roomBtn} ${selectedRoom === h.room_id ? styles.roomBtnActive : ""}`}
                      onClick={() => {
                        setSelectedRoom(h.room_id);
                        setCheckIn(null);
                        setCheckOut(null);
                        setTimeout(() => calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                      }}
                    >
                      <span className={styles.roomBtnPhoto}>
                        <Image src={ROOM_PHOTOS[h.room_id].src} alt={ROOM_PHOTOS[h.room_id].alt} fill sizes="200px" />
                      </span>
                      <span className={styles.roomBtnBody}>
                        <strong>{ROOM_LABELS[h.room_id]}</strong>
                        Desde {availability.tarifas[h.room_id].basico_clp.toLocaleString("es-CL")} CLP / noche
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.step} ref={calendarRef}>
                <span className={styles.stepLabel}>Selecciona las fechas (mínimo 2 noches)</span>
                {roomAvailability && (
                  <AvailabilityCalendar
                    dias={availability.dias}
                    disponible={roomAvailability.disponible}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onSelectDay={handleSelectDay}
                  />
                )}
              </div>

              <div className={styles.step}>
                <span className={styles.stepLabel}>3 · Plan y huéspedes</span>
                <div className={styles.controlRow}>
                  <div className={styles.selectField}>
                    <span className={styles.selectLabel}>Plan</span>
                    <select className={styles.select} value={plan} onChange={(e) => setPlan(e.target.value as "basico" | "media_pension")}>
                      <option value="basico">Plan Básico (aloj. + desayuno)</option>
                      <option value="media_pension">Media Pensión (+ cena)</option>
                    </select>
                  </div>
                  <div className={styles.selectField}>
                    <span className={styles.selectLabel}>Moneda</span>
                    <select className={styles.select} value={currency} onChange={(e) => setCurrency(e.target.value as "CLP" | "USD")}>
                      <option value="CLP">CLP (chilenos y residentes, +IVA)</option>
                      <option value="USD">USD (extranjeros)</option>
                    </select>
                  </div>
                  <div className={styles.selectField}>
                    <span className={styles.selectLabel}>Adultos</span>
                    <select className={styles.select} value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                    </select>
                  </div>
                </div>
                <div className={styles.childrenRow}>
                  {childrenAges.map((age, i) => (
                    <span key={i} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <input
                        type="number"
                        min={0}
                        max={17}
                        className={styles.childAgeInput}
                        value={age}
                        onChange={(e) => updateChildAge(i, Number(e.target.value))}
                        aria-label={`Edad del niño ${i + 1}`}
                      />
                      <button type="button" className={styles.removeChildBtn} onClick={() => removeChild(i)}>
                        Quitar
                      </button>
                    </span>
                  ))}
                  <button type="button" className={styles.addChildBtn} onClick={addChild}>
                    + Agregar niño (0-2 gratis · 2-12 50% · 13+ 60%)
                  </button>
                </div>
              </div>

              <div className={styles.step}>
                <span className={styles.stepLabel}>¿Qué actividad te interesa más?</span>
                <div className={styles.activityGrid}>
                  {ACTIVITY_OPTIONS.map((activity) => (
                    <label
                      key={activity}
                      className={`${styles.activityOption} ${preferredActivity === activity ? styles.activityOptionActive : ""}`}
                    >
                      <input
                        type="radio"
                        name="preferredActivity"
                        value={activity}
                        checked={preferredActivity === activity}
                        onChange={() => setPreferredActivity(activity)}
                      />
                      {activity}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.step}>
                <span className={styles.stepLabel}>4 · Tus datos</span>
                <div className={styles.formGrid}>
                  <FormField label="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <FormField label="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                  <FormField label="País" value={originCountry} onChange={(e) => setOriginCountry(e.target.value)} />
                </div>
                <div style={{ marginTop: "16px" }}>
                  <FormField
                    as="textarea"
                    label="Notas (dietas, movilidad, hora estimada de llegada)"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.sidebarSticky}>
            <aside className={styles.summary}>
              {selectedRoom && (
                <div className={styles.summaryPhoto}>
                  <Image src={ROOM_PHOTOS[selectedRoom].src} alt={ROOM_PHOTOS[selectedRoom].alt} fill sizes="360px" />
                </div>
              )}
              <span className={styles.summaryTitle}>{selectedRoom ? ROOM_LABELS[selectedRoom] : "—"}</span>
              <div className={styles.summaryRow}>
                <span>Check-in</span>
                <span>{checkIn ?? "—"}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Check-out</span>
                <span>{checkOut ?? "—"}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Noches</span>
                <span>{nights || "—"}</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Total estimado</span>
                <span>{estimatedTotal ? `${estimatedTotal.toLocaleString("es-CL")} ${CURRENCY_LABEL[currency]}` : "—"}</span>
              </div>
              <p className={styles.note}>
                El precio final se confirma al recibir tu solicitud. Sin pasarela de pago activa todavía: la reserva queda{" "}
                <strong>pendiente</strong> y te contactamos dentro de 24h para confirmar y coordinar el pago.
              </p>

              <Button type="submit" variant="primary" disabled={!canSubmit || submitState === "loading"}>
                {submitState === "loading" ? "Enviando…" : "Enviar solicitud de reserva"}
              </Button>

              {submitState === "done" && submitResult && (
                <div className={`${styles.statusBox} ${submitResult.ok ? styles.statusSuccess : styles.statusError}`}>
                  {submitResult.ok ? (
                    <>
                      <strong>Solicitud recibida.</strong> {submitResult.message} N° de reserva: {submitResult.BookingID}.
                    </>
                  ) : (
                    <>{submitResult.error}</>
                  )}
                </div>
              )}

              {submitState === "done" && submitResult?.ok && paymentState !== "confirmed" && (
                <div className={styles.demoPayment}>
                  <span className={styles.demoBadge}>Modo demo — pago simulado</span>
                  <p className={styles.note}>
                    No se pide ni se procesa ningún dato de tarjeta real ni falso. Este botón solo simula lo que haría
                    la pasarela de pago real el día que exista ({"[PASARELA]"} sigue sin definir) — confirma la
                    reserva de verdad en el PMS.
                  </p>
                  <div className={styles.demoOrderRow}>
                    <span>Total a &quot;cobrar&quot;</span>
                    <strong>
                      {estimatedTotal ? `${estimatedTotal.toLocaleString("es-CL")} ${CURRENCY_LABEL[currency]}` : "—"}
                    </strong>
                  </div>
                  <Button type="button" variant="secondary" onClick={handleSimulatePayment} disabled={paymentState === "loading"}>
                    {paymentState === "loading" ? "Procesando pago simulado…" : "Simular pago aprobado"}
                  </Button>
                  {paymentState === "error" && paymentError && (
                    <div className={`${styles.statusBox} ${styles.statusError}`}>{paymentError}</div>
                  )}
                </div>
              )}

              {paymentState === "confirmed" && (
                <div className={`${styles.statusBox} ${styles.statusSuccess}`}>
                  <strong>Pago simulado aprobado.</strong> La reserva quedó <strong>CONFIRMED</strong> en el PMS real — ya
                  es visible así en el Dashboard del dueño.
                </div>
              )}
            </aside>

            <div className={styles.considerations}>
              <span className={styles.considerationsTitle}>Antes de reservar</span>
              <div className={styles.considerationItem}>
                <span className={styles.considerationIcon} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="8.5" cy="9" r="1.6" />
                    <circle cx="12" cy="6.5" r="1.6" />
                    <circle cx="15.5" cy="9" r="1.6" />
                    <path d="M9 15c0-2.2 1.5-3.5 3-3.5s3 1.3 3 3.5-1.5 3.5-3.5 3.5S9 17.2 9 15Z" />
                    <line x1="3" y1="3" x2="21" y2="21" />
                  </svg>
                </span>
                <span>No se aceptan mascotas — estamos a los pies de un parque nacional.</span>
              </div>
              <div className={styles.considerationItem}>
                <span className={styles.considerationIcon} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
                  </svg>
                </span>
                <span>El seguro de viaje no está incluido.</span>
              </div>
              <div className={styles.considerationItem}>
                <span className={styles.considerationIcon} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M3 16V9a1 1 0 0 1 1-1h9l4 4h3a1 1 0 0 1 1 1v3" />
                    <path d="M3 16h15" />
                    <circle cx="7" cy="18" r="1.8" />
                    <circle cx="17" cy="18" r="1.8" />
                  </svg>
                </span>
                <span>¿Necesitás transporte desde Balmaceda? Avísanos en las notas.</span>
              </div>
            </div>
            </div>
          </form>
        )}
      </Container>
    </main>
  );
}
