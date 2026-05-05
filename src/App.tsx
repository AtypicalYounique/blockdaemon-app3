import { useMemo, useState } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// Question schema: { id, topic, level, q, options[], answer (idx), explain }
// Topics: company-fun-facts, company-products, industry
// Length parity 0.90-1.10 STRICT across options.

const BANK = [
  // ── BEGINNER (12) ──
  { id:"b1", topic:"company-fun-facts", level:"beginner",
    q:"Who is the founder and CEO of Blockdaemon?",
    options:[
      "Konstantin Richter, who founded Blockdaemon back in October 2017",
      "Mike Belshe, the engineer behind the BitGo institutional custody firm",
      "Michael Shaulov, who founded the Fireblocks digital asset platform",
      "Diogo Monica, who co-founded the Anchorage Digital crypto custody",
    ],
    answer:0,
    explain:"Per Blockdaemon's About page and Konstantin Richter's LinkedIn profile, Richter founded Blockdaemon in October 2017 and remains its CEO." },
  { id:"b2", topic:"company-fun-facts", level:"beginner",
    q:"In what year was Blockdaemon originally founded?",
    options:[
      "2017, when Blockdaemon Inc. was first established as a company",
      "2013, alongside the earliest wave of crypto exchange businesses",
      "2015, the same year Ethereum's main network first went live",
      "2020, during the institutional crypto boom of the pandemic",
    ],
    answer:0,
    explain:"Blockdaemon's About page lists October 2017 as the date Blockdaemon Inc. was established, originally in San Francisco." },
  { id:"b3", topic:"company-fun-facts", level:"beginner",
    q:"Where was Blockdaemon Inc. originally established in 2017?",
    options:[
      "San Francisco, where Blockdaemon Inc. was first set up in 2017",
      "London, which the company opened as a satellite office in 2023",
      "New York City, which became a Blockdaemon office only in 2024",
      "Singapore, which Blockdaemon opened as an office in late 2023",
    ],
    answer:0,
    explain:"Blockdaemon's About-page timeline shows Blockdaemon Inc. was established in San Francisco in October 2017; London, Singapore, and NYC came later." },
  { id:"b4", topic:"company-fun-facts", level:"beginner",
    q:"What does the 'daemon' part of the name Blockdaemon refer to?",
    options:[
      "A long-running background process, in the Unix tradition of daemons",
      "A mythological guardian spirit watching over a chain's mempool data",
      "A consensus role in early proof-of-work Bitcoin client architecture",
      "A specific Ethereum smart contract pattern for scheduling cron jobs",
    ],
    answer:0,
    explain:"In Unix-style computing, a daemon is a background process that runs continuously. The brand reflects always-on node infrastructure for blockchains." },
  { id:"b5", topic:"company-fun-facts", level:"beginner",
    q:"Which Wall Street bank invested in Blockdaemon's seed and Series A rounds?",
    options:[
      "Goldman Sachs, whose digital assets team backed the early rounds",
      "Morgan Stanley, via its dedicated digital assets investing platform",
      "Wells Fargo, through its corporate venture investing arm directly",
      "Deutsche Bank, via its DWS digital assets investing subsidiary",
    ],
    answer:0,
    explain:"Per the Blockdaemon Series B blog and Finextra's Series A coverage, Goldman Sachs backed Blockdaemon's seed round and joined the $28M Series A in 2021." },
  { id:"b6", topic:"company-products", level:"beginner",
    q:"Which Blockdaemon API is built for signing and broadcasting transactions?",
    options:[
      "Wallet Transact, for constructing and broadcasting signed transactions",
      "Chain Watch, which watches addresses and pushes notifications on activity",
      "Indexed Data, which exposes pre-indexed historical balance and price data",
      "Staking API, which manages validator delegations and reward claim flows",
    ],
    answer:0,
    explain:"Wallet Transact is Blockdaemon's transaction-construction and broadcast API, letting institutions submit signed transactions without running their own wallet stack." },
  { id:"b7", topic:"company-products", level:"beginner",
    q:"What does Blockdaemon's Chain Watch product primarily do for developers?",
    options:[
      "Notifies subscribers when monitored addresses see on-chain activity",
      "Constructs and broadcasts signed transactions across supported chains",
      "Returns historical token price and balance data for portfolio dashboards",
      "Stakes tokens and claims validator rewards across many PoS networks",
    ],
    answer:0,
    explain:"Chain Watch lets developers subscribe to address activity and receive webhook or WebSocket notifications when balances or transactions change on supported chains." },
  { id:"b8", topic:"company-products", level:"beginner",
    q:"How many blockchain protocols does Blockdaemon advertise support for today?",
    options:[
      "60+ protocols across its node, staking, and wallet product lines",
      "Only Bitcoin and Ethereum, on a shared multi-tenant node cluster",
      "Just under 10 protocols, focused on top EVM-compatible mainnets",
      "Around 200 protocols, including most public testnets and devnets",
    ],
    answer:0,
    explain:"Blockdaemon's About page advertises 60+ supported protocols spanning major Layer 1s, Layer 2s, and PoS networks for institutional clients." },
  { id:"b9", topic:"company-products", level:"beginner",
    q:"Which type of staking does Blockdaemon's platform primarily support?",
    options:[
      "Proof-of-stake validator operations across major PoS blockchain networks",
      "Proof-of-work mining pools for Bitcoin and Ethereum Classic networks",
      "Liquidity mining on automated market makers for DeFi yield programs",
      "NFT staking for blockchain games with tokenized in-game reward pools",
    ],
    answer:0,
    explain:"Blockdaemon focuses on institutional proof-of-stake staking, running validators on PoS networks and managing slashing risk and rewards for clients." },
  { id:"b10", topic:"company-products", level:"beginner",
    q:"What does MPC stand for in Blockdaemon's wallet products?",
    options:[
      "Multi-Party Computation, a cryptographic technique for key management",
      "Multi-Protocol Chain, a routing layer for cross-chain transaction flows",
      "Managed Private Custody, a regulated custodial account service tier",
      "Multi-Purpose Contract, a smart contract design used in token vaults",
    ],
    answer:0,
    explain:"MPC stands for Multi-Party Computation, a cryptographic method that splits private key shares across parties so no single party holds the full key." },
  { id:"b11", topic:"industry", level:"beginner",
    q:"What is an RPC node, in plain institutional infrastructure terms?",
    options:[
      "A server that accepts JSON-RPC calls and relays them to the chain",
      "A hardware device that mines new blocks on a proof-of-work network",
      "A smart contract that routes cross-chain bridge transactions safely",
      "A custody account that holds digital assets for regulated clients",
    ],
    answer:0,
    explain:"An RPC node accepts Remote Procedure Call requests from applications and returns on-chain state or broadcasts transactions for them." },
  { id:"b12", topic:"industry", level:"beginner",
    q:"What is a validator on a proof-of-stake blockchain network?",
    options:[
      "A node that proposes and attests to new blocks in exchange for staking rewards",
      "A compliance officer who reviews on-chain transactions for AML reporting needs",
      "A smart contract that enforces transfer rules on tokenized financial assets",
      "A hardware wallet that signs single-user transactions for retail customers",
    ],
    answer:0,
    explain:"A PoS validator stakes tokens as collateral, proposes new blocks, and attests to the chain's canonical state. Operators run validators on behalf of clients." },

  // ── INTERMEDIATE (12) ──
  { id:"i1", topic:"company-fun-facts", level:"intermediate",
    q:"How much did Blockdaemon raise in its January 2022 Series C round?",
    options:[
      "$207 million, announced in late January 2022 by the company",
      "$28 million, the size of the company's June 2021 Series A round",
      "$155 million, the size of Blockdaemon's earlier Series B round",
      "$420 million, raised in a hypothetical extension of the round",
    ],
    answer:0,
    explain:"Per BusinessWire's January 26, 2022 announcement, Blockdaemon closed a $207 million Series C funding round." },
  { id:"i2", topic:"company-fun-facts", level:"intermediate",
    q:"What post-money valuation did Blockdaemon's Series C round set in 2022?",
    options:[
      "$3.25 billion post-money valuation, set in late January 2022",
      "$1.255 billion post-money valuation, set during the Series B round",
      "$8 billion post-money valuation, set in a 2023 funding extension",
      "$500 million post-money valuation, an earlier Series A figure",
    ],
    answer:0,
    explain:"Per BusinessWire's announcement, Blockdaemon's Series C closed at a $3.25 billion post-money valuation, with Sapphire and Tiger Global leading the round." },
  { id:"i3", topic:"company-fun-facts", level:"intermediate",
    q:"Which investor led Blockdaemon's $155 million Series B funding round?",
    options:[
      "SoftBank Vision Fund 2, which led the $155M Series B round in 2021",
      "Andreessen Horowitz, which has led many crypto infrastructure rounds",
      "Sequoia Capital, which has invested in many fintech infrastructure firms",
      "Paradigm, the crypto-native fund behind several institutional deals",
    ],
    answer:0,
    explain:"Per Blockdaemon's Series B blog post, SoftBank Vision Fund 2 led the $155 million round at a $1.255 billion valuation." },
  { id:"i4", topic:"company-fun-facts", level:"intermediate",
    q:"What did Blockdaemon get from its 2022 acquisition of Sepior?",
    options:[
      "Multi-Party Computation key-management technology and research talent",
      "A regulated US trust company charter for institutional asset custody",
      "A crypto exchange license for a specific European Union member state",
      "A consumer-facing self-custody mobile wallet brand and user base",
    ],
    answer:0,
    explain:"Blockdaemon's July 2022 announcement says Sepior, a Danish digital asset security firm, brought MPC key-management technology and team into the company." },
  { id:"i5", topic:"company-fun-facts", level:"intermediate",
    q:"What product did Blockdaemon get by acquiring Gem in March 2022?",
    options:[
      "A crypto API and fiat-to-crypto onramp aggregation service offering",
      "A regulated stablecoin issuance license active in several jurisdictions",
      "A proof-of-work Bitcoin mining pool with rented hash-rate contracts",
      "A self-hosted blockchain explorer brand similar to Etherscan tooling",
    ],
    answer:0,
    explain:"PrivSource and Blockdaemon's blog describe Gem as a crypto API firm offering a fiat-to-crypto onramp, Connect API, and KYC Passport, joining Blockdaemon in March 2022." },
  { id:"i6", topic:"company-products", level:"intermediate",
    q:"Which products are grouped under Blockdaemon's Indexed Data offering?",
    options:[
      "NFT API plus historical balance and token price query endpoints",
      "Wallet Transact and the RPC API combined into one billing bucket",
      "Chain Watch and the Staking API merged into a single data feed",
      "Raw JSON-RPC and archival trace calls served from one endpoint",
    ],
    answer:0,
    explain:"Blockdaemon's Indexed Data umbrella covers the NFT API and historical data products including balance history and token price lookups, pre-indexed for REST queries." },
  { id:"i7", topic:"company-products", level:"intermediate",
    q:"What CU weight does Blockdaemon's Staking API carry per request?",
    options:[
      "8 CU per call, versus the 1 CU baseline used by raw RPC API calls",
      "1 CU, the same baseline charged for every plain RPC API request now",
      "Free, since the Staking API is billed separately by validator count",
      "100 CU per call, a flat rate applied to all staking-related actions",
    ],
    answer:0,
    explain:"In Blockdaemon's modeled CU weights, the Staking API is rated at 8 CU per call due to more complex backend operations versus the 1 CU RPC baseline." },
  { id:"i8", topic:"company-products", level:"intermediate",
    q:"What sets Blockdaemon's dedicated nodes apart from its shared RPC offering?",
    options:[
      "Resources are not shared with other tenants, giving consistent performance",
      "Dedicated nodes mine new blocks on a proof-of-work chain for the client",
      "They sit in a single data center location to minimize all hosting costs",
      "Dedicated nodes only return archival data and reject all live RPC queries",
    ],
    answer:0,
    explain:"Dedicated nodes give each customer exclusive hardware or VMs, removing noisy-neighbor effects and providing consistent throughput, latency, and SLAs." },
  { id:"i9", topic:"company-products", level:"intermediate",
    q:"How much in digital assets does Blockdaemon's About page say it secures?",
    options:[
      "$110B+ in digital assets secured for institutional financial clients",
      "Under $1B, reflecting a focus on a small handful of pilot customers",
      "Exactly $50B, the cap stated in its institutional service agreements",
      "Zero, since Blockdaemon never touches client assets in any product",
    ],
    answer:0,
    explain:"Blockdaemon's current About page states it secures $110B+ in digital assets for the world's leading financial institutions." },
  { id:"i10", topic:"company-products", level:"intermediate",
    q:"How many nodes did Citi Ventures cite Blockdaemon as running in 2022?",
    options:[
      "Over 36,000 nodes run on behalf of the company's institutional clients",
      "Around 500 nodes, mostly hosted in two big US data center campuses",
      "Roughly 100 nodes, all dedicated to a single early validator customer",
      "Around 1 million nodes, including ephemeral test nodes spun up on demand",
    ],
    answer:0,
    explain:"Citi Ventures' June 2022 announcement of its Series C investment notes Blockdaemon ran over 36,000 nodes for more than 200 institutional customers at that time." },
  { id:"i11", topic:"industry", level:"intermediate",
    q:"What does SOC 2 Type II certification tell a buyer about a provider?",
    options:[
      "Security and availability controls were independently audited over time",
      "The provider meets payment card industry data security standards in full",
      "The provider achieved zero downtime for a complete calendar year of ops",
      "A government auditor certified the system for processing classified data",
    ],
    answer:0,
    explain:"SOC 2 Type II is an AICPA framework where an independent auditor reviews security and availability controls over a period of time, not just at one point." },
  { id:"i12", topic:"industry", level:"intermediate",
    q:"What is the EVM, and why does it matter for institutional deployments?",
    options:[
      "Ethereum Virtual Machine, the execution layer that runs smart contracts",
      "External Validator Module, used by Cosmos chains for IBC packet relay only",
      "Enhanced Vault Manager, a custody standard for institutional asset storage",
      "Encrypted Verification Method, a ZK proof scheme used for private state",
    ],
    answer:0,
    explain:"The EVM is the execution environment that runs Solidity smart contracts on Ethereum and EVM-compatible chains. Institutions on EVM rely on RPC providers." },

  // ── EXPERT (12) ──
  { id:"e1", topic:"company-fun-facts", level:"expert",
    q:"Which two firms were the named lead investors in Blockdaemon's Series C?",
    options:[
      "Sapphire Ventures and Tiger Global, who jointly led the $207M round",
      "Andreessen Horowitz and Paradigm, the major Web3-native venture firms",
      "Sequoia Capital and Lightspeed, both broad-based technology venture firms",
      "Coinbase Ventures and Binance Labs, the largest exchange-based investors",
    ],
    answer:0,
    explain:"Per BusinessWire, Sapphire and Tiger Global led Blockdaemon's $207 million Series C at a $3.25 billion post-money valuation in January 2022." },
  { id:"e2", topic:"company-fun-facts", level:"expert",
    q:"Which German on-chain analytics firm did Blockdaemon acquire in late 2021?",
    options:[
      "Anyblock Analytics, a German blockchain analytics platform acquired in 2021",
      "Chainalysis, the New York-based blockchain investigations and data firm",
      "Nansen, a Singapore-based on-chain analytics platform for crypto traders",
      "Dune Analytics, the SQL-based on-chain query and dashboarding platform",
    ],
    answer:0,
    explain:"Blockdaemon's November 2021 announcement covers the acquisition of Anyblock Analytics, a German on-chain analytics, monitoring, and node-hosting platform." },
  { id:"e3", topic:"company-fun-facts", level:"expert",
    q:"Which DeFi-focused API company did Blockdaemon acquire and close in 2025?",
    options:[
      "expand.network, a unified DeFi API that closed as the fifth acquisition",
      "1inch Network, a DeFi DEX aggregator that runs across many EVM chains",
      "0x Labs, the team behind the 0x protocol API for token swap routing flows",
      "Li.Fi, a cross-chain bridging and swapping API for DeFi-focused builders",
    ],
    answer:0,
    explain:"Blockdaemon's blog confirms the closed acquisition of expand.network, a unified DeFi API, as Blockdaemon's fifth successful acquisition." },
  { id:"e4", topic:"company-fun-facts", level:"expert",
    q:"Which accelerator did Blockdaemon join when it raised its 2017 seed round?",
    options:[
      "Plug and Play Tech Center's incubator program, joined in November 2017",
      "Y Combinator's winter 2018 batch for early-stage software companies",
      "Techstars' New York City accelerator program for fintech startup teams",
      "500 Startups' main San Francisco accelerator cohort for tech startups",
    ],
    answer:0,
    explain:"Blockdaemon's About page timeline shows the company joined the Plug and Play incubator and raised its seed round in November 2017." },
  { id:"e5", topic:"company-products", level:"expert",
    q:"Why is 100% slashing coverage a meaningful institutional staking feature?",
    options:[
      "It removes downside risk from validator faults, enabling larger allocations",
      "It guarantees staking yield regardless of network reward changes over time",
      "It means clients receive refunds for all on-chain gas fees they pay always",
      "Slashing coverage is identical at Figment, Kiln, and P2P, so it's neutral",
    ],
    answer:0,
    explain:"Full slashing coverage absorbs the tail risk of losing staked principal to double-sign or downtime penalties, letting risk-averse institutions allocate more." },
  { id:"e6", topic:"company-products", level:"expert",
    q:"What problem does a vault policy engine solve in MPC wallet deployments?",
    options:[
      "It enforces approval workflows and spending limits without manual review",
      "It reduces the count of key shares needed to sign a transaction down to one",
      "It replaces blockchain consensus with off-chain agreement on transaction order",
      "Vault policy engines only matter for retail self-custody and not institutions",
    ],
    answer:0,
    explain:"A vault policy engine applies rules like quorum approvals, velocity limits, and whitelisted destinations automatically, keeping governance at institutional scale." },
  { id:"e7", topic:"company-products", level:"expert",
    q:"How does Chain Watch differ from polling Blockdaemon's RPC API for events?",
    options:[
      "Chain Watch pushes notifications, so clients avoid expensive polling loops",
      "Chain Watch is identical to eth_getLogs but with a higher per-call CU cost",
      "RPC polling is faster than Chain Watch for high-frequency event monitoring",
      "Chain Watch only works for Solana and not on any EVM-compatible chains now",
    ],
    answer:0,
    explain:"Chain Watch uses a push model with webhooks or WebSockets, eliminating the polling loop overhead of an eth_getLogs loop and lowering both latency and CU usage." },
  { id:"e8", topic:"company-products", level:"expert",
    q:"What benefit does multi-cloud and multi-geo node deployment provide clients?",
    options:[
      "Redundancy and lower latency by spreading nodes across providers and regions",
      "Lower cost by consolidating all infrastructure into one cloud provider only",
      "Regulatory isolation by keeping each jurisdiction on a separate chain fork",
      "Faster block finality by co-locating nodes with mining pool operators only",
    ],
    answer:0,
    explain:"Multi-cloud and multi-geo deployment removes single-cloud dependency, improves region-local latency for global users, and preserves uptime if one provider fails." },
  { id:"e9", topic:"industry", level:"expert",
    q:"What property makes MPC superior to a traditional on-chain multisig wallet?",
    options:[
      "Key material is never assembled in one place, removing single-point-of-failure",
      "MPC wallets always require more signers than multisig for equivalent security",
      "Traditional multisig uses MPC internally, so the two are cryptographically equal",
      "MPC works only on Ethereum and cannot support Bitcoin or Solana asset signing",
    ],
    answer:0,
    explain:"In MPC, each party holds a key share and computes signatures jointly without any party seeing the full key. Multisig assembles signatures on-chain, leaking policy structure." },
  { id:"e10", topic:"industry", level:"expert",
    q:"Why does Solana create unique RPC infrastructure challenges for operators?",
    options:[
      "Its 400ms slot time and high TPS demand low-latency high-throughput nodes",
      "It uses a unique VM that no existing RPC provider can support at all today",
      "Solana finalizes blocks in minutes, making real-time RPC queries impossible",
      "All Solana RPC traffic must route through the Solana Foundation's own nodes",
    ],
    answer:0,
    explain:"Solana's 400ms slots and high throughput demand RPC nodes with very low latency and high bandwidth, which is more demanding than provisioning EVM RPC nodes." },
  { id:"e11", topic:"industry", level:"expert",
    q:"Why do institutions often need archival nodes, not just pruned full nodes?",
    options:[
      "They retain full historical state needed for audit trails and on-chain forensics",
      "Archival nodes are needed only for testnets and have no real mainnet use case",
      "They consume less storage than pruned nodes due to advanced compression schemes",
      "Archival nodes replace consensus nodes so only one node type is needed per chain",
    ],
    answer:0,
    explain:"Archival nodes store the full chain history so institutions can query historical balances, reconstruct past states for audits, and run forensic analytics on prior activity." },
  { id:"e12", topic:"industry", level:"expert",
    q:"How does ISO 27001 differ in scope from a SOC 2 Type II report?",
    options:[
      "ISO 27001 is a global ISMS standard; SOC 2 Type II targets US service orgs",
      "SOC 2 Type II is global, while ISO 27001 only applies to European companies",
      "ISO 27001 covers payment data only, while SOC 2 Type II covers all cloud ops",
      "Both certifications have identical scopes, auditor rules, and control sets now",
    ],
    answer:0,
    explain:"ISO 27001 is an international information security management system standard, while SOC 2 Type II is an AICPA framework primarily used by US-based service providers." },
];

const TOPIC_LABEL: Record<string, string> = {
  "company-fun-facts": "Blockdaemon Fun Facts",
  "company-products": "Blockdaemon Product Line",
  "industry": "Industry and Technical",
};

function shuffle<T>(a: T[]): T[] { const x = [...a]; for (let i = x.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]]; } return x; }
function sample<T>(a: T[], n: number): T[] { return shuffle(a).slice(0, n); }

function shuffleQuestions(questions: any[]) {
  const positionCounts = [0, 0, 0, 0];
  const recentPositions: number[] = [];
  return questions.map((q) => {
    const correctText = q.options[q.answer];
    const wrongTexts = q.options
      .filter((_: any, i: number) => i !== q.answer)
      .sort(() => Math.random() - 0.5);
    const blocked = recentPositions.slice(-2);
    const candidates = [0, 1, 2, 3]
      .filter((p) => !blocked.includes(p))
      .sort((a, b) => positionCounts[a] - positionCounts[b] || Math.random() - 0.5);
    const targetPos = candidates.length > 0
      ? candidates[0]
      : [0, 1, 2, 3].sort((a, b) => positionCounts[a] - positionCounts[b] || Math.random() - 0.5)[0];
    positionCounts[targetPos]++;
    recentPositions.push(targetPos);
    const newOptions = [...wrongTexts];
    newOptions.splice(targetPos, 0, correctText);
    return { ...q, options: newOptions, answer: targetPos };
  });
}

function pickQuestions(level: string, n: number) {
  if (level === "mixed") {
    const b = BANK.filter(q => q.level === "beginner");
    const im = BANK.filter(q => q.level === "intermediate");
    const e = BANK.filter(q => q.level === "expert");
    const each = Math.ceil(n / 3);
    return shuffleQuestions(shuffle([...sample(b, each), ...sample(im, each), ...sample(e, n - 2*each)]).slice(0, n));
  }
  const pool = BANK.filter(q => q.level === level);
  return shuffleQuestions(sample(pool, Math.min(n, pool.length)));
}

function App() {
  const [length, setLength] = useState<number>(10);
  const [level, setLevel] = useState<string>("beginner");
  const [stage, setStage] = useState<"setup"|"run"|"done">("setup");
  const [qs, setQs] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, number>>({});
  const [toast, setToast] = useState(false);

  const start = () => {
    const lvl = length === 30 ? (level === "expert" ? "expert" : "mixed") : level;
    const set = pickQuestions(lvl, length);
    setQs(set); setIdx(0); setPicks({}); setRevealed({}); setStage("run");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const choose = (qid: string, ci: number) => {
    if (revealed[qid] !== undefined) return;
    setPicks(p => ({ ...p, [qid]: ci }));
    setRevealed(r => ({ ...r, [qid]: ci }));
  };
  const next = () => {
    if (idx + 1 < qs.length) setIdx(idx + 1); else setStage("done");
  };

  const correctCount = useMemo(() => qs.reduce((acc,q)=> acc + (picks[q.id] === q.answer ? 1 : 0), 0), [qs, picks]);

  const topicBreakdown = useMemo(() => {
    const m: Record<string, { correct: number; total: number }> = {};
    for (const q of qs) {
      const t = q.topic;
      if (!m[t]) m[t] = { correct: 0, total: 0 };
      m[t].total++;
      if (picks[q.id] === q.answer) m[t].correct++;
    }
    return m;
  }, [qs, picks]);

  const difficultyBreakdown = useMemo(() => {
    const m: Record<string, { correct: number; total: number }> = {};
    for (const q of qs) {
      const d = q.level;
      if (!m[d]) m[d] = { correct: 0, total: 0 };
      m[d].total++;
      if (picks[q.id] === q.answer) m[d].correct++;
    }
    return m;
  }, [qs, picks]);

  const summary = useMemo(() => {
    const lines: string[] = [];
    lines.push("Blockdaemon and Institutional Web3 Trivia");
    lines.push(`Length: ${qs.length}, Level: ${length === 30 && level !== "expert" ? "mixed" : level}`);
    lines.push(`Score: ${correctCount} / ${qs.length}`);
    lines.push("");
    lines.push("Topic breakdown:");
    Object.entries(topicBreakdown).forEach(([t, v]) => {
      lines.push(`  - ${TOPIC_LABEL[t] || t}: ${v.correct}/${v.total}`);
    });
    lines.push("");
    lines.push("Difficulty breakdown:");
    Object.entries(difficultyBreakdown).forEach(([d, v]) => {
      lines.push(`  - ${d}: ${v.correct}/${v.total}`);
    });
    return lines.join("\n");
  }, [qs.length, correctCount, topicBreakdown, difficultyBreakdown, level, length]);

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(summary); setToast(true); setTimeout(()=>setToast(false), 1600); }
    catch { const ta=document.createElement("textarea"); ta.value=summary; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); setToast(true); setTimeout(()=>setToast(false),1600); }
  };

  const restart = () => { setStage("setup"); setQs([]); setIdx(0); setPicks({}); setRevealed({}); window.scrollTo({top:0, behavior:"smooth"}); };

  const Pills = ({ value, set, options }: { value: any; set: (v: any) => void; options: { value: any; label: string }[] }) => (
    <div className="pillgroup">
      {options.map(o => (
        <button key={String(o.value)} className={"pill " + (value === o.value ? "active" : "")} onClick={() => set(o.value)} type="button">{o.label}</button>
      ))}
    </div>
  );

  if (stage === "setup") {
    return (
      <div className="wrap">
        <header className="brand-bar">
          <a
            href={BRAND.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-logo"
            aria-label={BRAND.company}
          >
            <span dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
          </a>
          <span className="brand-chip">Independent quiz</span>
        </header>
        <div className="eyebrow">A quiz · DevRel, sales enablement, partner education</div>
        <h1>Blockdaemon and Institutional Web3 Trivia</h1>
        <p className="lede">A short, polite test of how well you know Blockdaemon's product surface (RPC API on 50+ chains, Wallet Transact, Chain Watch, Staking API, Indexed Data including NFT API and historical data) and the institutional web3 concepts they sit on. Drawn from Blockdaemon's public docs and marketing materials.</p>

        <div className="card">
          <label>Length</label>
          <Pills value={length} set={setLength} options={[{value:10,label:"10 questions"},{value:20,label:"20 questions"},{value:30,label:"30 questions"}]} />
          <div style={{ height: 14 }} />
          <label>Difficulty</label>
          <Pills value={level} set={setLevel} options={[{value:"beginner",label:"Beginner"},{value:"intermediate",label:"Intermediate"},{value:"expert",label:"Expert"}]} />
          <div style={{ marginTop: 14 }}>
            <button className="btn" onClick={start}>Start quiz</button>
          </div>
        </div>

        <div className="footer-note">
          Blockdaemon-specific detail comes from Blockdaemon's public documentation and marketing materials covering its API surface, dedicated nodes, institutional staking, MPC wallets, and compliance certifications. Broader questions cover RPC fundamentals, validators, EVM, and Solana from an institutional angle. No data is collected.
        </div>
        <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  if (stage === "run") {
    const q = qs[idx];
    const chosen = picks[q.id];
    const reveal = revealed[q.id] !== undefined;
    return (
      <div className="wrap">
        <header className="brand-bar">
          <a
            href={BRAND.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-logo"
            aria-label={BRAND.company}
          >
            <span dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
          </a>
          <span className="brand-chip">Independent quiz</span>
        </header>
        <div className="progress"><div style={{ width: `${((idx)/qs.length)*100}%` }} /></div>
        <div className="eyebrow">Question {idx+1} of {qs.length} · {TOPIC_LABEL[q.topic] || q.topic} · {q.level}</div>
        <div className="card qcard">
          <h2 style={{ fontSize: 18, lineHeight: 1.4, marginBottom: 14 }}>{q.q}</h2>
          {q.options.map((opt: string, i: number) => {
            let cls = "opt";
            if (reveal) {
              if (i === q.answer) cls += " correct";
              else if (i === chosen) cls += " wrong";
            } else if (i === chosen) cls += " picked";
            return <button key={i} className={cls} onClick={() => choose(q.id, i)}>{String.fromCharCode(65+i)}. {opt}</button>;
          })}
          {reveal && <div className="explain"><strong>{chosen === q.answer ? "Correct." : "Not quite."}</strong> {q.explain}</div>}
          {reveal && <div style={{ marginTop: 14 }}><button className="btn" onClick={next}>{idx + 1 < qs.length ? "Next question" : "See results"}</button></div>}
        </div>
        <div style={{ display:"flex", gap: 10 }}>
          <button className="btn secondary" onClick={restart}>Restart</button>
        </div>
        <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  // done
  const pct = Math.round((correctCount / qs.length) * 100);
  const headline =
    pct >= 90 ? "Genuinely sharp on Blockdaemon and institutional web3 infrastructure." :
    pct >= 70 ? "Solid working understanding of Blockdaemon's product surface." :
    pct >= 50 ? "Reasonable grasp. Some good rabbit holes ahead in the BD docs." :
    "Plenty of room to learn. Blockdaemon's docs are a good next stop.";

  const topicsSorted = Object.entries(topicBreakdown).map(([t, v]) => ({ t, ...v, pct: v.correct / v.total }));
  topicsSorted.sort((a,b) => b.pct - a.pct);
  const strong = topicsSorted.slice(0, 2).filter(x => x.pct >= 0.5).map(x => TOPIC_LABEL[x.t] || x.t);
  const weak = topicsSorted.slice(-2).filter(x => x.pct < 0.7).map(x => TOPIC_LABEL[x.t] || x.t);

  return (
    <div className="wrap">
      <header className="brand-bar">
        <a
          href={BRAND.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-logo"
          aria-label={BRAND.company}
        >
          <span dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
        </a>
        <span className="brand-chip">Independent quiz</span>
      </header>
      <div className="eyebrow">Results</div>
      <h1>{correctCount} / {qs.length} correct · {pct}%</h1>
      <p className="lede">{headline}</p>

      <div className="card">
        <h2>Topic breakdown</h2>
        {Object.entries(topicBreakdown).map(([t, v]) => (
          <div className="topic-row" key={t}>
            <span style={{ color: "var(--muted)" }}>{TOPIC_LABEL[t] || t}</span>
            <span style={{ color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>{v.correct}/{v.total}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Difficulty breakdown</h2>
        {Object.entries(difficultyBreakdown).map(([d, v]) => (
          <div className="topic-row" key={d}>
            <span style={{ color: "var(--muted)", textTransform: "capitalize" }}>{d}</span>
            <span style={{ color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>{v.correct}/{v.total}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>What you understand well</h2>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>
          {strong.length ? strong.join(" · ") : "Nothing dominant yet. Try a longer quiz at a higher level."}
        </div>
      </div>

      <div className="card">
        <h2>What's worth learning next</h2>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>
          {weak.length ? weak.join(" · ") : "All topics roughly even. The expert tier will pressure-test the edges."}
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={onCopy}>Copy results</button>
          <button className="btn secondary" onClick={restart}>Take another quiz</button>
        </div>
      </div>

      <div className="footer-note">Blockdaemon-specific detail is sourced from Blockdaemon's public documentation, blog, and marketing materials covering its node infrastructure, staking platform, MPC wallet products, and compliance certifications. Broader web3 questions cover RPC, EVM, Solana, and institutional infrastructure concepts. Independent tool, not affiliated with Blockdaemon.</div>

      <div className={"toast " + (toast ? "show" : "")}>Results copied to clipboard</div>
      <footer className="attribution">{BRAND.attribution}</footer>
    </div>
  );
}

export default App;
