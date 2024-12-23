import { Injectable } from '@angular/core';

export interface ParsedFrame {
  frameNumber: number;
  timestamp: string;
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  length: number;
  info: string;
}

export interface IPv4Statistics {
  totalPackets: number;
  totalBytes: number;
  uniqueSourceIPs: any;
  uniqueDestinationIPs: any;
  packetCountsBySource: Record<string, number>;
  packetCountsByDestination: Record<string, number>;
  bytesBySource: Record<string, number>;
  bytesByDestination: Record<string, number>;
}

@Injectable({
  providedIn: 'root',
})
export class IPv4AnalyzerService {
  private frames: ParsedFrame[] = [];
  private ipv4Stats: IPv4Statistics = {
    totalPackets: 0,
    totalBytes: 0,
    uniqueSourceIPs: null,
    uniqueDestinationIPs: null,
    packetCountsBySource: {},
    packetCountsByDestination: {},
    bytesBySource: {},
    bytesByDestination: {},
  };

  constructor() {}

  setFrames(frames: ParsedFrame[]): void {
    this.frames = frames;
  }

  analyze(): void {
    const stats: IPv4Statistics = {
      totalPackets: 0,
      totalBytes: 0,
      uniqueSourceIPs: new Set(),
      uniqueDestinationIPs: new Set(),
      packetCountsBySource: {},
      packetCountsByDestination: {},
      bytesBySource: {},
      bytesByDestination: {},
    };

    this.frames.forEach((frame) => {
      const { sourceIP, destinationIP, length } = frame;

      stats.totalPackets += 1;
      stats.totalBytes += length;

      // Unique IPs
      stats.uniqueSourceIPs.add(sourceIP);
      stats.uniqueDestinationIPs.add(destinationIP);

      // Packet counts by source/destination
      stats.packetCountsBySource[sourceIP] = (stats.packetCountsBySource[sourceIP] || 0) + 1;
      stats.packetCountsByDestination[destinationIP] =
        (stats.packetCountsByDestination[destinationIP] || 0) + 1;

      // Bytes by source/destination
      stats.bytesBySource[sourceIP] = (stats.bytesBySource[sourceIP] || 0) + length;
      stats.bytesByDestination[destinationIP] = (stats.bytesByDestination[destinationIP] || 0) + length;
    });

    this.ipv4Stats = stats;
  }

  getIPv4Statistics(): IPv4Statistics {
    // Convert sets to arrays for easier consumption in UI
    return {
      ...this.ipv4Stats,
      uniqueSourceIPs: Array.from(this.ipv4Stats.uniqueSourceIPs),
      uniqueDestinationIPs: Array.from(this.ipv4Stats.uniqueDestinationIPs),
    };
  }
}
