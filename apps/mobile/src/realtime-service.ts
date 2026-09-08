import { MobileSession } from './session';
export type MobileRealtimeEvent={eventId:string;eventType:string;schemaVersion:1;occurredAt:string;resource:{type:string;id:string};payload:Record<string,unknown>};
export type RealtimeConnection={close():void};
export type RealtimeEventSourceFactory=(url:string,init:{headers:{Authorization:string}},onEvent:(event:MobileRealtimeEvent)=>void,onError:()=>void)=>RealtimeConnection;
export class MobileRealtimeService{
 private connection?:RealtimeConnection; private reconnectTimer?:ReturnType<typeof setTimeout>; private stopped=true;
 constructor(private readonly baseUrl:string,private readonly session:MobileSession,private readonly factory:RealtimeEventSourceFactory,private readonly reconcile:()=>Promise<void>,private readonly delayMs=1500){}
 async start(onEvent:(event:MobileRealtimeEvent)=>void){this.stopped=false;await this.connect(onEvent);}
 stop(){this.stopped=true;this.connection?.close();this.connection=undefined;if(this.reconnectTimer)clearTimeout(this.reconnectTimer);}
 private async connect(onEvent:(event:MobileRealtimeEvent)=>void){const credential=await this.session.getCredential();if(!credential||this.stopped)return;this.connection?.close();this.connection=this.factory(this.baseUrl.replace(/\/$/,'')+'/realtime/events',{headers:{Authorization:'Bearer '+credential}},event=>{void this.reconcile().finally(()=>onEvent(event));},()=>{this.connection=undefined;if(!this.stopped)this.reconnectTimer=setTimeout(()=>void this.reconnect(onEvent),this.delayMs);});}
 private async reconnect(onEvent:(event:MobileRealtimeEvent)=>void){if(this.stopped)return;await this.reconcile();await this.connect(onEvent);}
}
