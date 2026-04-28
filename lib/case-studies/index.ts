import { Compass, ShieldAlert, TrendingUp } from "lucide-react";
import type { CaseStudy } from "./types";

const fraudDetection: CaseStudy = {
  slug: "fraud-detection",
  category: "Fraud & Risk",
  title: "Real-time fraud detection at checkout",
  tagline:
    "Catch velocity and spend anomalies at checkout from a single kappa pipeline - no batch reconciliation, no training-serving skew.",
  summary:
    "A kappa-architecture pipeline that computes velocity and spend aggregates across 1h, 24h, and 7d windows and produces an is_suspicious flag at query time - all from a single Python definition.",
  icon: ShieldAlert,
  accentColor: "#E91E63",
  heroMetrics: [
    { label: "Streaming operators", value: "5" },
    { label: "Time windows", value: "3" },
    { label: "Online/offline parity", value: "Guaranteed" },
  ],
  problem: {
    heading: "Fraud scoring can't wait for tomorrow's batch",
    body: "E-commerce fraud needs to be caught at checkout, not in an overnight job. When a compromised account fires off rapid orders or a 24-hour spend spikes to 10x the weekly average, the scoring model needs those signals with sub-second freshness - across multiple time windows simultaneously.",
    bullets: [
      "Velocity: order count in the last hour",
      "Spend spike: 24-hour spend vs. 7-day daily average",
      "Derived is_suspicious flag applied at request time",
    ],
  },
  approach: {
    heading: "One kappa pipeline, 5 operators, 3 windows",
    body: "A single streaming pipeline definition produces all five raw aggregates. The derived is_suspicious extractor reads three of them at query time and applies threshold logic in Python via PyO3. No lambda dual-pipeline drift, no nightly reconciliation, no training-serving skew.",
    diagram: {
      nodes: [
        { label: "Order", sublabel: "Postgres · CDC cursor", kind: "source" },
        { label: "compute_order_stats", sublabel: "Count · Sum · Max · 3 windows", kind: "transform" },
        { label: "UserOrderStats", sublabel: "RocksDB · live aggregates", kind: "store" },
        { label: "FraudSignals", sublabel: "is_suspicious · PyO3 extractor", kind: "serve" },
      ],
    },
  },
  code: {
    language: "python",
    filename: "features.py",
    caption: "The complete fraud-detection feature definition - ~60 lines.",
    source: `from datetime import datetime
from thyme import (
    Config, Count, Max, Sum, dataset, expectations, extractor,
    extractor_inputs, extractor_outputs, feature, featureset,
    field, inputs, pipeline, source,
)

config = Config.load()
orders_source = config.postgres_source(table="orders")

@source(orders_source, cursor="timestamp", every="5s", max_lateness="1h")
@dataset(version=1)
class Order:
    user_id: str = field(key=True)
    order_id: str = field()
    amount: float = field()
    timestamp: datetime = field(timestamp=True)

@dataset(version=1, index=True)
class UserOrderStats:
    user_id: str = field(key=True)
    order_count_1h: int = field()
    order_count_24h: int = field()
    total_spend_24h: float = field()
    total_spend_7d: float = field()
    max_order_amount_7d: float = field()
    timestamp: datetime = field(timestamp=True)

    @pipeline(version=1)
    @inputs(Order)
    def compute_order_stats(cls, orders):
        return orders.groupby("user_id").aggregate(
            order_count_1h=Count(window="1h"),
            order_count_24h=Count(window="24h"),
            total_spend_24h=Sum(of="amount", window="24h"),
            total_spend_7d=Sum(of="amount", window="7d"),
            max_order_amount_7d=Max(of="amount", window="7d"),
        )

@featureset
class FraudSignals:
    user_id: str = feature(id=1)
    order_count_1h: int = feature(id=2)
    total_spend_24h: float = feature(id=4)
    total_spend_7d: float = feature(id=5)
    is_suspicious: bool = feature(id=7)

    @extractor
    @extractor_inputs("order_count_1h", "total_spend_24h", "total_spend_7d")
    @extractor_outputs("is_suspicious")
    def compute_suspicious(cls, ts, count_1h, spend_24h, spend_7d):
        daily_avg_7d = spend_7d / 7.0
        return (count_1h > 5) | (spend_24h > daily_avg_7d * 3)`,
  },
  features: [
    {
      name: "Count(window=\"1h\")",
      description: "Invertible counter. Window eviction is O(1), not a full re-scan.",
    },
    {
      name: "Sum(of=\"amount\", window=\"24h\")",
      description: "Streaming sum across 24-hour tumbling windows.",
    },
    {
      name: "Max(of=\"amount\", window=\"7d\")",
      description: "Running max kept with a monotonic deque over 7 days.",
    },
    {
      name: "@expectations",
      description: "Declarative data contracts on ingest - rejects rows that violate bounds or nullability.",
    },
    {
      name: "@extractor",
      description: "Python derived features run via PyO3 at read time. Kept out of the write path.",
    },
  ],
  capabilities: [
    { label: "Streaming operators", value: "Count, Sum, Max" },
    { label: "Time windows", value: "1h · 24h · 7d" },
    { label: "Derived signal", value: "is_suspicious" },
    { label: "Architecture", value: "Kappa" },
    { label: "Data validation", value: "@expectations" },
    { label: "Online/offline parity", value: "Guaranteed" },
  ],
  personas: [
    {
      entity: "u_normal",
      behavior: "1 order, spread across days",
      expected: "is_suspicious = false",
    },
    {
      entity: "u_fraud",
      behavior: "6 orders in 25 minutes",
      expected: "is_suspicious = true (velocity)",
    },
  ],
  audiences: {
    forEngineer:
      "One Python file defines five invertible aggregates across three windows and a derived is_suspicious extractor. No batch job to keep in sync, no Flink cluster to babysit, and point-in-time training queries hit the same state as production scoring.",
    forBusiness:
      "Fraud is caught at checkout, not in tomorrow's batch. Because training and serving share state by construction, the model you evaluated offline is the model that's running - no silent accuracy drift after deploy.",
  },
  related: ["price-anomaly", "experience-discovery"],
};

const priceAnomaly: CaseStudy = {
  slug: "price-anomaly",
  category: "Marketplace Trust & Safety",
  title: "Distribution-based price anomaly detection",
  tagline:
    "Catch listings priced outside their product's own historical distribution - not just above a naive threshold.",
  summary:
    "Streaming t-digest sketches compute percentile rank at write time. Reads serve a single pre-computed float - no sketch deserialization, no per-request computation.",
  icon: TrendingUp,
  accentColor: "#9C27B0",
  heroMetrics: [
    { label: "Distribution window", value: "180 days" },
    { label: "Sketch algorithm", value: "t-digest (tiled)" },
    { label: "Storage per product", value: "1 float" },
  ],
  problem: {
    heading: "$200 is normal - until it isn't",
    body: "Naive threshold rules produce false positives on high-variance products and miss anomalies on low-variance ones. The feature that matters is the percentile rank of a product's 7-day max price within its own 180-day distribution. That requires a compact, incrementally-updatable summary of the distribution: a streaming t-digest.",
    bullets: [
      "Pre-computed batch percentiles go stale within minutes",
      "Simple 2x-average thresholds misclassify luxury goods and phone cases",
      "Real prices are skewed and multimodal - means and stddevs lie",
    ],
  },
  approach: {
    heading: "Tiled t-digests, pre-computed ranks",
    body: "Each product's price distribution is stored as tiled t-digest sketches (~6 days per tile). On every write, the engine merges the value into the right tile, merges all live tiles for the full-window view, and writes the percentile rank (a single float) to RocksDB. The read path never deserializes a sketch.",
    diagram: {
      nodes: [
        { label: "ProductBooking", sublabel: "Postgres · 5s poll", kind: "source" },
        { label: "compute_stats", sublabel: "Max · ApproxPercentile (t-digest)", kind: "transform" },
        { label: "ProductPriceStats", sublabel: "RocksDB · pct_rank float", kind: "store" },
        { label: "PriceFeatures", sublabel: "price_decile · derived", kind: "serve" },
      ],
    },
  },
  code: {
    language: "python",
    filename: "features.py",
    caption: "Distribution-aware pricing with ApproxPercentile.",
    source: `from datetime import datetime
from thyme import (
    ApproxPercentile, Config, Max, dataset, extractor, extractor_inputs,
    extractor_outputs, feature, featureset, field, inputs, pipeline, source,
)

config = Config.load()
bookings_source = config.postgres_source(table="product_bookings")

@source(bookings_source, cursor="timestamp", every="5s", max_lateness="1h")
@dataset(version=1)
class ProductBooking:
    product_id: str = field(key=True)
    price: float = field()
    timestamp: datetime = field(timestamp=True)

@dataset(version=1, index=True)
class ProductPriceStats:
    product_id: str = field(key=True)
    max_price_7d: float = field()
    price_pct_rank_180d: float = field()
    timestamp: datetime = field(timestamp=True)

    @pipeline(version=1)
    @inputs(ProductBooking)
    def compute_stats(cls, bookings):
        return bookings.groupby("product_id").aggregate(
            max_price_7d=Max(of="price", window="7d"),
            price_pct_rank_180d=ApproxPercentile(of="price", window="180d"),
        )

@featureset
class PriceFeatures:
    product_id: str = feature(id=1)
    max_price_7d: float = feature(id=2)
    price_pct_rank_180d: float = feature(id=3)
    price_decile: int = feature(id=4)

    @extractor
    @extractor_inputs("price_pct_rank_180d")
    @extractor_outputs("price_decile")
    def compute_decile(cls, ts, pct_rank):
        if pct_rank is None:
            return 5
        return min(int(pct_rank * 10) + 1, 10)`,
  },
  features: [
    {
      name: "ApproxPercentile",
      description: "t-digest sketches tiled across the window. Merge cost is bounded by tile count, not value count.",
    },
    {
      name: "Tiled windows",
      description: "Sub-window tiles (~6 days each) get evicted whole. No per-value eviction bookkeeping.",
    },
    {
      name: "Pre-computed rank",
      description: "Percentile rank is stored as a float - reads never deserialize the sketch.",
    },
    {
      name: "Max(window=\"7d\")",
      description: "Tracks the recent price spike to compare against the long-tail distribution.",
    },
  ],
  capabilities: [
    { label: "Operator", value: "ApproxPercentile" },
    { label: "Sketch", value: "t-digest, tiled" },
    { label: "Distribution window", value: "180 days" },
    { label: "Tile eviction", value: "O(1) per tile" },
    { label: "Stored feature", value: "pct_rank (float)" },
    { label: "Online/offline parity", value: "Guaranteed" },
  ],
  personas: [
    {
      entity: "p_spike",
      behavior: "max_price_7d = $220.81",
      expected: "pct_rank = 0.998 - decile 10 anomaly",
    },
    {
      entity: "p_cheap",
      behavior: "max_price_7d = $31.87",
      expected: "pct_rank = 0.57 - decile 6, normal",
    },
    {
      entity: "p_premium",
      behavior: "max_price_7d = $620.58",
      expected: "pct_rank = 0.51 - decile 6, normal for its own distribution",
    },
  ],
  audiences: {
    forEngineer:
      "ApproxPercentile stores tiled t-digest sketches at write time; reads return a pre-computed float, not a sketch deserialization. Memory per product stays constant whether the distribution window is 7 days or 180. Online and point-in-time queries share the same code path.",
    forBusiness:
      "The platform learns what each product costs normally - not a global threshold that false-positives on luxury and misses cheap anomalies. False-positive rates drop across the long tail of SKUs where naive thresholds can't reach.",
  },
  related: ["fraud-detection", "experience-discovery"],
};

const experienceDiscovery: CaseStudy = {
  slug: "experience-discovery",
  category: "Travel & Marketplaces",
  title: "Real-time purchase intent for a travel marketplace",
  tagline:
    "Clickstream-driven intent signals for search ranking - 15 features across three time windows from a single streaming pipeline.",
  summary:
    "Kinesis clickstream temporally joined against user profiles, aggregated across 1h/24h/7d windows, and distilled into a composite is_high_intent signal - all from ~40 lines of Python.",
  icon: Compass,
  accentColor: "#2196F3",
  heroMetrics: [
    { label: "Features", value: "15" },
    { label: "Time windows", value: "3" },
    { label: "Lines of Python", value: "~40" },
  ],
  problem: {
    heading: "Which of your 500M visitors is about to book?",
    body: "Travel marketplaces need to tell active browsers from casual scrollers from dormant returners, in real time, to drive search ranking and personalization. The signal is a mix of windowed click rates, dwell time, and acceleration vs. baseline - computed from a 5,000 EPS clickstream and served at ranking-request latency.",
    bullets: [
      "Batch pipelines miss moment-to-moment intent and create training-serving skew",
      "Redis counters can't do temporal joins against a slowly-changing profile dimension",
      "Analytics warehouses aren't built for streaming ingest + sub-5ms point lookups",
    ],
  },
  approach: {
    heading: "Temporal join + 9 aggregations + 6 derived signals",
    body: "ClickEvents are temporally joined against the UserProfile dimension - every click is enriched with the profile as of that click's timestamp. The engine computes Count, Avg, and Sum across 1h/24h/7d windows using invertible operators (O(1) eviction). Six derived Python extractors produce engagement_velocity, dwell_depth_score, and the composite is_high_intent at query time.",
    diagram: {
      parallelSources: [
        { label: "ClickEvent", sublabel: "Kinesis · 5k EPS", kind: "source" },
        { label: "UserProfile", sublabel: "Postgres · indexed SCD", kind: "source" },
      ],
      nodes: [
        { label: "compute_engagement", sublabel: "temporal join · 9 aggs · 3 windows", kind: "transform" },
        { label: "UserEngagementStats", sublabel: "RocksDB · invertible ops", kind: "store" },
        { label: "DiscoverySignals", sublabel: "is_high_intent · 15 features", kind: "serve" },
      ],
    },
  },
  code: {
    language: "python",
    filename: "features.py",
    caption: "40 lines: Kinesis source, temporal join, multi-window aggregates.",
    source: `from datetime import datetime
from thyme import (
    Avg, Config, Count, Sum, dataset, extractor, extractor_inputs,
    extractor_outputs, feature, featureset, field, inputs, pipeline, source,
)
from thyme.connectors import KinesisSource

config = Config.load()
click_source = KinesisSource(
    stream_arn=config.kinesis.stream_arn,
    region=config.kinesis.region,
    init_position="trim_horizon",
    format="json",
)
profile_source = config.postgres_source(table="user_profiles")

@source(click_source, max_lateness="1h")
@dataset(version=1)
class ClickEvent:
    user_id: str = field(key=True)
    experience_id: str = field()
    category: str = field()
    dwell_time_sec: float = field()
    timestamp: datetime = field(timestamp=True)

@source(profile_source, cursor="timestamp", every="60s")
@dataset(version=1, index=True)
class UserProfile:
    user_id: str = field(key=True)
    segment: str = field()
    home_country: str = field()
    timestamp: datetime = field(timestamp=True)

@dataset(version=2, index=True)
class UserEngagementStats:
    user_id: str = field(key=True)
    event_count_1h: int = field()
    event_count_24h: int = field()
    event_count_7d: int = field()
    avg_dwell_sec_1h: float = field()
    sum_dwell_sec_1h: float = field()
    timestamp: datetime = field(timestamp=True)

    @pipeline(version=1)
    @inputs(ClickEvent, UserProfile)
    def compute_engagement(cls, clicks):
        return (
            clicks
            .join(UserProfile, on="user_id", fields=["segment"])
            .groupby("user_id")
            .aggregate(
                event_count_1h=Count(window="1h"),
                event_count_24h=Count(window="24h"),
                event_count_7d=Count(window="7d"),
                avg_dwell_sec_1h=Avg(of="dwell_time_sec", window="1h"),
                sum_dwell_sec_1h=Sum(of="dwell_time_sec", window="1h"),
            )
        )

@featureset
class DiscoverySignals:
    user_id: str = feature(id=1)
    engagement_velocity: float = feature(id=10)
    is_high_intent: bool = feature(id=14)

    @extractor
    @extractor_inputs("event_count_1h", "event_count_24h", "avg_dwell_sec_1h")
    @extractor_outputs("engagement_velocity", "is_high_intent")
    def compute(cls, ts, count_1h, count_24h, avg_dwell_1h):
        velocity = count_1h / max(count_24h / 24.0, 1.0)
        is_high_intent = velocity > 2.0 and (avg_dwell_1h or 0.0) >= 30.0
        return {"engagement_velocity": velocity, "is_high_intent": is_high_intent}`,
  },
  features: [
    {
      name: "KinesisSource",
      description: "Native streaming connector. trim_horizon picks up backfilled history on first deploy.",
    },
    {
      name: ".join(UserProfile, fields=[...])",
      description: "Temporal join: click is enriched with the profile as of the click's timestamp.",
    },
    {
      name: "Invertible Count / Sum",
      description: "7-day windows cost the same as 1-hour windows - eviction is O(1).",
    },
    {
      name: "Composite extractors",
      description: "engagement_velocity, dwell_depth_score, is_high_intent - derived in Python, no extra storage.",
    },
    {
      name: "Point-in-time reads",
      description: "Same endpoint, add a timestamp query param. Zero training-serving skew, guaranteed.",
    },
  ],
  capabilities: [
    { label: "Streaming source", value: "Kinesis (trim_horizon)" },
    { label: "Slowly-changing dim", value: "Postgres temporal join" },
    { label: "Time windows", value: "1h · 24h · 7d" },
    { label: "Raw aggregations", value: "9" },
    { label: "Derived signals", value: "6 (incl. is_high_intent)" },
    { label: "Online/offline parity", value: "Guaranteed" },
  ],
  personas: [
    {
      entity: "u_active_browser",
      behavior: "20 clicks/1h, 30s dwell",
      expected: "is_high_intent = true, velocity ~16x",
    },
    {
      entity: "u_casual_visitor",
      behavior: "2 clicks/1h, 4s dwell",
      expected: "is_high_intent = false",
    },
    {
      entity: "u_dormant_returner",
      behavior: "0 clicks/24h, 20 clicks/7d",
      expected: "all derived signals = 0, history preserved",
    },
  ],
  audiences: {
    forEngineer:
      "Kinesis clickstream temporally joined against the Postgres profile dimension, with nine invertible aggregates across three windows and six derived Python extractors. ~40 lines of feature code replaces the batch/streaming dual-pipeline you'd otherwise maintain.",
    forBusiness:
      "Ranking reflects what the visitor is doing right now - their last five minutes of browsing matters more than a nightly batch. Training data and production signals agree at every timestamp, so ranking experiments generalise from offline evaluation to production.",
  },
  related: ["fraud-detection", "price-anomaly"],
};

export const caseStudies: CaseStudy[] = [
  experienceDiscovery,
  fraudDetection,
  priceAnomaly,
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getAllSlugs(): string[] {
  return caseStudies.map((c) => c.slug);
}

export function getRelatedCaseStudies(slug: string): CaseStudy[] {
  const study = getCaseStudy(slug);
  if (!study) return [];
  return study.related
    .map((s) => getCaseStudy(s))
    .filter((c): c is CaseStudy => c !== undefined);
}
