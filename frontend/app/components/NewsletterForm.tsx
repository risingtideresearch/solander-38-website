"use client";

import { useState } from "react";
import styles from "./newsletter.module.scss";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "already_subscribed" | "blocked" | "error"
  >("idle");

  async function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setState("success");
    } else {
      const { error } = await res.json();
      if (error === "already_subscribed") setState("already_subscribed");
      else if (error === "subscriber_blocked") setState("blocked");
      else setState("error");
    }
  }

  if (state === "success") return <p>Thanks for subscribing!</p>;
  if (state === "already_subscribed") return <p>You&rsquo;re already subscribed!</p>;

  return (
    <>
      <form className={styles.form} onSubmit={submit} autoComplete="on">
        <input
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
        />
        <button
          className={styles.button}
          type="submit"
          disabled={state === "loading"}
        >
          {state === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      {state === "error" && (
        <p className={styles.error}>Something went wrong — please try again.</p>
      )}
      {state === "blocked" && (
        <p className={styles.error}>
          Unable to subscribe — please email us at info@risingtideresearch.org.
        </p>
      )}
    </>
  );
}
