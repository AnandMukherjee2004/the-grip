import { CheckIcon } from "@/components/ui/CheckIcon";
import { ClockIcon } from "@/components/ui/ClockIcon";
import { Dashboard } from "@/components/dashboard/Dashboard";

const CONNECT_TOOLS = [
  { name: "Leadsquared", top: "1%", delay: "0ms" },
  { name: "HubSpot", top: "21%", delay: "150ms" },
  { name: "Shopify", top: "41%", delay: "300ms" },
  { name: "Razorpay", top: "61%", delay: "450ms" },
  { name: "Meta Ads", top: "81%", delay: "600ms" },
];

function PanelCopy({
  num,
  title,
  body,
  time,
}: {
  num: string;
  title: React.ReactNode;
  body: string;
  time: string;
}) {
  return (
    <div className="panel-copy">
      <p className="panel-num mono pstage" style={{ "--d": "0ms" } as React.CSSProperties}>
        {num}
      </p>
      <h3
        className="panel-h pstage"
        style={{ "--d": "80ms" } as React.CSSProperties}
      >
        {title}
      </h3>
      <p
        className="panel-body pstage"
        style={{ "--d": "160ms" } as React.CSSProperties}
      >
        {body}
      </p>
      <span
        className="time-badge pstage"
        style={{ "--d": "240ms" } as React.CSSProperties}
      >
        <ClockIcon />
        {time}
      </span>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section className="how" id="how" data-screen-label="04 How it works">
      <div className="how-pin">
        <div className="how-head">
          <p className="label" data-rv>
            How It Works
          </p>
          <h2
            className="opener display"
            data-rv
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            Three steps. Fifteen minutes. One pipeline.
          </h2>
        </div>
        <div className="how-track">
          <div className="panel" data-screen-label="04a Step 1">
            <div className="connect-diagram">
              <svg
                className="connect-svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  style={{ "--d": "500ms" } as React.CSSProperties}
                  pathLength={1}
                  d="M32 6 C58 6 62 50 82 50"
                />
                <path
                  style={{ "--d": "650ms" } as React.CSSProperties}
                  pathLength={1}
                  d="M32 27 C58 27 62 50 82 50"
                />
                <path
                  style={{ "--d": "800ms" } as React.CSSProperties}
                  pathLength={1}
                  d="M32 50 C58 50 62 50 82 50"
                />
                <path
                  style={{ "--d": "950ms" } as React.CSSProperties}
                  pathLength={1}
                  d="M32 73 C58 73 62 50 82 50"
                />
                <path
                  style={{ "--d": "1100ms" } as React.CSSProperties}
                  pathLength={1}
                  d="M32 94 C58 94 62 50 82 50"
                />
              </svg>
              {CONNECT_TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  className="conn-card"
                  style={
                    {
                      top: tool.top,
                      "--d": tool.delay,
                    } as React.CSSProperties
                  }
                >
                  <span className="cname">{tool.name}</span>
                  <span className="cbadge">
                    <CheckIcon />
                    Connected
                  </span>
                </div>
              ))}
              <div className="connect-node">
                <span className="hub-line" />
                <span className="hub-name">Revline</span>
              </div>
            </div>
            <PanelCopy
              num="01"
              title={
                <>
                  Pick your tools.
                  <br />
                  Click connect.
                </>
              }
              body="Leadsquared, HubSpot, Shopify, Razorpay, Meta Ads. OAuth in one click. No API keys. No developer needed. We map your stages automatically."
              time="Takes 4 minutes"
            />
          </div>

          <div className="panel" data-screen-label="04b Step 2">
            <div className="map-ui">
              <svg
                className="map-svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  style={
                    { "--d": "400ms", stroke: "#6366F1" } as React.CSSProperties
                  }
                  pathLength={1}
                  d="M31 51 C36 51 33 51 38 51"
                />
                <path
                  style={
                    { "--d": "900ms", stroke: "#34D399" } as React.CSSProperties
                  }
                  pathLength={1}
                  d="M69 51 C76 51 72 26 79 26"
                />
              </svg>
              <div className="map-col" style={{ left: 0, top: 48 }}>
                <p className="map-col-title">Leadsquared</p>
                <div className="map-item pstage" style={{ "--d": "0ms" } as React.CSSProperties}>
                  Lead captured
                </div>
                <div className="map-item pstage" style={{ "--d": "60ms" } as React.CSSProperties}>
                  Demo booked
                </div>
                <div className="map-item hot pstage" style={{ "--d": "120ms" } as React.CSSProperties}>
                  Sale Done
                </div>
              </div>
              <div
                className="map-col"
                style={{ left: "50%", top: 48, transform: "translateX(-50%)" }}
              >
                <p className="map-col-title">Revline</p>
                <div className="map-item pstage" style={{ "--d": "180ms" } as React.CSSProperties}>
                  New
                </div>
                <div className="map-item pstage" style={{ "--d": "240ms" } as React.CSSProperties}>
                  Qualified
                </div>
                <div className="map-item hot pstage" style={{ "--d": "300ms" } as React.CSSProperties}>
                  Closed Won
                </div>
              </div>
              <div className="map-col" style={{ right: 0, top: 48 }}>
                <p className="map-col-title">Shopify</p>
                <div className="map-item win-item pstage" style={{ "--d": "360ms" } as React.CSSProperties}>
                  Order created
                </div>
              </div>
              <span
                className="ai-badge pstage"
                style={{ "--d": "1400ms" } as React.CSSProperties}
              >
                We auto-detected 8 of your 9 stages.
              </span>
            </div>
            <PanelCopy
              num="02"
              title={
                <>
                  We speak
                  <br />
                  your CRM&apos;s dialect.
                </>
              }
              body="Leadsquared calls it 'Sale Done'. HubSpot calls it 'Closed Won'. We connect the dots so you never have to."
              time="Takes 6 minutes"
            />
          </div>

          <div className="panel" data-screen-label="04c Step 3">
            <div
              className="live-dash-slot pstage"
              style={{ "--d": "120ms" } as React.CSSProperties}
              data-live-dash-slot
            >
              <Dashboard initialCounter="₹14,20,000" />
            </div>
            <PanelCopy
              num="03"
              title={
                <>
                  Your Monday
                  <br />
                  just changed.
                </>
              }
              body="Every lead. Every sale. Every order. One screen. Updated every 5 minutes. No spreadsheets. No Slack pings."
              time="Takes 5 minutes"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
