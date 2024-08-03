declare module "react-graph-vis" {
    import { type Network, type NetworkEvents, type Options, type Node, type Edge, type DataSet } from "vis";
    import { Component } from "react";
  
    export { Network, NetworkEvents, Options, Node, Edge, DataSet } from "vis";
  
    export type graphEvents = Record<NetworkEvents, (params?: unknown) => void>;
  
    //Doesn't appear that this module supports passing in a vis.DataSet directly. Once it does graph can just use the Data object from vis.
    export interface graphData {
      nodes: Node[];
      edges: Edge[];
    }
  
    export interface NetworkGraphProps {
      graph: graphData;
      options?: Options;
      events?: graphEvents;
      getNetwork?: (network: Network) => void;
      identifier?: string;
      style?: React.CSSProperties;
      getNodes?: (nodes: DataSet) => void;
      getEdges?: (edges: DataSet) => void;
    }
  
    export interface NetworkGraphState {
      identifier: string;
    }
  
    export default class NetworkGraph extends Component<
      NetworkGraphProps,
      NetworkGraphState
    > {
      render();
    }
  }
