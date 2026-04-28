import type { MDXComponents } from 'mdx/types';
import defaultComponents from 'fumadocs-ui/mdx';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { ReadWriteDiagram } from '@/components/diagrams/read-write-diagram';
import {
  ConceptFlowDiagram,
  ExperienceDiscoveryDiagram,
  SystemFlowDiagram,
} from '@/components/diagrams/flow-diagram';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...components,
    Tabs,
    Tab,
    Callout,
    Card,
    Cards,
    ReadWriteDiagram,
    ConceptFlowDiagram,
    SystemFlowDiagram,
    ExperienceDiscoveryDiagram,
  };
}
