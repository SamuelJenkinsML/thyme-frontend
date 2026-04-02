import {
  Database,
  Snowflake,
  MessageSquareCode,
  HardDrive,
  Cloud,
  Hexagon,
  Plug,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  postgres: Database,
  snowflake: Snowflake,
  kafka: MessageSquareCode,
  s3json: HardDrive,
  kinesis: Cloud,
  bigquery: Cloud,
  iceberg: Hexagon,
};

const labelMap: Record<string, string> = {
  postgres: "Postgres",
  snowflake: "Snowflake",
  kafka: "Kafka",
  s3json: "S3",
  kinesis: "Kinesis",
  bigquery: "BigQuery",
  iceberg: "Iceberg",
};

interface ConnectorIconProps {
  connectorType: string;
  className?: string;
  showLabel?: boolean;
  size?: number;
}

export function ConnectorIcon({
  connectorType,
  className,
  showLabel = false,
  size = 16,
}: ConnectorIconProps) {
  const Icon = iconMap[connectorType] ?? Plug;
  const label = labelMap[connectorType] ?? connectorType;

  if (showLabel) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Icon className={className} size={size} />
        <span>{label}</span>
      </span>
    );
  }

  return <Icon className={className} size={size} />;
}

export function getConnectorLabel(connectorType: string): string {
  return labelMap[connectorType] ?? connectorType;
}
