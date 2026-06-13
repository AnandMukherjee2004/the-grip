import { CheckIcon } from "@/components/ui/CheckIcon";
import { Dashboard } from "@/components/dashboard/Dashboard";

const CONNECTORS = [
  { name: "Leadsquared", left: 260, top: 40 },
  { name: "HubSpot", left: 469, top: 192 },
  { name: "Shopify", left: 389, top: 438 },
  { name: "Razorpay", left: 131, top: 438 },
  { name: "Meta Ads", left: 51, top: 192 },
];

export function SolutionSection() {
  return (
    <section className="sec solution" id="solution" data-screen-label="03 Solution">
      <div className="sec-inner">
        <div className="sec-head">
          <p className="label" data-rv>
            The Solution
          </p>
          <h2
            className="opener display stretch-in"
            data-rv
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            What if they
            <br />
            all spoke the
            <br />
            same language?
          </h2>
          <p
            className="body-lg"
            data-rv
            style={{ "--d": "160ms" } as React.CSSProperties}
          >
            Revline sits between your tools and translates everything into one
            live picture. No setup. No data team. 15 minutes.
          </p>
        </div>

        <div className="solution-stage">
          <div className="solution-glow" aria-hidden />

          <div className="conn" aria-hidden>
            <svg className="conn-svg" viewBox="0 0 520 520">
              <defs>
                <linearGradient
                  id="bg0"
                  gradientUnits="userSpaceOnUse"
                  x1="260"
                  y1="40"
                  x2="260"
                  y2="200"
                >
                  <stop offset="0" stopColor="#E8702A" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient
                  id="bg1"
                  gradientUnits="userSpaceOnUse"
                  x1="469"
                  y1="192"
                  x2="317"
                  y2="241"
                >
                  <stop offset="0" stopColor="#FF7A59" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient
                  id="bg2"
                  gradientUnits="userSpaceOnUse"
                  x1="389"
                  y1="438"
                  x2="295"
                  y2="309"
                >
                  <stop offset="0" stopColor="#95BF47" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient
                  id="bg3"
                  gradientUnits="userSpaceOnUse"
                  x1="131"
                  y1="438"
                  x2="225"
                  y2="309"
                >
                  <stop offset="0" stopColor="#3395FF" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient
                  id="bg4"
                  gradientUnits="userSpaceOnUse"
                  x1="51"
                  y1="192"
                  x2="203"
                  y2="241"
                >
                  <stop offset="0" stopColor="#0866FF" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
              </defs>
              <line
                className="beam"
                pathLength={1}
                x1="260"
                y1="40"
                x2="260"
                y2="200"
                stroke="url(#bg0)"
              />
              <line
                className="beam"
                pathLength={1}
                x1="469"
                y1="192"
                x2="317"
                y2="241"
                stroke="url(#bg1)"
              />
              <line
                className="beam"
                pathLength={1}
                x1="389"
                y1="438"
                x2="295"
                y2="309"
                stroke="url(#bg2)"
              />
              <line
                className="beam"
                pathLength={1}
                x1="131"
                y1="438"
                x2="225"
                y2="309"
                stroke="url(#bg3)"
              />
              <line
                className="beam"
                pathLength={1}
                x1="51"
                y1="192"
                x2="203"
                y2="241"
                stroke="url(#bg4)"
              />
            </svg>
            {CONNECTORS.map((c) => (
              <span
                key={c.name}
                className="conn-chip"
                style={{
                  left: c.left,
                  top: c.top,
                  transform: "translate(-50%,-50%)",
                }}
              >
                {c.name}
                <CheckIcon className="ok" />
              </span>
            ))}
            <div className="hub">
              <span className="hub-line" />
              <span className="hub-name">Revline</span>
            </div>
          </div>

          <div className="dash-wrap" data-dash-slot>
            <Dashboard
              counterRef={undefined}
              pillRef={undefined}
              toastRef={undefined}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
