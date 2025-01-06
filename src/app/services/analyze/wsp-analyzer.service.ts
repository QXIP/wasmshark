import { Injectable } from '@angular/core';

export interface ParsedFrame {
  frameNumber: number;
  timestamp: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
}

export interface PacketCounter {
  protocol: string;
  totalPackets: number;
  totalBytes: number;
  packetsBySource: Record<string, number>;
  packetsByDestination: Record<string, number>;
}
/**
 *
    const frames: ParsedFrame[] = [
      {
        frameNumber: 1,
        timestamp: '2024-12-23T12:00:00Z',
        source: '192.168.0.1',
        destination: '192.168.0.2',
        protocol: 'WAP-WSP',
        length: 100,
        info: 'Some Info',
      },
      {
        frameNumber: 2,
        timestamp: '2024-12-23T12:00:01Z',
        source: '192.168.0.1',
        destination: '192.168.0.3',
        protocol: 'WAP-WSP',
        length: 200,
        info: 'Some Info',
      },
      {
        frameNumber: 3,
        timestamp: '2024-12-23T12:00:02Z',
        source: '192.168.0.2',
        destination: '192.168.0.1',
        protocol: 'WAP-WSP',
        length: 150,
        info: 'Some Info',
      },
    ];

    // Установка данных и анализ
    this.wspAnalyzerService.setFrames(frames);
    this.wspAnalyzerService.analyze();
    this.packetCounters = this.wspAnalyzerService.getPacketCounters();
 *
 *
 */


@Injectable({
  providedIn: 'root',
})
export class WspAnalyzerService {
  private frames: ParsedFrame[] = [];
  private packetCounters: PacketCounter[] = [];

  constructor() {}

  setFrames(frames: ParsedFrame[]): void {
    this.frames = frames;
  }

  analyze(): void {
    const protocolMap: Map<string, PacketCounter> = new Map();

    this.frames.forEach((frame) => {
      const protocol = frame.protocol;
      if (!protocolMap.has(protocol)) {
        protocolMap.set(protocol, {
          protocol,
          totalPackets: 0,
          totalBytes: 0,
          packetsBySource: {},
          packetsByDestination: {},
        });
      }

      const counter = protocolMap.get(protocol)!;
      counter.totalPackets += 1;
      counter.totalBytes += frame.length;

      if (!counter.packetsBySource[frame.source]) {
        counter.packetsBySource[frame.source] = 0;
      }
      counter.packetsBySource[frame.source] += 1;

      if (!counter.packetsByDestination[frame.destination]) {
        counter.packetsByDestination[frame.destination] = 0;
      }
      counter.packetsByDestination[frame.destination] += 1;
    });

    this.packetCounters = Array.from(protocolMap.values());
  }

  getPacketCounters(): PacketCounter[] {
    return this.packetCounters;
  }
}
