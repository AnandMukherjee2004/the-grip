import { CheckIcon } from "@/components/ui/CheckIcon";

const STARTER_FEATURES = [
  "Up to 4 connectors",
  "1 workspace",
  "Dashboard + Automation",
  "Email support",
];

const GROWTH_FEATURES = [
  "Unlimited connectors",
  "3 workspaces",
  "Dashboard + Automation",
  "+ Attribution reports",
  "+ Agent performance",
  "Priority support",
];

export function PricingSection() {
  return (
    <section className="sec pricing" id="pricing" data-screen-label="07 Pricing">
      <div className="sec-inner">
        <div className="sec-head">
          <h2 className="opener display" data-rv>
            Simple pricing.
            <br />
            No surprises.
          </h2>
          <p
            className="sub"
            data-rv
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            Priced in INR. Billed annually. Cancel anytime.
          </p>
        </div>
        <div className="plans">
          <div
            className="plan"
            data-rv
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            <p className="plan-name">Starter</p>
            <p className="plan-price mono">
              ₹12,000 <span className="per">/mo</span>
            </p>
            <p className="plan-bill">(billed annually)</p>
            <ul className="plan-feats">
              {STARTER_FEATURES.map((feat) => (
                <li key={feat}>
                  <CheckIcon />
                  {feat}
                </li>
              ))}
            </ul>
            <a href="/onboarding/tools" className="btn btn-ghost">
              Start free trial
            </a>
          </div>
          <div
            className="plan growth"
            data-rv
            style={{ "--d": "100ms" } as React.CSSProperties}
          >
            <p className="plan-pop">✦ MOST POPULAR</p>
            <p className="plan-name">Growth</p>
            <p className="plan-price mono">
              ₹22,000 <span className="per">/mo</span>
            </p>
            <p className="plan-bill">(billed annually)</p>
            <ul className="plan-feats">
              {GROWTH_FEATURES.map((feat) => (
                <li key={feat}>
                  <CheckIcon />
                  {feat}
                </li>
              ))}
            </ul>
            <a href="/onboarding/tools" className="btn btn-gradient">
              Start free trial
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
