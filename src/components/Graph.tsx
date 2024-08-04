'use client'

import React, { useEffect, useState } from 'react';
import { useChainContext } from '~/context/ChainContextProvider';
import Graph from "react-graph-vis"
import { type Node, type Edge } from 'vis';

export type GraphProps = {
  width: number;
  height: number;
  className: string;
};

export default function GraphComp({ className }: GraphProps) {
  const { locations, links } = useChainContext();

  const [graph, setGraph] = useState<{ nodes: Node[], edges: Edge[] }>({
    nodes: [],
    edges: []
  });

  useEffect(() => {
    setGraph({
      nodes: locations ?? [],
      edges: links.map((link) => {
        return { from: link.from, to: link.to }
      })
    })
  }, [links, locations]);

  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: "#000000"
    },
    height: "500px"
  };

  return (
    <div className={`${className}`}>
      <Graph
        graph={graph}
        options={options}
        events={{
          select: (event) => {
            // TODO: open modal with location info, delete, edit options etc
            const { nodes, edges } = event;
            console.log("Selected nodes:", nodes);
            console.log("Selected edges:", edges);
          },
        }}
      />
    </div>
  );
}
