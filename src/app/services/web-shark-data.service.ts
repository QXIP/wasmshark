import { hash } from '@app/helper/functions';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface HashBuffer {
  [key: string]: any;
}

class StaticData {
  static captureFile: string = '';
  static filter: string = '';
}
class BufferData {
  static data: HashBuffer = {};
}
@Injectable({
  providedIn: 'root'
})
export class WebSharkDataService {

  private url = `${environment.apiUrl}json`;
  private urlUpload = `${environment.apiUrl}upload`;

  private behavior = new BehaviorSubject({})
  public updates: Observable<any>;

  constructor(private http: HttpClient) {
    const getParam = decodeURIComponent(location.hash.slice(1))
    setTimeout(() => {
      if (getParam) {
        this.getFiles().then(f => {
          // hash
          const fileObject = f.files.find((i: any) => hash(i.name) === getParam);
          if (!fileObject) {
            location.hash = '';
            return;
          }

          const fileName = fileObject.name;
          StaticData.captureFile = fileName;
          location.hash = '#' + encodeURIComponent(hash(fileName));
          this.behavior.next({});
        })
      }
    }, 200);
    this.updates = this.behavior.asObservable();
  }

  private params(method: string, paramObj: any): string {
    const param: any = Object.assign({
      method,
      capture: this.getCapture()
    }, paramObj);
    if (StaticData.filter && method != 'frame') {
      param.filter = StaticData.filter;
    }
    return Object.entries(param).map(
      ([key, value]: any[]) =>
        `${key}=${encodeURIComponent(value)}`
    ).join('&');
  }
  public setFilter(filter: string) {
    // 'filter='+encodeURIComponent(`sip.Via.received == "195.138.93.233"`)
    StaticData.filter = filter;
    this.behavior.next({});
  }
  public getFilter(): string {
    return StaticData.filter;
  }
  public setCaptureFile(fileName: string) {
    StaticData.captureFile = fileName;
    location.hash = '#' + hash(fileName);
    this.behavior.next({});
  }

  public getCapture(): string {
    return StaticData.captureFile;
  }
  private getBufferGate<T>(url: string): Observable<any> {
    const bufferIndex = hash(url);
    if (BufferData.data[bufferIndex]) {
      return new Observable(observer => {
        observer.next(BufferData.data[bufferIndex]);
        observer.complete();
      });
    }
    return this.http.get<T>(url).pipe(map(data => {
      BufferData.data[bufferIndex] = data;
      return data;
    }));
  }
  getBLOB(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'blob' });
  }
  private httpGet(command: string, params: any = null): Promise<any> {
    if (typeof params === 'string') {
      return this.getBufferGate<any>(`${this.url}?method=${command}&${params}`).toPromise();
    }
    if (!this.getCapture()) {
      return new Promise((reason, reject) => {
        reject({ error: 'Capture file is unset!' });
      })
    }
    const strParams = params ? this.params(command, params) : 'method=' + command;
    return this.getBufferGate<any>(`${this.url}?${strParams}`).toPromise();
  }

  getInfo(): Promise<any> {
    return this.httpGet('info');
  }

  getFiles(dir: string = ''): Promise<any> {
    return this.httpGet('files', dir && 'dir=' + encodeURIComponent('/' + dir));
  }

  getFrames(limit = 120): Promise<any> {
    if (limit === 0) {
      return this.httpGet('frames', {});
    }
    return this.httpGet('frames', { limit });
  }

  getFrameData(frameId: number): Promise<any> {
    const params: any = {
      bytes: 'yes',
      proto: 'yes',
      frame: frameId
    }
    if (frameId - 1) {
      params.prev_frame = frameId - 1;
    }
    return this.httpGet('frame', params);

  }
  getTapJson(tapID: string): Promise<any> {
    return this.httpGet('tap', { tap0: tapID })
  }
  getMp3LinkByRowData(rtpData: any): string {
    const { saddr, sport, daddr, dport, ssrc } = rtpData;
    const token = 'rtp:' + [
      saddr, sport, daddr, dport,
      ssrc.toString(16)
    ].join('_');
    const strParams = this.params('download', { token });
    return `${this.url}?${strParams}`
  }
  getRTPStreamTap(rtpData: any): Promise<any> {
    const { saddr, sport, daddr, dport, ssrc } = rtpData;
    const tap0 = 'rtp-analyse:' + [
      saddr, sport, daddr, dport,
      ssrc.toString(16)
    ].join('_');

    return this.httpGet('tap', { tap0 });
    /**
     * data = {
        "ssrc":1289913356,
        "payload":"g711A",
        "saddr":"10.0.131.72",
        "sport":5010,
        "daddr":"10.0.131.70",
        "dport":5014,
        "pkts":555,
        "max_delta":23.220000,
        "max_jitter":2.800501,
        "mean_jitter":2.687978,
        "expectednr":555,
        "totalnr":555,
        "problem":false,
        "ipver":4
      }
     */
  }
  postFile(fileToUpload: File, isDataTimeNow: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    const url = isDataTimeNow ? this.urlUpload + '/now' : this.urlUpload;

    return this.http.post(url, formData).pipe(map(() => {
      this.setCaptureFile(fileToUpload.name);
      this.behavior.next({ cm: 'uploaded' });
    }));
  }
}
