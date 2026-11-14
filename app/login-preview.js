"use client";

export default function LoginPreview() {
  return (
    <div className="auth-overlay">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-icon" aria-hidden="true">✳</div>
        <p className="eyebrow">WELCOME TO BOOKS</p>
        <h2 id="login-title">Good to see you.</h2>
        <p>Sign in to explore your reading list.</p>
        <form onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" placeholder="you@example.com" autoComplete="email" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Enter your password" autoComplete="current-password" />
          <button type="submit">Sign in <span aria-hidden="true">↗</span></button>
        </form>
        <p className="auth-note">Preview only. Sign-in is not enabled.</p>
      </section>
    </div>
  );
}
