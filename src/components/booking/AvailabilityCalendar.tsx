"use client";

import { useMemo, useState } from "react";
import styles from "./AvailabilityCalendar.module.css";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

type Props = {
  dias: string[];
  disponible: boolean[];
  checkIn: string | null;
  checkOut: string | null;
  onSelectDay: (date: string) => void;
};

/** Calendario real de disponibilidad (brief §8.2): solo libre/no disponible, nunca datos operativos. */
export function AvailabilityCalendar({ dias, disponible, checkIn, checkOut, onSelectDay }: Props) {
  const dispoByDate = useMemo(() => {
    const map = new Map<string, boolean>();
    dias.forEach((d, i) => map.set(d, disponible[i]));
    return map;
  }, [dias, disponible]);

  const months = useMemo(() => {
    const seen = new Map<string, string>(); // "YYYY-MM" -> primer dia de ese mes en dias[]
    for (const d of dias) {
      const key = d.slice(0, 7);
      if (!seen.has(key)) seen.set(key, d);
    }
    return Array.from(seen.keys());
  }, [dias]);

  const [monthIndex, setMonthIndex] = useState(0);
  const currentMonthKey = months[monthIndex];

  const cells = useMemo(() => {
    if (!currentMonthKey) return [];
    const [year, month] = currentMonthKey.split("-").map(Number);
    const firstOfMonth = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    // Lunes=0 ... Domingo=6
    const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
    const out: { date: string | null }[] = Array.from({ length: leadingBlanks }, () => ({ date: null }));
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      out.push({ date: dispoByDate.has(dateStr) ? dateStr : null });
    }
    return out;
  }, [currentMonthKey, dispoByDate]);

  if (!currentMonthKey) {
    return <p>Cargando disponibilidad…</p>;
  }

  const [year, month] = currentMonthKey.split("-").map(Number);

  function classify(date: string) {
    const isAvailable = dispoByDate.get(date);
    const isCheckIn = date === checkIn;
    const isCheckOut = date === checkOut;
    const inRange = checkIn && checkOut && date > checkIn && date < checkOut;
    const classes = [styles.day];
    if (!isAvailable) classes.push(styles.dayUnavailable);
    else classes.push(styles.dayAvailable);
    if (inRange) classes.push(styles.dayInRange);
    if (isCheckIn || isCheckOut) classes.push(styles.daySelected);
    return classes.join(" ");
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.nav}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => setMonthIndex((i) => Math.max(0, i - 1))}
          disabled={monthIndex === 0}
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <span className={styles.monthLabel}>
          {MONTH_NAMES[month - 1]} {year}
        </span>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => setMonthIndex((i) => Math.min(months.length - 1, i + 1))}
          disabled={monthIndex === months.length - 1}
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </div>
      <div className={styles.weekdays}>
        {WEEKDAYS.map((w) => (
          <span key={w} className={styles.weekday}>
            {w}
          </span>
        ))}
      </div>
      <div className={styles.grid}>
        {cells.map((cell, i) =>
          cell.date ? (
            <button
              key={cell.date}
              type="button"
              className={classify(cell.date)}
              disabled={!dispoByDate.get(cell.date)}
              onClick={() => onSelectDay(cell.date!)}
            >
              {Number(cell.date.slice(8, 10))}
            </button>
          ) : (
            <span key={`blank-${i}`} className={`${styles.day} ${styles.dayEmpty}`} />
          )
        )}
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: "var(--color-forest)" }} />
          Seleccionado
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: "var(--color-sage)" }} />
          En el rango
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: "var(--color-bg-alt)", textDecoration: "line-through" }} />
          No disponible
        </span>
      </div>
    </div>
  );
}
