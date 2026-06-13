import { ChatThread } from "./ChatThread";

const TOOL_CHIPS = [
  { name: "Leadsquared", top: "2%", left: "62%", delay: "0ms" },
  { name: "HubSpot", top: "24%", left: "78%", delay: "100ms" },
  { name: "Shopify", top: "48%", left: "64%", delay: "200ms" },
  { name: "Razorpay", top: "67%", left: "80%", delay: "300ms" },
  { name: "Meta Ads", top: "86%", left: "66%", delay: "400ms" },
];

const MESSAGES = [
  {
    avatar: "M",
    avatarClass: "blue",
    name: "Marketing",
    time: "Mon 9:02 AM",
    text: "We generated 847 leads this week",
    delay: "0ms",
  },
  {
    avatar: "S",
    avatarClass: "orange",
    name: "Sales",
    time: "Mon 9:17 AM",
    text: "That can't be right. We only see 421 in the CRM.",
    delay: "450ms",
  },
  {
    avatar: "F",
    avatarClass: "grey",
    name: "Finance",
    time: "Mon 9:44 AM",
    text: "Accounts shows 63 conversions. Which number do we report?",
    delay: "900ms",
  },
  {
    avatar: "C",
    avatarClass: "white",
    name: "CEO",
    time: "Mon 10:02 AM",
    text: "Someone give me ONE number by EOD.",
    delay: "1350ms",
  },
];

export function ProblemSection() {
  return (
    <section className="sec problem" data-screen-label="02 Problem">
      <div className="sec-inner">
        <div className="sec-head">
          <p className="label" data-rv>
            The Problem
          </p>
          <h2
            className="opener display"
            data-rv
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            Monday morning.
            <br />
            Four tools.
            <br />
            Zero answers.
          </h2>
          <p
            className="body-lg"
            data-rv
            style={{ "--d": "160ms" } as React.CSSProperties}
          >
            Your VP of Sales needs one number: how much revenue did we make last
            week? This is what actually happens.
          </p>
        </div>

        <div className="chaos">
          <svg
            className="person-svg"
            viewBox="0 0 120 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="34" cy="34" r="9" />
            <path d="M34 43 C29 52 27 62 27 84" />
            <path d="M33 52 C42 60 50 64 58 66" />
            <path d="M10 84 H112" />
            <rect x="62" y="40" width="38" height="26" rx="2" />
            <path d="M81 66 V84" />
            <path d="M27 84 C20 90 18 94 18 98" />
          </svg>

          <svg
            className="chaos-svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              className="chaos-arrow"
              pathLength={1}
              style={
                { "--d": "200ms", stroke: "#565680" } as React.CSSProperties
              }
              d="M18 42 C35 10 55 70 66 16"
            />
            <path
              className="chaos-arrow"
              pathLength={1}
              style={
                { "--d": "500ms", stroke: "#4A6FA5" } as React.CSSProperties
              }
              d="M18 48 C40 82 50 18 80 32"
            />
            <path
              className="chaos-arrow"
              pathLength={1}
              style={
                { "--d": "800ms", stroke: "#57867B" } as React.CSSProperties
              }
              d="M18 54 C30 28 58 92 70 56"
            />
            <path
              className="chaos-arrow"
              pathLength={1}
              style={
                { "--d": "1100ms", stroke: "#8A7A55" } as React.CSSProperties
              }
              d="M18 60 C46 42 42 96 84 74"
            />
            <path
              className="chaos-arrow broken"
              pathLength={1}
              style={{ "--d": "1900ms" } as React.CSSProperties}
              d="M18 50 C36 64 50 34 70 90"
            />
            <g
              className="chaos-x"
              stroke="#FF4D6D"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            >
              <path
                d="M46.6 56.5 L49.4 61.5"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M49.4 56.5 L46.6 61.5"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </svg>

          {TOOL_CHIPS.map((chip) => (
            <span
              key={chip.name}
              className="tool-chip"
              style={
                {
                  top: chip.top,
                  left: chip.left,
                  "--d": chip.delay,
                } as React.CSSProperties
              }
            >
              {chip.name}
            </span>
          ))}
        </div>

        <ChatThread messages={MESSAGES} />

        <p className="punchline" data-rv>
          This conversation happens at 847 companies in India.
          <br />
          Every. Single. Monday.
        </p>
      </div>
    </section>
  );
}
