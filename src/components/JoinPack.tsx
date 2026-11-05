"use client";

import { useRef, useState, type FormEvent } from "react";

// Launch-list signup. Not wired to an email service yet: connect `submit` to your
// provider (Klaviyo, Mailchimp, Buttondown…) before launch, or addresses are lost.
export default function JoinPack() {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const el = input.current!;
    if (!el.value.trim()) {
      setError("Add your email so we can tell you when we open.");
      el.focus();
      return;
    }
    if (!el.checkValidity()) {
      setError("That email is missing something. Try the format name@example.com.");
      el.focus();
      return;
    }
    setError("");
    setDone(true);
  };

  return (
    <section className="join rv" id="join" aria-labelledby="joinH">
      <h2 className="h2 fat" id="joinH">Join the pack.</h2>
      <p>One email when we open. Probably a dog photo too.</p>
      {done ? (
        <p className="ok" role="status">You&apos;re in. Welcome to the pack.</p>
      ) : (
        <>
          <form className={`form${error ? " bad" : ""}`} onSubmit={submit} noValidate>
            <label className="sr" htmlFor="em">Email address</label>
            <input
              ref={input}
              id="em"
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
              aria-describedby="emErr"
              aria-invalid={error ? true : undefined}
              required
              onInput={() => error && input.current!.checkValidity() && setError("")}
            />
            <button className="btn" type="submit">Join the pack</button>
          </form>
          <p className="err" id="emErr" aria-live="polite">{error}</p>
        </>
      )}
    </section>
  );
}
