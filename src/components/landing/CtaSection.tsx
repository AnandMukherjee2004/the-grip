export function CtaSection() {
  return (
    <section className="sec cta" id="cta" data-screen-label="08 Final CTA">
      <div className="cta-galaxy" aria-hidden />
      <div className="cta-inner">
        <p className="label" data-rv>
          Start Your Free Trial
        </p>
        <h2
          className="cta-h stretch-in"
          data-rv
          style={{ "--d": "80ms" } as React.CSSProperties}
        >
          Priya&apos;s Monday
          <br />
          starts in 4 minutes.
        </h2>
        <p
          className="cta-body"
          data-rv
          style={{ "--d": "160ms" } as React.CSSProperties}
        >
          Connect your first tool in 60 seconds. No credit card. No engineer
          required. Just your pipeline, finally in one place.
        </p>
        <a
          href="/onboarding"
          className="btn btn-gradient"
          data-rv
          style={{ "--d": "240ms" } as React.CSSProperties}
        >
          Start for free&nbsp;&nbsp;→
        </a>
        <p
          className="cta-fine"
          data-rv
          style={{ "--d": "320ms" } as React.CSSProperties}
        >
          14-day free trial · ₹0 to start · Cancel anytime
        </p>
      </div>
    </section>
  );
}
