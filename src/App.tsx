import { useMemo, useState } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// Question schema: { id, topic, level, q, options[], answer (idx), explain }
// Topics: bd-api-surface, dedicated-nodes, institutional-staking, mpc-wallets, compliance-security, web3-fundamentals
// Length parity 0.90-1.10 STRICT across options.

const BANK = [
  // ── BEGINNER (12) ──
  { id:"b1", topic:"bd-api-surface", level:"beginner",
    q:"Which API does Blockdaemon offer for broadcasting and signing transactions?",
    options:[
      "Wallet Transact, for broadcasting and signing transactions programmatically",
      "Chain Watch, which monitors wallet addresses for on-chain activity changes",
      "Staking API, which manages validator delegation and rewards on PoS chains",
      "RPC API, which routes raw JSON-RPC calls to Blockdaemon's full node fleet",
    ],
    answer:0,
    explain:"Wallet Transact is Blockdaemon's API for constructing, signing, and broadcasting transactions programmatically without running your own wallet infrastructure." },
  { id:"b2", topic:"bd-api-surface", level:"beginner",
    q:"What does the Blockdaemon Chain Watch API primarily help developers do?",
    options:[
      "Monitor addresses and receive push alerts when on-chain activity occurs",
      "Construct and broadcast signed transactions across all supported chains",
      "Query historical token price and balance data for portfolio dashboards",
      "Stake tokens and manage validator rewards across PoS networks directly",
    ],
    answer:0,
    explain:"Chain Watch lets developers subscribe to address activity and receive webhook or WebSocket notifications when balances or transactions change on supported chains." },
  { id:"b3", topic:"dedicated-nodes", level:"beginner",
    q:"How many blockchain networks does Blockdaemon advertise support for?",
    options:[
      "50+ chains across its dedicated node infrastructure globally today",
      "Only Ethereum and Bitcoin on shared multi-tenant node cluster plans",
      "Exactly 10 chains, limited to the top EVM-compatible networks only",
      "Over 200 chains, including every testnet and devnet in existence now",
    ],
    answer:0,
    explain:"Blockdaemon advertises support for 50+ chains across its dedicated node network, spanning major Layer 1s, Layer 2s, and PoS networks across 40+ locations worldwide." },
  { id:"b4", topic:"dedicated-nodes", level:"beginner",
    q:"What distinguishes Blockdaemon's dedicated nodes from shared RPC endpoints?",
    options:[
      "Resources are not shared with other tenants, giving predictable results",
      "Dedicated nodes mine new blocks on a proof-of-work network directly",
      "They are hosted in one data center location for maximum cost savings",
      "Dedicated nodes only support archival data and reject all live queries",
    ],
    answer:0,
    explain:"Dedicated nodes give each customer exclusive hardware or VMs, removing noisy-neighbor effects and providing consistent throughput, latency, and SLA guarantees." },
  { id:"b5", topic:"institutional-staking", level:"beginner",
    q:"What type of staking does Blockdaemon primarily support for institutions?",
    options:[
      "Proof-of-stake validator operations across multiple PoS networks now",
      "Proof-of-work mining pools for Bitcoin and Ethereum Classic chains",
      "Liquidity mining on automated market makers for DeFi yield farming",
      "NFT staking for gaming protocols with tokenized in-game reward pools",
    ],
    answer:0,
    explain:"Blockdaemon focuses on institutional proof-of-stake staking, running validators across PoS networks and managing slashing risk, rewards, and delegation on behalf of clients." },
  { id:"b6", topic:"institutional-staking", level:"beginner",
    q:"Roughly how much value does Blockdaemon report having staked on its platform?",
    options:[
      "More than $10B in staked assets managed on behalf of all clients",
      "Under $100M, reflecting early-stage staking product adoption still",
      "Exactly $1B, per a fixed cap imposed by their compliance program",
      "Zero, since Blockdaemon only provides infrastructure and not staking",
    ],
    answer:0,
    explain:"Blockdaemon reports $10B+ in staked assets, reflecting its position as a major institutional staking provider across Ethereum, Solana, Polkadot, and other PoS networks." },
  { id:"b7", topic:"mpc-wallets", level:"beginner",
    q:"What does MPC stand for in the context of Blockdaemon wallet services?",
    options:[
      "Multi-Party Computation, a cryptographic key management technique here",
      "Multi-Protocol Chain, a routing layer for cross-chain transaction flows",
      "Managed Private Custody, a regulated custodial account service offering",
      "Multi-Purpose Contract, a smart contract standard for secure token vaults",
    ],
    answer:0,
    explain:"MPC (Multi-Party Computation) splits private key material across multiple parties so no single entity holds the full key, reducing single-point-of-failure and insider threat risk." },
  { id:"b8", topic:"mpc-wallets", level:"beginner",
    q:"How does a non-custodial MPC wallet differ from a custodial wallet service?",
    options:[
      "The client retains key shares so no counterparty holds assets outright",
      "The provider holds all assets and signs on behalf of clients directly",
      "Non-custodial wallets cannot be used with institutional trading desks",
      "Custodial wallets use MPC while non-custodial ones use seed phrases",
    ],
    answer:0,
    explain:"In a non-custodial MPC setup, key shares are distributed so the service provider cannot unilaterally access funds. Clients retain cryptographic control over their assets." },
  { id:"b9", topic:"compliance-security", level:"beginner",
    q:"Which security certification does Blockdaemon hold for its infrastructure?",
    options:[
      "ISO 27001 and SOC 2 Type II for information security management needs",
      "PCI DSS Level 1, which is required for payment card data handling only",
      "FedRAMP High, which is mandatory for US federal government cloud use",
      "FIPS 140-2, which is used exclusively for hardware security modules only",
    ],
    answer:0,
    explain:"Blockdaemon holds ISO 27001 and SOC 2 Type II certifications, demonstrating independent audits of its information security and operational controls for enterprise clients." },
  { id:"b10", topic:"compliance-security", level:"beginner",
    q:"What uptime SLA does Blockdaemon publish for its node infrastructure?",
    options:[
      "99.9% uptime SLA across its global node network and API services",
      "95% uptime with no SLA offered below the Enterprise plan tier level",
      "100% guaranteed uptime backed by a full refund commitment always",
      "75% uptime in off-peak periods and 99% during business hours only",
    ],
    answer:0,
    explain:"Blockdaemon advertises 99.9% uptime across its infrastructure, underpinned by its multi-cloud, multi-region node architecture spanning 40+ locations on 6 continents." },
  { id:"b11", topic:"web3-fundamentals", level:"beginner",
    q:"What is an RPC node, from an institutional infrastructure perspective?",
    options:[
      "A server that accepts JSON-RPC calls and relays them to the chain",
      "A hardware device that mines new blocks on a proof-of-work network",
      "A smart contract that routes cross-chain bridge transactions securely",
      "A custody account that holds assets on behalf of regulated clients",
    ],
    answer:0,
    explain:"An RPC node accepts Remote Procedure Call requests from applications and returns on-chain state or broadcasts transactions. Institutions depend on reliable RPC nodes for trading." },
  { id:"b12", topic:"web3-fundamentals", level:"beginner",
    q:"What is a validator in the context of a proof-of-stake blockchain?",
    options:[
      "A node that proposes and attests to blocks in exchange for rewards",
      "A compliance officer who reviews transactions for AML requirements",
      "A smart contract that enforces transfer restrictions on tokenized assets",
      "A hardware wallet that signs transactions on behalf of retail users",
    ],
    answer:0,
    explain:"A PoS validator stakes tokens as collateral, proposes new blocks, and attests to the chain's canonical state. Institutional operators like Blockdaemon run validators for clients." },

  // ── INTERMEDIATE (12) ──
  { id:"i1", topic:"bd-api-surface", level:"intermediate",
    q:"Which Blockdaemon API surfaces are grouped under its Indexed Data offering?",
    options:[
      "NFT API and historical balance and token price data query endpoints",
      "RPC API and Wallet Transact combined into a single REST API gateway",
      "Chain Watch and Staking API merged into one consolidated data feed",
      "Raw JSON-RPC and archival trace calls served from a unified endpoint",
    ],
    answer:0,
    explain:"Blockdaemon's Indexed Data umbrella covers the NFT API and historical data products including balance history and token price lookups, all pre-indexed for fast REST queries." },
  { id:"i2", topic:"bd-api-surface", level:"intermediate",
    q:"What CU weight does Blockdaemon's Staking API carry compared to plain RPC API?",
    options:[
      "Staking API costs 8 CU per request versus 1 CU for RPC API calls",
      "Both Staking API and RPC API cost the same 1 CU per request always",
      "Staking API is free of CU charges and billed separately per validator",
      "RPC API costs 8 CU and Staking API costs 1 CU due to result caching",
    ],
    answer:0,
    explain:"In Blockdaemon's modeled CU weights, the Staking API is rated at 8 CU per request due to its more complex backend operations versus the 1 CU baseline of a raw RPC API call." },
  { id:"i3", topic:"dedicated-nodes", level:"intermediate",
    q:"What does multi-cloud and multi-geo node deployment provide for institutional clients?",
    options:[
      "Redundancy and low latency by distributing nodes across providers and regions",
      "Lower cost by consolidating all infrastructure into one cloud provider only",
      "Regulatory isolation by keeping each jurisdiction on a separate chain fork",
      "Faster block finality by co-locating nodes with mining pool operators here",
    ],
    answer:0,
    explain:"Multi-cloud and multi-geo deployment removes single-cloud dependency, improves region-local latency for global users, and ensures continued uptime if one provider or region fails." },
  { id:"i4", topic:"dedicated-nodes", level:"intermediate",
    q:"What tier of data centers does Blockdaemon use for its node infrastructure?",
    options:[
      "Tier 3 data centers with N+1 redundancy and 99.982% uptime availability",
      "Tier 1 data centers that offer basic connectivity with minimal redundancy",
      "Consumer-grade co-location facilities to reduce infrastructure overhead costs",
      "Tier 5 hyperscale facilities requiring custom hardware design agreements only",
    ],
    answer:0,
    explain:"Blockdaemon uses Tier 3 data centers, which feature N+1 redundancy for power and cooling and are rated at 99.982% availability, a standard for enterprise-grade infrastructure." },
  { id:"i5", topic:"institutional-staking", level:"intermediate",
    q:"How does Blockdaemon address slashing risk for institutional staking clients?",
    options:[
      "It provides slashing-risk coverage including 100% slashing coverage claims",
      "It shifts all slashing risk entirely to the client with no coverage offered",
      "It uses proof-of-work mining to eliminate PoS slashing risk for clients",
      "Slashing risk is handled by Fireblocks custody and not by Blockdaemon at all",
    ],
    answer:0,
    explain:"Blockdaemon offers slashing-risk coverage and has marketed 100% slashing coverage, providing institutional clients protection against validator misbehavior penalties on PoS networks." },
  { id:"i6", topic:"institutional-staking", level:"intermediate",
    q:"Which of these firms competes most directly with Blockdaemon in institutional staking?",
    options:[
      "Figment, Kiln, P2P, and Chorus One offer similar institutional staking",
      "Coinbase Custody focuses on exchange custody and not on staking ops",
      "Chainlink provides oracle data feeds and not validator management here",
      "Polygon runs its own staking platform for its native chain layer only",
    ],
    answer:0,
    explain:"Figment, Kiln, P2P.org, and Chorus One all operate institutional-grade validator infrastructure and compete with Blockdaemon's staking services across major PoS networks." },
  { id:"i7", topic:"mpc-wallets", level:"intermediate",
    q:"What is the architectural role of a vault in an MPC wallet infrastructure?",
    options:[
      "A logical container grouping wallets and key shares under one policy",
      "A hardware device storing private keys in a tamper-proof enclave only",
      "A smart contract that time-locks withdrawals for a minimum security hold",
      "A cold storage unit kept offline and accessed via air-gap protocols only",
    ],
    answer:0,
    explain:"In MPC wallet architectures, a vault is a logical grouping of wallets governed by a shared policy, allowing institutions to apply consistent approval workflows and access controls." },
  { id:"i8", topic:"mpc-wallets", level:"intermediate",
    q:"Which firms are closest competitors to Blockdaemon in MPC wallet infrastructure?",
    options:[
      "Fireblocks, Copper, Hex Trust, and Anchorage offer MPC wallet platforms",
      "MetaMask, Phantom, and Rainbow are retail self-custody wallet products",
      "Uniswap, Aave, and Compound focus on DeFi protocol liquidity only here",
      "Binance Custody and OKX Ventures focus on centralized exchange vaults",
    ],
    answer:0,
    explain:"Fireblocks, Copper, Hex Trust, and Anchorage Digital are the primary institutional MPC wallet competitors, each offering key management, policy engines, and multi-chain asset support." },
  { id:"i9", topic:"compliance-security", level:"intermediate",
    q:"What does SOC 2 Type II certification tell a client about a cloud provider?",
    options:[
      "Controls for security, availability, and confidentiality were audited over time",
      "The provider meets payment card industry data security standard requirements",
      "The provider achieved zero-downtime for a full calendar year of operations",
      "A government auditor certified the system for classified data processing use",
    ],
    answer:0,
    explain:"SOC 2 Type II involves an independent auditor reviewing security, availability, and confidentiality controls over a period of time, offering stronger assurance than a point-in-time audit." },
  { id:"i10", topic:"compliance-security", level:"intermediate",
    q:"How many institutional customers does Blockdaemon report serving on its platform?",
    options:[
      "400+ institutional customers relying on its node infrastructure globally",
      "Under 50 customers, reflecting its focus on a handful of large banks",
      "Over 10,000 customers, the majority of whom are retail developers only",
      "Exactly 100 enterprise clients locked in by multi-year exclusive contracts",
    ],
    answer:0,
    explain:"Blockdaemon reports 400+ institutional customers, spanning exchanges, custodians, asset managers, and financial institutions across its node, staking, and wallet product lines." },
  { id:"i11", topic:"web3-fundamentals", level:"intermediate",
    q:"What is the EVM, and why does it matter for institutional blockchain deployments?",
    options:[
      "Ethereum Virtual Machine, the execution layer that runs smart contracts",
      "External Validator Module, used by Cosmos chains for IBC relaying only",
      "Enhanced Vault Manager, a custody standard for institutional asset storage",
      "Encrypted Verification Method, a ZK proof scheme for private on-chain data",
    ],
    answer:0,
    explain:"The EVM is the execution environment that runs Solidity smart contracts on Ethereum and compatible chains. Institutions building on EVM chains rely on RPC providers like Blockdaemon." },
  { id:"i12", topic:"web3-fundamentals", level:"intermediate",
    q:"What is consensus in a blockchain, from an operator perspective?",
    options:[
      "The protocol by which nodes agree on the canonical state of the chain",
      "A legal agreement between validators and stakers in a custodial pool",
      "A marketing term for the process of on-chain governance voting only",
      "A smart contract that tracks validator uptime for reward distribution",
    ],
    answer:0,
    explain:"Consensus is the mechanism by which distributed nodes agree on which blocks are valid and in what order. Operators like Blockdaemon run consensus-participating nodes for clients." },

  // ── EXPERT (12) ──
  { id:"e1", topic:"bd-api-surface", level:"expert",
    q:"Why does Indexed Data carry the highest CU weight among Blockdaemon API surfaces?",
    options:[
      "It requires pre-indexed storage reads and aggregation across many blocks",
      "It is billed at a flat per-call rate regardless of data volume returned",
      "It only processes real-time data so no historical indexing overhead exists",
      "CU weights for Indexed Data are identical to raw RPC API call weights now",
    ],
    answer:0,
    explain:"Indexed Data (NFT API, historical balances, token prices) requires maintaining and querying pre-indexed datasets, incurring more storage and compute per call than a direct RPC relay." },
  { id:"e2", topic:"bd-api-surface", level:"expert",
    q:"How does Blockdaemon's Chain Watch API differ from polling the RPC API for events?",
    options:[
      "Chain Watch delivers push notifications so clients avoid polling overhead",
      "Chain Watch is identical to eth_getLogs but with a higher per-call CU cost",
      "RPC polling is faster than Chain Watch for high-frequency event monitoring",
      "Chain Watch only works for Solana and not on EVM-compatible chains at all",
    ],
    answer:0,
    explain:"Chain Watch uses a push model (webhooks or WebSocket), eliminating the polling loop overhead that eth_getLogs polling introduces, reducing both latency and CU consumption." },
  { id:"e3", topic:"dedicated-nodes", level:"expert",
    q:"What operational advantage do 40+ geographic locations provide for Blockdaemon clients?",
    options:[
      "Region-local node proximity reduces round-trip latency for critical ops",
      "All locations are in the same region, simplifying compliance reporting",
      "Geographic spread increases finality time due to longer propagation paths",
      "Clients must pick one location per contract and cannot use others at all",
    ],
    answer:0,
    explain:"With 40+ locations across 6 continents, Blockdaemon routes requests to the nearest node, minimizing RTT for latency-sensitive workloads like trading systems and transaction monitors." },
  { id:"e4", topic:"dedicated-nodes", level:"expert",
    q:"How does 100B+ requests processed demonstrate Blockdaemon's infrastructure scale?",
    options:[
      "It validates proven throughput capacity at institutional production traffic",
      "It shows Blockdaemon is the only provider capable of handling RPC traffic",
      "It means each individual client generates billions of requests per month",
      "The figure covers test network traffic only and excludes mainnet load here",
    ],
    answer:0,
    explain:"Processing 100B+ requests demonstrates that Blockdaemon's infrastructure has been stress-tested at scale in production, providing confidence in reliability for enterprise and financial clients." },
  { id:"e5", topic:"institutional-staking", level:"expert",
    q:"What makes 100% slashing coverage a meaningful differentiator in institutional staking?",
    options:[
      "It removes downside risk from validator faults, enabling larger stake allocations",
      "It guarantees staking yield regardless of network conditions or reward changes",
      "It means the client receives refunds for all on-chain gas fees paid always",
      "Slashing coverage is identical across Figment, Kiln, P2P, and Blockdaemon now",
    ],
    answer:0,
    explain:"Full slashing coverage removes the tail risk of losing staked principal to double-sign or downtime penalties, allowing risk-averse institutions to allocate larger amounts to staking programs." },
  { id:"e6", topic:"institutional-staking", level:"expert",
    q:"How does Blockdaemon's Staking API integrate into a custodian's existing workflow?",
    options:[
      "Via REST calls that initiate staking actions without custodians running validators",
      "By requiring custodians to operate their own full nodes as a prerequisite first",
      "Through a proprietary SDK that replaces all existing custody system integrations",
      "Only via manual CSV file uploads processed by Blockdaemon's operations team",
    ],
    answer:0,
    explain:"The Staking API exposes REST endpoints for staking, unstaking, and reward queries, allowing custodians and exchanges to integrate validator operations without managing node infrastructure." },
  { id:"e7", topic:"mpc-wallets", level:"expert",
    q:"What cryptographic property makes MPC superior to a traditional multisig wallet?",
    options:[
      "Key material is never fully assembled in one place, eliminating single-point risk",
      "MPC wallets always require more signers than multisig for equivalent security",
      "Traditional multisig uses MPC internally, making them cryptographically identical",
      "MPC only works on Ethereum and cannot support Bitcoin or Solana assets now",
    ],
    answer:0,
    explain:"In MPC, each party holds a key share and computes signatures jointly without any party seeing the full key. Multisig assembles signatures on-chain, leaking policy and approval structure." },
  { id:"e8", topic:"mpc-wallets", level:"expert",
    q:"What operational challenge does a vault policy engine solve in MPC deployments?",
    options:[
      "It enforces approval workflows and spending limits without manual oversight",
      "It reduces the number of key shares needed to sign a transaction to one",
      "It replaces blockchain consensus with off-chain agreement for settlement",
      "A vault policy engine is only relevant for retail and not institution use",
    ],
    answer:0,
    explain:"A vault policy engine applies rules like quorum approvals, velocity limits, and whitelisted destinations automatically, reducing friction while maintaining governance at institutional scale." },
  { id:"e9", topic:"compliance-security", level:"expert",
    q:"How does ISO 27001 certification differ from SOC 2 Type II in scope and audience?",
    options:[
      "ISO 27001 is an international ISMS standard; SOC 2 Type II targets US service orgs",
      "SOC 2 Type II is global while ISO 27001 applies only to European organizations",
      "ISO 27001 covers payment data only while SOC 2 covers all cloud infrastructure",
      "Both certifications have identical scope, auditor requirements, and control sets",
    ],
    answer:0,
    explain:"ISO 27001 is an internationally recognized information security management system standard, while SOC 2 Type II is an AICPA framework primarily used by US-based cloud and SaaS providers." },
  { id:"e10", topic:"compliance-security", level:"expert",
    q:"What does $110B+ in assets secured imply about Blockdaemon's security posture?",
    options:[
      "It signals rigorous security controls vetted by large financial institution clients",
      "It means Blockdaemon insures all assets up to $110B under its own balance sheet",
      "The figure only counts assets held in Blockdaemon-branded custody products here",
      "Assets secured refers to stablecoins only and excludes native chain token values",
    ],
    answer:0,
    explain:"Having $110B+ in assets secured demonstrates that major financial institutions and funds have trusted Blockdaemon's infrastructure for production-critical, high-value operations and custody." },
  { id:"e11", topic:"web3-fundamentals", level:"expert",
    q:"Why does Solana's architecture create unique RPC infrastructure challenges for operators?",
    options:[
      "Its short slot time and high TPS demand low-latency high-throughput RPC nodes",
      "Solana uses a unique VM that no existing RPC provider can support at all today",
      "Solana finalizes blocks in minutes, making real-time RPC queries impossible now",
      "All Solana RPC traffic must route through the Solana Foundation's official nodes",
    ],
    answer:0,
    explain:"Solana's 400ms slots and 50,000+ TPS throughput demand RPC infrastructure with very low latency and high bandwidth. Operators like Blockdaemon must provision more capable nodes than for EVM chains." },
  { id:"e12", topic:"web3-fundamentals", level:"expert",
    q:"What is the operational significance of running archival nodes for institutional clients?",
    options:[
      "They retain full historical state needed for audit trails and on-chain forensics",
      "Archive nodes are only needed for testnets and have no mainnet use case today",
      "They consume less storage than pruned nodes due to compression algorithms used",
      "Archive nodes replace consensus nodes so only one node type is needed per chain",
    ],
    answer:0,
    explain:"Archival nodes store the complete chain history, enabling institutions to query historical balances, reconstruct past states for audits, and run forensic analytics on past transactions at any block." },
];

const TOPIC_LABEL: Record<string, string> = {
  "bd-api-surface": "BD API Surface",
  "dedicated-nodes": "Dedicated Nodes",
  "institutional-staking": "Institutional Staking",
  "mpc-wallets": "MPC Wallets",
  "compliance-security": "Compliance and Security",
  "web3-fundamentals": "Web3 Fundamentals",
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
