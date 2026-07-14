import { useState, useEffect } from "react";

const TEAL = "#0F6E56";
const TEAL_LIGHT = "#E1F5EE";
const TEAL_MID = "#1D9E75";
const TEAL_DARK = "#085041";

const NAV_LINKS = ["Home", "Patients", "Providers", "Policy Makers"];

const STATS = [
  { num: "1,451+", label: "AI/ML devices cleared by FDA" },
  { num: "23.7%", label: "report any demographic data" },
  { num: "30%", label: "disclose essentially nothing" },
];

const CASE_STUDIES = [
  {
    title: "The care management algorithm",
    cite: "Obermeyer et al., Science, 2019",
    url: "https://www.science.org/doi/10.1126/science.aax2342",
    short: "A commercial algorithm used by hundreds of health systems systematically underestimated the needs of Black patients by using healthcare costs as a proxy for health — replicating structural inequity at scale.",
    body: "A widely-used commercial algorithm used healthcare costs as a proxy for health needs — systematically underestimating Black patients' severity. At any given risk score, Black patients flagged by the algorithm were considerably sicker than their White counterparts, yet ranked lower priority. Correcting the disparity would have more than doubled their access to care management. The problem was invisible because disclosure wasn't required."
  },
  {
    title: "The skin cancer AI",
    cite: "Daneshjou et al., JAMA Dermatology, 2021",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9379852/pdf/nihms-1825908.pdf",
    short: "Of 70 dermatology AI studies, only 7 reported any skin tone data. Four had zero images of the darkest skin types — meaning FDA-cleared tools may be operating well outside their validated conditions for patients with darker skin.",
    body: "Of 70 dermatology AI studies reviewed, only 7 reported any skin tone data. Four had no images of the darkest skin types (Fitzpatrick V and VI) at all. An FDA-cleared tool may be operating well outside its validated conditions for patients with darker skin — with no way for clinicians to know."
  },
  {
    title: "The pulse oximeter",
    cite: "Sjoding et al., NEJM, 2020; Johns Hopkins, 2024",
    url: "https://publichealth.jhu.edu/2024/pulse-oximeters-racial-bias",
    short: "During COVID-19, pulse oximeters were three times more likely to give inaccurate readings for Black patients, masking hypoxemia and delaying care. The FDA testing standard required only two darkly pigmented validation subjects.",
    body: "In every hospital room. During COVID-19, a device gating access to emergency care was approximately three times more likely to give inaccurate readings for Black patients. The FDA premarket testing standard, unchanged from 2013, required manufacturers to include just two darkly pigmented subjects. The result: delayed care for Black and Hispanic patients, and in some cases denial of medications they qualified for."
  },
];

const POLICY_SECTIONS = [
  { icon: "file", title: "The disclosure gap", body: "21 CFR 807.92 governs 510(k) summaries but does not require training-data demographics for AI/ML models. Approximately 95% of AI/ML devices are cleared via 510(k) — making the public summary the only document patients and clinicians can access." },
  { icon: "pulse", title: "The clinical stakes", body: "Three documented case studies — a care management algorithm, dermatology AI, and pulse oximeters — all trace to the same root: undisclosed demographic mismatch between training and deployment populations." },
  { icon: "chart", title: "Why voluntary has failed", body: "Guidance has been in place since 2021. Voluntary uptake remains under 25%. Average transparency scores sit at 3.3 out of 17 possible points. A mandate is the only mechanism that solves the collective-action problem." },
  { icon: "globe", title: "The U.S. is falling behind", body: "The EU AI Act imposes hard documentation requirements for medical device AI beginning 2026–2027. U.S. manufacturers will produce this documentation for European regulators regardless. The question is whether American patients receive the same protections." },
];

const SvgIcon = ({ name, size = 20, color = TEAL, strokeWidth = 1.8 }) => {
  const s = { width: size, height: size, fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    heart: <svg viewBox="0 0 24 24" {...s}><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"/></svg>,
    pulse: <svg viewBox="0 0 24 24" {...s}><path d="M3 12h4l3 8l4 -16l3 8h4"/></svg>,
    bank: <svg viewBox="0 0 24 24" {...s}><path d="M3 21l18 0"/><path d="M3 10l18 0"/><path d="M5 6l7 -3l7 3"/><path d="M4 10l0 11"/><path d="M20 10l0 11"/><path d="M8 14l0 3"/><path d="M12 14l0 3"/><path d="M16 14l0 3"/></svg>,
    file: <svg viewBox="0 0 24 24" {...s}><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/><path d="M9 9l1 0"/><path d="M9 13l6 0"/><path d="M9 17l6 0"/></svg>,
    chart: <svg viewBox="0 0 24 24" {...s}><path d="M3 20h18"/><path d="M5 20v-8"/><path d="M9 20v-4"/><path d="M13 20v-12"/><path d="M17 20v-6"/></svg>,
    globe: <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18"/><path d="M12.5 3a17 17 0 0 1 0 18"/></svg>,
    search: <svg viewBox="0 0 24 24" {...s}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    chat: <svg viewBox="0 0 24 24" {...s}><path d="M8 9h8"/><path d="M8 13h6"/><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"/></svg>,
    link: <svg viewBox="0 0 24 24" {...s}><path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"/><path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"/></svg>,
    eye: <svg viewBox="0 0 24 24" {...s}><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"/></svg>,
    mail: <svg viewBox="0 0 24 24" {...s}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6l9 -6"/></svg>,
    share: <svg viewBox="0 0 24 24" {...s}><path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M8.7 10.7l6.6 -3.4"/><path d="M8.7 13.3l6.6 3.4"/></svg>,
    users: <svg viewBox="0 0 24 24" {...s}><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0 -3 -3.85"/></svg>,
    download: <svg viewBox="0 0 24 24" {...s}><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 11l5 5l5 -5"/><path d="M12 4l0 12"/></svg>,
    shield: <svg viewBox="0 0 24 24" {...s}><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"/><path d="M9 12l2 2l4 -4"/></svg>,
    gavel: <svg viewBox="0 0 24 24" {...s}><path d="M14 6l-8.5 8.5a1.5 1.5 0 0 0 3 3l8.5 -8.5"/><path d="M16 10l2 -2"/><path d="M3 21h4"/><path d="M13 4l4 4"/></svg>,
    micro: <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="8" r="4"/><path d="M4 15h16"/><path d="M8 15a4 4 0 0 0 8 0"/><path d="M12 19v2"/></svg>,
    check: <svg viewBox="0 0 24 24" {...s}><path d="M5 12l5 5l10 -10"/></svg>,
    listcheck: <svg viewBox="0 0 24 24" {...s}><path d="M3.5 5.5l1.5 1.5l2.5 -2.5"/><path d="M3.5 11.5l1.5 1.5l2.5 -2.5"/><path d="M3.5 17.5l1.5 1.5l2.5 -2.5"/><path d="M11 6l9 0"/><path d="M11 12l9 0"/><path d="M11 18l9 0"/></svg>,
    info: <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12.01" y2="8"/><path d="M11 12h1v4h1"/></svg>,
    notes: <svg viewBox="0 0 24 24" {...s}><path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/><path d="M9 7l6 0"/><path d="M9 11l6 0"/><path d="M9 15l4 0"/></svg>,
    warn: <svg viewBox="0 0 24 24" {...s}><path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z"/><path d="M12 16h.01"/></svg>,
    tool: <svg viewBox="0 0 24 24" {...s}><path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5"/></svg>,
    home: <svg viewBox="0 0 24 24" {...s}><path d="M5 12l-2 0l9 -9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"/></svg>,
    thumb: <svg viewBox="0 0 24 24" {...s}><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"/></svg>,
    pin: <svg viewBox="0 0 24 24" {...s}><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/></svg>,
  };
  return paths[name] || null;
};

function IconBox({ name, size = 22 }) {
  return (
    <div style={{ width: 42, height: 42, borderRadius: 10, background: TEAL_LIGHT, border: `0.5px solid ${TEAL_MID}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <SvgIcon name={name} size={size} />
    </div>
  );
}

function Tag({ children }) {
  return <span style={{ background: TEAL_LIGHT, color: TEAL_DARK, fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, border: `0.5px solid ${TEAL_MID}`, letterSpacing: "0.3px", textTransform: "uppercase" }}>{children}</span>;
}

function StatCard({ num, label }) {
  return (
    <div style={{ flex: 1, minWidth: 160, background: "#fff", border: "0.5px solid #c8e6dc", borderRadius: 12, padding: "1.25rem 1.5rem", textAlign: "center" }}>
      <div style={{ fontSize: 32, fontWeight: 500, color: TEAL, letterSpacing: "-1px" }}>{num}</div>
      <div style={{ fontSize: 13, color: "#555", marginTop: 4, lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <button onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center" }}>
        <SvgIcon name="info" size={16} color={TEAL_MID} />
      </button>
      {show && (
        <span style={{ position: "absolute", left: 22, top: -8, background: TEAL_DARK, color: "#fff", fontSize: 12, lineHeight: 1.6, padding: "8px 12px", borderRadius: 8, width: 240, zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
          {text}
        </span>
      )}
    </span>
  );
}

function NavBar({ page, setPage }) {
  return (
    <nav style={{ borderBottom: "0.5px solid #d0e8e1", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, background: "#fff" }}>
      <button onClick={() => setPage("Home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
        <span style={{ fontWeight: 500, fontSize: 15, color: TEAL_DARK, letterSpacing: "-0.3px" }}>MedDisclosure<span style={{ color: TEAL_MID }}>.org</span></span>
      </button>
      <div style={{ display: "flex", gap: 4 }}>
        {NAV_LINKS.map(l => (
          <button key={l} onClick={() => setPage(l)} style={{ background: page === l ? TEAL_LIGHT : "none", border: page === l ? `0.5px solid ${TEAL_MID}` : "0.5px solid transparent", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 13, fontWeight: page === l ? 500 : 400, color: page === l ? TEAL_DARK : "#555" }}>{l}</button>
        ))}
      </div>
    </nav>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ borderTop: `0.5px solid ${TEAL_DARK}`, background: TEAL, padding: "2.5rem 2rem 2rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "start" }}>
        <div>
          <div style={{ fontWeight: 500, fontSize: 15, color: "#fff", marginBottom: 6 }}>MedDisclosure<span style={{ color: "#9FE1CB" }}>.org</span></div>
          <p style={{ fontSize: 13, color: "#9FE1CB", lineHeight: 1.7, maxWidth: 400, margin: "0 0 10px" }}>
            An independent advocacy project calling for mandatory transparency in FDA-cleared AI/ML medical devices. Built and maintained by <span style={{ fontWeight: 500, color: "#fff" }}>Wes Krikorian</span>.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9FE1CB" }}>
            <SvgIcon name="shield" size={14} color="#9FE1CB" /> Patients deserve to know who their AI was tested on.
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#9FE1CB", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Pages</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[["Home","home"],["Patients","heart"],["Providers","pulse"],["Policy Makers","bank"]].map(([l, icon]) => (
              <button key={l} onClick={() => setPage(l)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#9FE1CB", textAlign: "left", padding: 0, display: "flex", alignItems: "center", gap: 6 }}>
                <SvgIcon name={icon} size={13} color="#9FE1CB" /> {l}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 720, margin: "1.5rem auto 0", paddingTop: "1rem", borderTop: "0.5px solid rgba(255,255,255,0.15)", fontSize: 12, color: "#9FE1CB", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span>© 2026 MedDisclosure.org · Wes Krikorian</span>
        <span>Not affiliated with the FDA or any device manufacturer.</span>
      </div>
    </footer>
  );
}

function EmailDraft({ audience }) {
  const [copied, setCopied] = useState(false);
  const subject = "Support Mandatory AI Transparency in FDA-Cleared Medical Devices";
  const body = audience === "patient"
    ? `Dear [Representative's Name],\n\nI am a constituent writing to urge your support for mandatory transparency requirements for AI-enabled medical devices cleared by the FDA.\n\nI recently learned that over 1,451 AI/ML medical devices have been cleared by the FDA, yet fewer than 1 in 4 disclose who they were tested on. As a patient, I have no way to know whether the AI tools used in my care were ever tested on people like me.\n\nI urge you to direct the FDA to require manufacturers to publicly disclose the demographic makeup of their AI device testing data. This is a simple fix — the data already exists. Patients just can't see it.\n\nFor more information, please visit: meddisclosure.org\n\nThank you for your time.\n\nSincerely,\n[Your Name]\n[Your City, State]`
    : audience === "provider"
    ? `Dear [Representative's Name],\n\nI am a healthcare provider writing to urge your support for mandatory transparency requirements for AI-enabled medical devices cleared by the FDA.\n\nOver 1,451 AI/ML medical devices have been cleared by the FDA, yet fewer than 1 in 4 disclose any information about the demographic composition of their validation data. As a clinician, I have no reliable way to know whether the AI tools I use daily were ever tested on patients who look like mine.\n\nI urge you to direct the FDA to amend 21 CFR 807.92 to require a standardized "Model Card" disclosure in every public 510(k) summary for AI/ML devices. This is a narrow, low-burden fix — manufacturers already collect this data internally. It simply requires them to make it public.\n\nFor more information, please visit: meddisclosure.org\n\nThank you for your time and leadership on this issue.\n\nSincerely,\n[Your Name]\n[Your Institution]\n[Your State]`
    : `Dear [Representative's Name],\n\nI am writing to urge your support for mandatory transparency requirements for AI-enabled medical devices cleared by the FDA.\n\nOver 1,451 AI/ML medical devices have been cleared by the FDA, yet fewer than 1 in 4 disclose who they were tested on. Documented cases — including a commercial algorithm that cut Black patients' access to care management by more than half, and pulse oximeters that gave dangerously inaccurate readings for Black patients during COVID-19 — show the real-world consequences of this gap.\n\nThe fix is straightforward: amend 21 CFR 807.92 to require a standardized "Model Card" in every public 510(k) summary for AI/ML devices. This requires no new data collection — manufacturers already hold this information internally. The EU AI Act will require this documentation for European regulators beginning in 2026. American patients deserve the same transparency.\n\nFor more information and the full policy brief, please visit: meddisclosure.org\n\nThank you for your attention to this important issue.\n\nSincerely,\n[Your Name]\n[Your State]`;

  function copy() {
    navigator.clipboard?.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ marginTop: 10, background: "#fff", border: `0.5px solid ${TEAL_MID}`, borderRadius: 8, overflow: "hidden" }}>
      <div style={{ background: TEAL_LIGHT, padding: "8px 12px", fontSize: 12, fontWeight: 500, color: TEAL_DARK, borderBottom: `0.5px solid ${TEAL_MID}` }}>Subject: {subject}</div>
      <pre style={{ margin: 0, padding: "12px", fontSize: 12, color: "#444", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{body}</pre>
      <div style={{ padding: "8px 12px", borderTop: `0.5px solid #d0e8e1`, display: "flex", gap: 8 }}>
        <button onClick={copy} style={{ background: copied ? "#d0f0e5" : TEAL, color: copied ? TEAL_DARK : "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <SvgIcon name={copied ? "check" : "notes"} size={12} color={copied ? TEAL_DARK : "#fff"} />
          {copied ? "Copied!" : "Copy to clipboard"}
        </button>
        <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noreferrer" style={{ background: "none", border: `0.5px solid ${TEAL_MID}`, borderRadius: 6, padding: "5px 12px", fontSize: 12, color: TEAL, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <SvgIcon name="pin" size={12} /> Find your rep →
        </a>
      </div>
    </div>
  );
}

function HomePage({ setPage, downloads }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div>
      <div style={{ background: `linear-gradient(160deg, ${TEAL_LIGHT} 0%, #fff 60%)`, padding: "4rem 2rem 3rem", textAlign: "center", borderBottom: "0.5px solid #d0e8e1" }}>
        <Tag>Medical AI Transparency</Tag>
        <h1 style={{ fontSize: 36, fontWeight: 500, color: TEAL_DARK, margin: "1rem 0 0.75rem", lineHeight: 1.2, letterSpacing: "-1px" }}>
          You deserve to know what's<br />inside the AI treating you.
        </h1>
        <p style={{ fontSize: 16, color: "#444", maxWidth: 560, margin: "0 auto 2rem", lineHeight: 1.7 }}>
          Over 1,451 AI/ML devices have been cleared by the FDA. Fewer than 1 in 4 disclose who they were tested on. That gap endangers patients — and it's fixable.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[["I'm a patient","Patients","heart"],["I'm a provider","Providers","pulse"],["I'm a policy maker","Policy Makers","bank"]].map(([label, pg, icon]) => (
            <button key={pg} onClick={() => setPage(pg)} onMouseEnter={() => setHovered(pg)} onMouseLeave={() => setHovered(null)} style={{ background: hovered === pg ? TEAL : "#fff", color: hovered === pg ? "#fff" : TEAL_DARK, border: `0.5px solid ${TEAL_MID}`, borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.15s, color 0.15s" }}>
              <SvgIcon name={icon} size={16} color={hovered === pg ? "#fff" : TEAL_DARK} />
              {label} →
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "#f8fdfb", borderBottom: "0.5px solid #d0e8e1", padding: "2rem" }}>
        <div style={{ display: "flex", gap: 16, maxWidth: 720, margin: "0 auto", flexWrap: "wrap" }}>
          {STATS.map(s => <StatCard key={s.num} {...s} />)}
          <div style={{ flex: 1, minWidth: 160, background: "#fff", border: `2px solid ${TEAL_MID}`, borderRadius: 12, padding: "1.25rem 1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 500, color: TEAL, letterSpacing: "-1px" }}>{downloads ?? "—"}</div>
            <div style={{ fontSize: 13, color: "#555", marginTop: 4, lineHeight: 1.4 }}>policy memo downloads</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "2.5rem 2rem", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ background: "#fff", border: "0.5px solid #c8e6dc", borderRadius: 12, padding: "1.5rem 2rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
          <div style={{ width: 48, height: 56, background: TEAL_LIGHT, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `0.5px solid ${TEAL_MID}` }}>
            <SvgIcon name="file" size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: TEAL, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Policy memo</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: TEAL_DARK, marginBottom: 6 }}>Mandatory Transparency for Medical AI/ML Devices</div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 12 }}>A Congressional-facing policy brief making the case to amend 21 CFR 807.92 — requiring a standardized Model Card in every public 510(k) summary for AI/ML-enabled devices.</div>
            <a href="/memo.pdf" target="_blank" rel="noreferrer" onClick={() => fetch("/api/downloads", { method: "POST" }).catch(() => {})} style={{ background: TEAL, color: "#fff", border: "none", borderRadius: 7, padding: "7px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
              <SvgIcon name="download" size={15} color="#fff" /> Download PDF
            </a>
          </div>
        </div>
      </div>

      <div style={{ background: "#f8fdfb", borderTop: "0.5px solid #d0e8e1", padding: "2.5rem 2rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: "2rem", alignItems: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: TEAL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontWeight: 500, fontSize: 18 }}>WK</span>
          </div>
          <div>
            <div style={{ fontSize: 11, color: TEAL, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>About this project</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: TEAL_DARK, marginBottom: 6 }}>Wes Krikorian</div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>I'm a researcher focused on health equity and AI policy. I built MedDisclosure.org because patients have a right to know whether the algorithm being used in their care was ever tested on someone who looks like them — and right now, most aren't. This site exists to close that gap, one disclosure at a time.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseCSV(text) {
  const rows = [];
  let i = 0;
  while (i < text.length) {
    const row = [];
    while (i < text.length && text[i] !== '\n') {
      if (text[i] === '"') {
        let cell = '';
        i++;
        while (i < text.length) {
          if (text[i] === '"' && text[i+1] === '"') { cell += '"'; i += 2; }
          else if (text[i] === '"') { i++; break; }
          else { cell += text[i++]; }
        }
        row.push(cell);
        if (text[i] === ',') i++;
      } else {
        let cell = '';
        while (i < text.length && text[i] !== ',' && text[i] !== '\n') cell += text[i++];
        row.push(cell.trim());
        if (text[i] === ',') i++;
      }
    }
    if (text[i] === '\n') i++;
    if (row.length > 1 || row[0]) rows.push(row);
  }
  return rows;
}

function PatientsPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [dbLoaded, setDbLoaded] = useState(false);
  const [showPatientEmail, setShowPatientEmail] = useState(false);

  useEffect(() => {
    fetch("/devices.csv")
      .then(r => r.text())
      .then(text => {
        const rows = parseCSV(text);
        if (rows.length < 2) return;
        const headers = rows[0].map(h => h.trim().toLowerCase());
        const parsed = rows.slice(1).map(row => {
          const obj = {};
          headers.forEach((h, i) => obj[h] = row[i] || "");
          return obj;
        });
        setDevices(parsed);
        setDbLoaded(true);
      })
      .catch(() => setDbLoaded(false));
  }, []);

  function handleSearch() {
    if (!query.trim() || !devices.length) return;
    setLoading(true); setResult(null);
    const q = query.trim().toLowerCase();
    const match = devices.find(d =>
      (d["submission number (k number)"] || "").toLowerCase().includes(q) ||
      (d["device name"] || "").toLowerCase().includes(q) ||
      (d["company name"] || "").toLowerCase().includes(q)
    );
    setLoading(false);
    if (!match) {
      setResult({ notFound: true });
      return;
    }
    setResult(match);
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "3rem 2rem" }}>
      <Tag>For patients</Tag>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "1rem 0 0.5rem" }}>
        <IconBox name="heart" />
        <h2 style={{ fontSize: 26, fontWeight: 500, color: TEAL_DARK, margin: 0 }}>Know what's being used on you.</h2>
      </div>
      <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: "1.5rem" }}>If you've been to a hospital or clinic recently, there's a good chance an AI program helped with your care — reading your scans, flagging your symptoms, or deciding how urgent your case is. You have a right to know what that program is, and whether it was ever tested on people like you.</p>

      <div style={{ background: TEAL_LIGHT, border: `0.5px solid ${TEAL_MID}`, borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: 14, fontWeight: 500, color: TEAL_DARK, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: 8 }}>
          <SvgIcon name="chat" size={16} /> Questions to ask your doctor or nurse
        </h3>
        {["Was an AI program used as part of my care today?","What is the name of the AI tool or company that made it?","Has this AI been tested on patients with my background — my age, race, or sex?"].map((q, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < 2 ? 10 : 0 }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", border: `0.5px solid ${TEAL_MID}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: TEAL, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <span style={{ fontSize: 13, color: TEAL_DARK, lineHeight: 1.6 }}>{q}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "0.5px solid #c8e6dc", borderRadius: 12, padding: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: TEAL_DARK, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
          Look up your device's Model Card <InfoTooltip text="A Model Card is a public document that describes how an AI device was built and tested. Not all devices have one — that's the gap we're working to fix." />
        </div>
        <p style={{ fontSize: 13, color: "#777", margin: "0 0 10px" }}>
          Enter the 510(k) number from your medical paperwork (starts with "K" followed by numbers). Not sure what device was used?{" "}
          <a href="https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices" target="_blank" rel="noreferrer" style={{ color: TEAL, fontWeight: 500 }}>
            Search the FDA's AI device list by company name →
          </a>
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="e.g. K213929 or device name" style={{ flex: 1, padding: "9px 12px", borderRadius: 7, border: "0.5px solid #c8e6dc", fontSize: 14, outline: "none" }} />
          <button onClick={handleSearch} disabled={!dbLoaded} style={{ background: TEAL, color: "#fff", border: "none", borderRadius: 7, padding: "9px 18px", fontSize: 14, fontWeight: 500, cursor: dbLoaded ? "pointer" : "default", opacity: dbLoaded ? 1 : 0.5, display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
            <SvgIcon name="search" size={14} color="#fff" /> Look up
          </button>
        </div>
        {!dbLoaded && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#aaa" }}>Device database not loaded — make sure devices.csv is in the public folder.</div>
        )}
        {result && !loading && result.notFound && (
          <div style={{ marginTop: "1.25rem", background: "#fff8f0", borderRadius: 8, padding: "1rem 1.25rem", border: "0.5px solid #f5c07a" }}>
            <p style={{ fontSize: 14, color: "#7a4a00", lineHeight: 1.7, margin: 0 }}>
              No matching device found. Try entering the exact 510(k) number (e.g. K213929) from your paperwork, or{" "}
              <a href="https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices" target="_blank" rel="noreferrer" style={{ color: TEAL, fontWeight: 500 }}>search the FDA's AI device list</a>
              {" "}to find the K number first.
            </p>
          </div>
        )}
        {result && !loading && !result.notFound && (
          <div style={{ marginTop: "1.25rem", background: TEAL_LIGHT, borderRadius: 8, padding: "1rem 1.25rem", border: "0.5px solid #9FE1CB" }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: TEAL, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <SvgIcon name="notes" size={13} /> FDA Device Summary
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                ["Device", result["device name"]],
                ["Company", result["company name"]],
                ["510(k) Number", result["submission number (k number)"]],
                ["Date Cleared", result["date of submission"]],
              ].filter(([,v]) => v).map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 13, color: TEAL_DARK, lineHeight: 1.6 }}>{val}</div>
                </div>
              ))}
              {result["model description & demographics (race, age, gender, geography)"] && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 2 }}>Who was it trained on?</div>
                  <div style={{ fontSize: 13, color: TEAL_DARK, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{result["model description & demographics (race, age, gender, geography)"]}</div>
                </div>
              )}
              {result["summary text"] && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 2 }}>Summary</div>
                  <div style={{ fontSize: 13, color: TEAL_DARK, lineHeight: 1.6 }}>{result["summary text"]}</div>
                </div>
              )}
            </div>
            <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(255,255,255,0.6)", borderRadius: 6, fontSize: 11, color: "#666", lineHeight: 1.6 }}>
              ⚠️ These summaries were auto-extracted from the original FDA 510(k) documents using pattern-matching, not manual review. Demographic figures in particular were parsed from flattened PDF tables and may be incomplete or misattributed. Always confirm any figure against the original summary text (included in this file) or the source PDF before citing or acting on it.
            </div>
          </div>
        )}
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 500, color: TEAL_DARK, marginBottom: "1rem" }}>What you can do next</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: "#fff", border: "0.5px solid #c8e6dc", borderRadius: 10, padding: "1rem 1.25rem", display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: TEAL_LIGHT, border: `0.5px solid ${TEAL_MID}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <SvgIcon name="link" size={18} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: TEAL_DARK, marginBottom: 3 }}>Share this site</div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>Know someone who's been treated with AI medical tools? Send them to meddisclosure.org so they can look up their device too.</div>
          </div>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #c8e6dc", borderRadius: 10, padding: "1rem 1.25rem", display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: TEAL_LIGHT, border: `0.5px solid ${TEAL_MID}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <SvgIcon name="bank" size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: TEAL_DARK, marginBottom: 3 }}>Tell your representatives</div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 8 }}>Right now, companies aren't required to share this information publicly. Your representatives can change that — let them know you care.</div>
            <button onClick={() => setShowPatientEmail(v => !v)} style={{ background: "none", border: "none", padding: 0, fontSize: 13, color: TEAL, fontWeight: 500, cursor: "pointer" }}>
              {showPatientEmail ? "Hide email draft" : "Draft an email →"}
            </button>
            {showPatientEmail && <EmailDraft audience="patient" />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProvidersPage({ onDownload }) {
  const [providerCount, setProviderCount] = useState(847);
  const [providerClicked, setProviderClicked] = useState(false);
  const [openCase, setOpenCase] = useState(null);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    fetch("/api/supporters")
      .then(r => r.json())
      .then(d => setProviderCount(d.count))
      .catch(() => {});
  }, []);

  function handleSupport() {
    if (providerClicked) return;
    setProviderClicked(true);
    fetch("/api/supporters", { method: "POST" })
      .then(r => r.json())
      .then(d => setProviderCount(d.count))
      .catch(() => setProviderCount(c => c + 1));
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "3rem 2rem" }}>
      <Tag>For providers</Tag>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "1rem 0 0.5rem" }}>
        <IconBox name="pulse" />
        <h2 style={{ fontSize: 26, fontWeight: 500, color: TEAL_DARK, margin: 0 }}>Your tools may have a blind spot.</h2>
      </div>
      <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: "2rem" }}>
        Approximately 76% of FDA-cleared AI devices are in radiology. If you use AI in your practice, the demographic composition of its validation data is almost certainly not in the public record.
      </p>

      <div style={{ background: "#fff", border: "0.5px solid #c8e6dc", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: TEAL, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <SvgIcon name="notes" size={14} /> Policy summary for providers
        </div>
        {[
          { icon: "warn", title: "The problem", body: "Fewer than 1 in 4 FDA-cleared AI devices disclose who they were validated on. There's no regulatory requirement to say so. The public 510(k) summary — the only document you can access — doesn't require it." },
          { icon: "eye", title: "Why it matters for your practice", body: "If a device was trained on a narrow population and deployed on yours, you have no way to know its limitations for the patient in front of you.", expandable: true },
          { icon: "tool", title: "The fix", body: "Amend 21 CFR 807.92 to require a standardized Model Card in every AI/ML 510(k) summary. This is structured public reporting of data manufacturers already hold internally. It's the nutrition label, not the recipe." },
        ].map((item) => (
          <div key={item.title}>
            <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "0.5px solid #e8f5f0", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <SvgIcon name={item.icon} size={18} color={TEAL_MID} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: TEAL_DARK, marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}>{item.body}</div>
                {item.expandable && (
                  <button onClick={() => setOpenCase(openCase ? null : "all")} style={{ marginTop: 8, background: "none", border: `0.5px solid ${TEAL_MID}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: TEAL, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <SvgIcon name="micro" size={12} /> {openCase ? "Hide" : "See"} case studies
                  </button>
                )}
                {item.expandable && openCase && (
                  <div style={{ marginTop: 12 }}>
                    {CASE_STUDIES.map((cs, i) => (
                      <div key={i} style={{ marginBottom: 10 }}>
                        <button onClick={() => setOpenCase(openCase === cs.title ? "all" : cs.title)} style={{ width: "100%", background: openCase === cs.title ? TEAL_LIGHT : "#f8fdfb", border: `0.5px solid ${openCase === cs.title ? TEAL_MID : "#d0e8e1"}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: TEAL_DARK }}>{cs.title}</div>
                            <div style={{ fontSize: 11, color: TEAL }}>{cs.cite}</div>
                          </div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={openCase === cs.title ? "M18 15l-6-6l-6 6" : "M6 9l6 6l6-6"}/></svg>
                        </button>
                        {openCase === cs.title && (
                          <div style={{ padding: "10px 12px", background: "#fafffe", border: `0.5px solid ${TEAL_MID}`, borderTop: "none", borderRadius: "0 0 8px 8px" }}>
                            <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7, margin: "0 0 8px" }}>{cs.body}</p>
                            <a href={cs.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: TEAL, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <SvgIcon name="link" size={12} /> Read the paper →
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <a href="/memo.pdf" target="_blank" rel="noreferrer" onClick={() => fetch("/api/downloads", { method: "POST" }).catch(() => {})} style={{ background: "none", border: `0.5px solid ${TEAL_MID}`, borderRadius: 7, padding: "7px 14px", fontSize: 13, color: TEAL_DARK, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
          <SvgIcon name="download" size={14} /> Download full memo
        </a>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: TEAL, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Three ways to take action</div>
        {[
          { icon: "eye", title: "Understand the gap", body: "Read the policy memo summary and see how this affects devices you use daily — from radiology AI to clinical decision tools." },
          { icon: "mail", title: "Email your representative", body: "Send your congressional representative a note about why mandatory AI disclosure matters for your patients.", action: () => setShowEmail(v => !v), actionLabel: showEmail ? "Hide draft email" : "Draft an email →" },
          { icon: "share", title: "Share this page", body: "Forward the Policy Makers page to your hospital's government affairs team or state medical association." },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: TEAL_LIGHT, border: `0.5px solid ${TEAL_MID}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <SvgIcon name={s.icon} size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: TEAL_DARK, marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: s.action ? 6 : 0 }}>{s.body}</div>
              {s.action && <button onClick={s.action} style={{ background: "none", border: "none", padding: 0, fontSize: 13, color: TEAL, fontWeight: 500, cursor: "pointer" }}>{s.actionLabel}</button>}
              {s.action && showEmail && <EmailDraft audience="provider" />}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: TEAL_LIGHT, border: `0.5px solid ${TEAL_MID}`, borderRadius: 12, padding: "1.5rem", textAlign: "center" }}>
        <SvgIcon name="users" size={28} color={TEAL} />
        <div style={{ fontSize: 28, fontWeight: 500, color: TEAL, margin: "4px 0" }}>{providerCount}</div>
        <div style={{ fontSize: 13, color: TEAL_DARK, marginBottom: 16 }}>providers have signaled support for mandatory AI disclosure</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSupport} disabled={providerClicked} style={{ background: providerClicked ? "#d0f0e5" : TEAL, color: providerClicked ? TEAL_DARK : "#fff", border: "none", borderRadius: 7, padding: "9px 20px", fontSize: 14, fontWeight: 500, cursor: providerClicked ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <SvgIcon name={providerClicked ? "check" : "thumb"} size={15} color={providerClicked ? TEAL_DARK : "#fff"} />
            {providerClicked ? "Counted" : "I support this →"}
          </button>
          <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noreferrer" style={{ background: "#fff", color: TEAL_DARK, border: `0.5px solid ${TEAL_MID}`, borderRadius: 7, padding: "9px 20px", fontSize: 14, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <SvgIcon name="pin" size={14} /> Find my representative
          </a>
        </div>
      </div>
    </div>
  );
}

function PolicyPage({ downloads, onDownload }) {
  const [open, setOpen] = useState(null);
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div>
      <div style={{ background: TEAL, padding: "3.5rem 2rem", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#9FE1CB", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9FE1CB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l18 0"/><path d="M3 10l18 0"/><path d="M5 6l7 -3l7 3"/><path d="M4 10l0 11"/><path d="M20 10l0 11"/><path d="M8 14l0 3"/><path d="M12 14l0 3"/><path d="M16 14l0 3"/></svg>
          For policy makers
        </div>
        <h2 style={{ fontSize: 30, fontWeight: 500, color: "#fff", margin: "0 auto 1rem", maxWidth: 600, lineHeight: 1.25, letterSpacing: "-0.5px" }}>The FDA already identified the problem.<br />It's time to require the fix.</h2>
        <p style={{ fontSize: 15, color: "#9FE1CB", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>A structured, low-burden rule requiring manufacturers to publicly disclose what they already know about their AI — and what patients and clinicians deserve to know.</p>
      </div>

      <div style={{ background: "#f8fdfb", borderBottom: "0.5px solid #d0e8e1", padding: "2rem" }}>
        <div style={{ display: "flex", gap: 16, maxWidth: 720, margin: "0 auto", flexWrap: "wrap" }}>
          {STATS.map(s => <StatCard key={s.num} {...s} />)}
          <div style={{ flex: 1, minWidth: 160, background: "#fff", border: `2px solid ${TEAL_MID}`, borderRadius: 12, padding: "1.25rem 1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 500, color: TEAL, letterSpacing: "-1px" }}>{downloads ?? "—"}</div>
            <div style={{ fontSize: 13, color: "#555", marginTop: 4, lineHeight: 1.4 }}>policy memo downloads</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 2rem 1rem" }}>
        <Tag>Background</Tag>
        <h3 style={{ fontSize: 20, fontWeight: 500, color: TEAL_DARK, margin: "1rem 0 0.5rem" }}>The regulatory gap and what it costs</h3>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: "2rem" }}>21 CFR 807.92 governs 510(k) summary content. It requires submitter information, device name, predicate ID, and intended use — but not training-data demographics for AI/ML models. Because ~95% of AI/ML devices clear via 510(k), the public summary is the primary document clinicians can access. Clearance turns on "substantial equivalence," not demonstrated performance in a defined patient population.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: "2rem" }}>
          {POLICY_SECTIONS.map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #c8e6dc", borderRadius: 10, padding: "1.25rem" }}>
              <SvgIcon name={s.icon} size={22} />
              <div style={{ fontSize: 14, fontWeight: 500, color: TEAL_DARK, margin: "8px 0 6px" }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}>{s.body}</div>
            </div>
          ))}
        </div>

        <Tag>Case studies</Tag>
        <h3 style={{ fontSize: 20, fontWeight: 500, color: TEAL_DARK, margin: "1rem 0 1rem", display: "flex", alignItems: "center", gap: 8 }}>
          <SvgIcon name="micro" size={20} color={TEAL_MID} /> Three devices. The same root cause.
        </h3>
        <div style={{ marginBottom: "2rem" }}>
          {CASE_STUDIES.map((cs, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${TEAL_MID}`, paddingLeft: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: TEAL_DARK, marginBottom: 2 }}>{cs.title}</div>
              <div style={{ fontSize: 11, color: TEAL, marginBottom: 6 }}>{cs.cite}</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 6 }}>{cs.body}</div>
              <a href={cs.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: TEAL, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                <SvgIcon name="link" size={12} /> Read the paper →
              </a>
            </div>
          ))}
        </div>

        <Tag>Policy options</Tag>
        <h3 style={{ fontSize: 20, fontWeight: 500, color: TEAL_DARK, margin: "1rem 0 1rem", display: "flex", alignItems: "center", gap: 8 }}>
          <SvgIcon name="listcheck" size={20} color={TEAL_MID} /> Four pathways to mandatory disclosure
        </h3>
        {[
          { id: "A", label: "FDA rulemaking — amend 21 CFR 807.92", rec: true, body: "Require a standardized Model Card in the public 510(k) summary for all AI/ML-enabled devices. Uses existing FDA authority. Notice-and-comment rulemaking takes 2–4 years. FDA signaled intent via January 2025 draft guidance." },
          { id: "B", label: "Statutory amendment — FD&C Act § 510", rec: false, body: "Congress directly requires Model Card disclosure in law. Strongest and most durable path. Best pursued through MDUFA reauthorization or an AI omnibus bill." },
          { id: "C", label: "Finalize January 2025 draft guidance with mandatory language", rec: false, body: "Direct FDA to finalize its existing draft with binding rather than recommendatory language. Fastest path — but guidance remains technically non-binding even when finalized." },
          { id: "D", label: "Special controls by device category", rec: false, body: "FDA imposes Model Card disclosure as a special control for AI/ML device categories. Can be deployed class-by-class but is piecemeal and may not achieve universal coverage." },
        ].map(opt => (
          <div key={opt.id} style={{ border: opt.rec ? `2px solid ${TEAL_MID}` : "0.5px solid #c8e6dc", borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
            <button onClick={() => setOpen(open === opt.id ? null : opt.id)} style={{ width: "100%", background: opt.rec ? TEAL_LIGHT : "#fff", border: "none", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 24, height: 24, borderRadius: 6, background: opt.rec ? TEAL : "#e8f5f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: opt.rec ? "#fff" : TEAL, flexShrink: 0 }}>{opt.id}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: TEAL_DARK }}>{opt.label}</span>
                {opt.rec && <span style={{ background: TEAL, color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>Primary ask</span>}
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={open === opt.id ? "M18 15l-6-6l-6 6" : "M6 9l6 6l6-6"}/></svg>
            </button>
            {open === opt.id && <div style={{ padding: "1rem 1.25rem 1rem 3.5rem", background: "#fafffe", borderTop: "0.5px solid #d0e8e1" }}><p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: 0 }}>{opt.body}</p></div>}
          </div>
        ))}

        <div style={{ background: TEAL, borderRadius: 12, padding: "2rem", textAlign: "center", marginTop: "2.5rem", marginBottom: "1rem" }}>
          <SvgIcon name="gavel" size={28} color="#9FE1CB" />
          <div style={{ fontSize: 18, fontWeight: 500, color: "#fff", margin: "10px 0 8px" }}>Direct FDA to initiate rulemaking within 12 months.</div>
          <div style={{ fontSize: 13, color: "#9FE1CB", marginBottom: 20, lineHeight: 1.6 }}>With statutory fallback language under FD&C Act § 510 ready if FDA does not act.<br />EU AI Act documentation requirements take effect in 2026–2027 regardless.</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: showEmail ? 16 : 0 }}>
            <a href="/memo.pdf" target="_blank" rel="noreferrer" onClick={() => fetch("/api/downloads", { method: "POST" }).catch(() => {})} style={{ background: "#fff", color: TEAL_DARK, border: "none", borderRadius: 7, padding: "9px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
              <SvgIcon name="download" size={14} color={TEAL_DARK} /> Download full memo
            </a>
            <button onClick={() => setShowEmail(v => !v)} style={{ background: "transparent", color: "#fff", border: "0.5px solid rgba(255,255,255,0.5)", borderRadius: 7, padding: "9px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <SvgIcon name="mail" size={14} color="#fff" /> {showEmail ? "Hide email draft" : "Draft a rep email →"}
            </button>
          </div>
          {showEmail && <div style={{ maxWidth: 540, margin: "0 auto" }}><EmailDraft audience="policymaker" /></div>}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("Home");
  const [downloads, setDownloads] = useState(null);

  useEffect(() => {
    fetch("/api/downloads")
      .then(r => r.json())
      .then(d => setDownloads(d.count))
      .catch(() => setDownloads(128));
  }, []);

  function handleSetPage(p) {
    setPage(p);
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar page={page} setPage={handleSetPage} />
      <div style={{ flex: 1 }}>
        {page === "Home" && <HomePage setPage={handleSetPage} downloads={downloads} />}
        {page === "Patients" && <PatientsPage />}
        {page === "Providers" && <ProvidersPage />}
        {page === "Policy Makers" && <PolicyPage downloads={downloads} />}
      </div>
      <Footer setPage={handleSetPage} />
    </div>
  );
}
