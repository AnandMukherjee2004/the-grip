import { ChatThread } from "./ChatThread";

const BEFORE_MESSAGES = [
  {
    avatar: "M",
    avatarClass: "blue",
    name: "Marketing",
    time: "Mon 9:02 AM",
    text: "We generated 847 leads this week",
  },
  {
    avatar: "S",
    avatarClass: "orange",
    name: "Sales",
    time: "Mon 9:17 AM",
    text: "That can't be right. We only see 421 in the CRM.",
  },
  {
    avatar: "C",
    avatarClass: "white",
    name: "CEO",
    time: "Mon 10:02 AM",
    text: "Someone give me ONE number by EOD.",
  },
];

export function BeforeAfterSection() {
  return (
    <section className="sec ba" data-screen-label="06 Before / After">
      <div className="sec-inner">
        <div className="ba-grid">
          <div className="ba-panel before">
            <p className="ba-label rose-l">Before</p>
            <div className="ba-visual">
              <ChatThread
                messages={BEFORE_MESSAGES}
                className="chat play"
                showTyping={false}
              />
            </div>
            <div className="ba-stats">
              <div className="ba-stat">
                <span className="v mono">4h 22min</span>
                <span className="k">time Priya spent on Monday reports</span>
              </div>
              <div className="ba-stat">
                <span className="v mono">3 spreadsheets</span>
                <span className="k">used to compile the number</span>
              </div>
              <div className="ba-stat">
                <span className="v mono">±18% accuracy</span>
                <span className="k">variance between tool counts</span>
              </div>
            </div>
          </div>

          <div className="ba-divider" aria-hidden />

          <div className="ba-panel after">
            <p className="ba-label em-l">After</p>
            <div className="ba-visual">
              <div className="ba-onenum">
                <p className="dm-label">Revenue · this week</p>
                <p className="num">₹14,20,000</p>
                <p className="sub">
                  <span className="dot" />
                  LIVE · SYNCED 2 MIN AGO
                </p>
              </div>
            </div>
            <div className="ba-stats">
              <div className="ba-stat">
                <span className="v mono">4 min</span>
                <span className="k">time to check the same report</span>
              </div>
              <div className="ba-stat">
                <span className="v mono">1 dashboard</span>
                <span className="k">single source of truth</span>
              </div>
              <div className="ba-stat">
                <span className="v mono">100% live</span>
                <span className="k">real-time, not reconciled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
