/// <reference types="@types/dom-mediacapture-record" />
import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ChatService } from '../../services/chat.service'
import { CaptureAudioService } from 'src/app/services/capture-audio.service'
import { CaptureScreenService } from 'src/app/services/capture-screen.service'
import * as io from 'socket.io-client'

@Component({
  selector: 'app-roomA',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponentA implements OnInit 
{ 
    //para receber o nome do usuário informado na tela principal (home)
    @Input() usuario: string

    socket: SocketIOClient.Socket
    video: HTMLVideoElement
    constraints = { audio: true, video: true }
    user: String
    room: String
    messageText: String
    messageArray: Array<{ user: String, message: String }> = []

    id: string;
    gainNode: GainNode;

    constructor(private route: ActivatedRoute, private chatService: ChatService, // private audioService: CaptureAudioService,
      // private screenService: CaptureScreenService 
    ) 
    {
      this.chatService.newUserJoined().subscribe(data=> this.messageArray.push(data))

      this.chatService.userLeftRoom().subscribe(data=>this.messageArray.push(data))

      this.chatService.newMessageReceived().subscribe(data=>this.messageArray.push(data))
    }


  // changeVolume(value: number) {
  //   this.gainNode.gain.value = value;
  // }

  ngOnInit() 
  {
      // this.socket = io.connect('http://localhost:3001') //Servidor
      this.route.params.subscribe( (parametro: any) => //método subscribe permite encaminhar uma função de callback, algo que será feito quando as rotas forem modificadas
      {
           console.log('Parâmetro funcionando nessa BAGAÇA: ', parametro.id )                
      }) 

        this.video = document.querySelector('video');
        navigator.mediaDevices.getUserMedia(this.constraints)
        .then( stream => { this.video.srcObject = stream }, error => { console.error('Erro na requisição: ' + error) })     

        console.log('Nome usuário: ', this.usuario)

    // this.id = this.route.snapshot.paramMap.get('id');
    // console.log(`You are in the room with id ${this.id}`)

    // let audioPromise = this.audioService.capture()

    // audioPromise.then(audioStream => {
    //   //O script abaixo é responsável por processar audio streams.. 
    //   //Nesse exemplo, eu estou reproduzindo minha propria voz no browser 
    //   //(ele captura o áudio do mic e simplesmente reproduz)
    //   const audioContext = new AudioContext();
    //   this.gainNode = audioContext.createGain();
    //   this.gainNode.connect(audioContext.destination);

    //   const microphoneStream = audioContext.createMediaStreamSource(audioStream);
    //   microphoneStream.connect(this.gainNode);
    // })

    // audioPromise.catch((x) => {
    //   console.log('Not Worked');
    //   console.log(x);
    // });

    // //Script para captura de tela
    // this.screenService.capture().then(stream => {
    //   let mediaRecorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
    //   let video = <HTMLVideoElement>document.querySelector('video');
    //   video.srcObject = stream;
    //   video.onloadedmetadata = function() {
    //     video.play();
    //   };
    //   mediaRecorder.start(10);
    // });
  }
}
