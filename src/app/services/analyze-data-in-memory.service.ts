import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeDataInMemoryService {
  mapFunctions: any = {
    "stat:lbmr_queue_ads_queue": () => {
      return {};
    },
    "stat:lbmr_queue_ads_source": () => {
      return {};
    },
    "stat:lbmr_queue_queries_queue": () => {
      return {};
    },
    "stat:lbmr_queue_queries_receiver": () => {
      return {};
    },
    "stat:lbmr_topic_ads_source": () => {
      return {};
    },
    "stat:lbmr_topic_ads_topic": () => {
      return {};
    },
    "stat:lbmr_topic_ads_transport": () => {
      return {};
    },
    "stat:lbmr_topic_queries_receiver": () => {
      return {};
    },
    "stat:lbmr_topic_queries_topic": () => {
      return {};
    },
    "stat:lbmr_topic_queries_pattern": () => {
      return {};
    },
    "stat:lbmr_topic_queries_pattern_receiver": () => {
      return {};
    },
    "stat:ancp": () => {
      return {};
    },
    "stat:bacapp_ip": () => {
      return {};
    },
    "stat:bacapp_instanceid": () => {
      return {};
    },
    "stat:bacapp_objectid": () => {
      return {};
    },
    "stat:bacapp_service": () => {
      return {};
    },
    "stat:collectd": () => {
      return {};
    },
    "stat:dns": () => {
      return {};
    },
    "stat:dns_qr": () => {
      return {};
    },
    "stat:e2ap": () => {
      return {};
    },
    "stat:f1ap": () => {
      return {};
    },
    "stat:f5_virt_dist": () => {
      return {};
    },
    "stat:f5_tmm_dist": () => {
      return {};
    },
    "stat:hart_ip": () => {
      return {};
    },
    "stat:hpfeeds": () => {
      return {};
    },
    "stat:http_srv": () => {
      return {};
    },
    "stat:http": () => {
      return {};
    },
    "stat:http_seq": () => {
      return {};
    },
    "stat:http_req": () => {
      return {};
    },
    "stat:http2": () => {
      return {};
    },
    "stat:ltp": () => {
      return {};
    },
    "stat:ngap": () => {
      return {};
    },
    "stat:osmux": () => {
      return {};
    },
    "stat:rtsp": () => {
      return {};
    },
    "stat:smpp_commands": () => {
      return {};
    },
    "stat:someip_messages": () => {
      return {};
    },
    "stat:someipsd_entries": () => {
      return {};
    },
    "stat:sametime": () => {
      return {};
    },
    "stat:isup_msg": () => {
      return {};
    },
    "stat:ucp_messages": () => {
      return {};
    },
    "nstat:ansi_a,bsmap": () => {
      return {};
    },
    "nstat:ansi_a,dtap": () => {
      return {};
    },
    "nstat:ansi_map": () => {
      return {};
    },
    "nstat:asap,stat": () => {
      return {};
    },
    "nstat:calcappprotocol,stat": () => {
      return {};
    },
    "nstat:camel,counter": () => {
      return {};
    },
    "nstat:componentstatusprotocol,stat": () => {
      return {};
    },
    "nstat:dhcp,stat": () => {
      return {};
    },
    "nstat:enrp,stat": () => {
      return {};
    },
    "nstat:fractalgeneratorprotocol,stat": () => {
      return {};
    },
    "nstat:gsm_a,bssmap": () => {
      return {};
    },
    "nstat:gsm_a,dtap_cc": () => {
      return {};
    },
    "nstat:gsm_a,dtap_gmm": () => {
      return {};
    },
    "nstat:gsm_a,dtap_mm": () => {
      return {};
    },
    "nstat:gsm_a,dtap_rr": () => {
      return {};
    },
    "nstat:gsm_a,dtap_sacch": () => {
      return {};
    },
    "nstat:gsm_a,dtap_sm": () => {
      return {};
    },
    "nstat:gsm_a,dtap_sms": () => {
      return {};
    },
    "nstat:gsm_a,dtap_ss": () => {
      return {};
    },
    "nstat:gsm_a,dtap_tp": () => {
      return {};
    },
    "nstat:gsm_map,operation": () => {
      return {};
    },
    "nstat:h225,counter": () => {
      return {};
    },
    "nstat:mtp3,msus": () => {
      return {};
    },
    "nstat:npm,stat": () => {
      return {};
    },
    "nstat:pingpongprotocol,stat": () => {
      return {};
    },
    "nstat:rpc,programs": () => {
      return {};
    },
    "nstat:sip,stat": () => {
      return {};
    },
    "nstat:ssprotocol,stat": () => {
      return {};
    },
    "nstat:wsp,stat": () => {
      return {};
    },
    "conv:BPv7": () => {
      return {};
    },
    "endpt:BPv7": () => {
      return {};
    },
    "conv:Bluetooth": () => {
      return {};
    },
    "endpt:Bluetooth": () => {
      return {};
    },
    "conv:DCCP": () => {
      return {};
    },
    "endpt:DCCP": () => {
      return {};
    },
    "conv:Ethernet": () => {
      return {};
    },
    "endpt:Ethernet": () => {
      return {};
    },
    "conv:FC": () => {
      return {};
    },
    "endpt:FC": () => {
      return {};
    },
    "conv:FDDI": () => {
      return {};
    },
    "endpt:FDDI": () => {
      return {};
    },
    "conv:IEEE 802.11": () => {
      return {};
    },
    "endpt:IEEE 802.11": () => {
      return {};
    },
    "conv:IEEE 802.15.4": () => {
      return {};
    },
    "endpt:IEEE 802.15.4": () => {
      return {};
    },
    "conv:IPX": () => {
      return {};
    },
    "endpt:IPX": () => {
      return {};
    },
    "conv:IPv4": () => {
      return {};
    },
    "endpt:IPv4": () => {
      return {};
    },
    "conv:IPv6": () => {
      return {};
    },
    "endpt:IPv6": () => {
      return {};
    },
    "conv:JXTA": () => {
      return {};
    },
    "endpt:JXTA": () => {
      return {};
    },
    "conv:LTP": () => {
      return {};
    },
    "endpt:LTP": () => {
      return {};
    },
    "conv:MPTCP": () => {
      return {};
    },
    "endpt:MPTCP": () => {
      return {};
    },
    "conv:NCP": () => {
      return {};
    },
    "endpt:NCP": () => {
      return {};
    },
    "conv:RSVP": () => {
      return {};
    },
    "endpt:RSVP": () => {
      return {};
    },
    "conv:SCTP": () => {
      return {};
    },
    "endpt:SCTP": () => {
      return {};
    },
    "conv:SLL": () => {
      return {};
    },
    "endpt:SLL": () => {
      return {};
    },
    "conv:TCP": () => {
      return {};
    },
    "endpt:TCP": () => {
      return {};
    },
    "conv:Token-Ring": () => {
      return {};
    },
    "endpt:Token-Ring": () => {
      return {};
    },
    "conv:UDP": () => {
      return {};
    },
    "endpt:UDP": () => {
      return {};
    },
    "conv:USB": () => {
      return {};
    },
    "endpt:USB": () => {
      return {};
    },
    "conv:ZigBee": () => {
      return {};
    },
    "endpt:ZigBee": () => {
      return {};
    },
    "conv:openSAFETY": () => {
      return {};
    },
    "endpt:openSAFETY": () => {
      return {};
    },
    "seqa:any": () => {
      return {};
    },
    "seqa:icmp": () => {
      return {};
    },
    "seqa:icmpv6": () => {
      return {};
    },
    "seqa:lbm_uim": () => {
      return {};
    },
    "seqa:tcp": () => {
      return {};
    },
    "multicast": () => {
      return {};
    },
    "rtp-streams": () => {
      return {};
    },
    "phs": () => {
      return {};
    },
    "voip-calls": () => {
      return {};
    },
    "voip-convs": () => {
      return {};
    },
    "expert": () => {
      return {};
    },
    "eo:dicom": () => {
      return {};
    },
    "eo:ftp-data": () => {
      return {};
    },
    "eo:http": () => {
      return {};
    },
    "eo:imf": () => {
      return {};
    },
    "eo:smb": () => {
      return {};
    },
    "eo:tftp": () => {
      return {};
    },
    "srt:afp": () => {
      return {};
    },
    "srt:camel": () => {
      return {};
    },
    "srt:dcerpc": () => {
      return {};
    },
    "srt:diameter": () => {
      return {};
    },
    "srt:fc": () => {
      return {};
    },
    "srt:gtp": () => {
      return {};
    },
    "srt:gtpv2": () => {
      return {};
    },
    "srt:kerberos": () => {
      return {};
    },
    "srt:ldap": () => {
      return {};
    },
    "srt:ncp": () => {
      return {};
    },
    "srt:nfsv4": () => {
      return {};
    },
    "srt:pfcp": () => {
      return {};
    },
    "srt:rpc": () => {
      return {};
    },
    "srt:scsi": () => {
      return {};
    },
    "srt:smb": () => {
      return {};
    },
    "srt:smb2": () => {
      return {};
    },
    "srt:snmp": () => {
      return {};
    },
    "rtd:h225_ras": () => {
      return {};
    },
    "rtd:megaco": () => {
      return {};
    },
    "rtd:mgcp": () => {
      return {};
    },
    "rtd:radius": () => {
      return {};
    },
    "follow:DCCP": () => {
      return {};
    },
    "follow:HTTP": () => {
      return {};
    },
    "follow:HTTP2": () => {
      return {};
    },
    "follow:QUIC": () => {
      return {};
    },
    "follow:SIP": () => {
      return {};
    },
    "follow:TCP": () => {
      return {};
    },
    "follow:TLS": () => {
      return {};
    },
    "follow:UDP": () => {
      return {};
    },
    "follow:USBCOM": () => {
      return {};
    },
    "follow:WebSocket": () => {
      return {};
    }
  }
  constructor() {

  }
  getDataByTapKey(tapKey: string): any {
    if(this.mapFunctions[tapKey]) {

      return this.mapFunctions[tapKey]();
    }
    return {error: true, `tapKey: ${tapKey} does not exist`}

  }

}
