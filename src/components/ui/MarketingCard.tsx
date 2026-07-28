import Image from "next/image";
import Link from "next/link";
import styles from "./MarketingCard.module.css";
import { Button } from "./Button";

type ImageProp = { src: string; alt: string };

type PhotoCardProps = {
  variant: "photo";
  image: ImageProp;
  eyebrow: string;
  title: string;
};

type InfoCardProps = {
  variant: "info";
  eyebrow: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
};

type QuoteCardProps = {
  variant: "quote";
  quote: string;
  author: string;
  date: string;
};

type RoomCardProps = {
  variant: "room";
  image: ImageProp;
  title: string;
  text: string;
  priceLabel: string;
  ctaLabel: string;
  ctaHref: string;
};

type MarketingCardProps = PhotoCardProps | InfoCardProps | QuoteCardProps | RoomCardProps;

/** 11 — Tarjetas de marketing (Figma): 4 variantes ya especificadas en el design system. */
export function MarketingCard(props: MarketingCardProps) {
  if (props.variant === "photo") {
    return (
      <div className={`${styles.card} ${styles.photo}`}>
        <Image src={props.image.src} alt={props.image.alt} fill className={styles.photoImage} sizes="(max-width: 640px) 100vw, 33vw" />
        <div className={styles.photoOverlay} />
        <div className={styles.photoCaption}>
          <span className={styles.photoEyebrow}>{props.eyebrow}</span>
          <span className={styles.photoTitle}>{props.title}</span>
        </div>
      </div>
    );
  }

  if (props.variant === "info") {
    return (
      <div className={`${styles.card} ${styles.info}`}>
        <span className={styles.infoEyebrow}>{props.eyebrow}</span>
        <span className={styles.cardTitle}>{props.title}</span>
        <p className={styles.infoText}>{props.text}</p>
        <Link href={props.ctaHref} className={styles.infoCta}>
          {props.ctaLabel} →
        </Link>
      </div>
    );
  }

  if (props.variant === "quote") {
    return (
      <div className={`${styles.card} ${styles.quote}`}>
        <p className={styles.quoteText}>&ldquo;{props.quote}&rdquo;</p>
        <span className={styles.quoteAuthor}>
          {props.author} · {props.date}
        </span>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${styles.room}`}>
      <div className={styles.roomImage}>
        <Image src={props.image.src} alt={props.image.alt} fill className={styles.roomImageEl} sizes="(max-width: 640px) 100vw, 25vw" />
      </div>
      <div className={styles.roomBody}>
        <span className={styles.cardTitle}>{props.title}</span>
        <p className={styles.roomText}>{props.text}</p>
        <div className={styles.roomFooter}>
          <span className={styles.roomPrice}>{props.priceLabel}</span>
          <Button variant="secondary" href={props.ctaHref}>
            {props.ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
