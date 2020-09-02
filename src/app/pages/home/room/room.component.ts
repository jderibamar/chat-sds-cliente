/// <reference types="@types/dom-mediacapture-record" />
import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ChatService } from '../../../services/chat.service'
import { CaptureAudioService } from 'src/app/services/capture-audio.service'
import { CaptureScreenService } from 'src/app/services/capture-screen.service'
import * as io from 'socket.io-client'
import { Observable } from 'rxjs'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { trigger, state, style } from '@angular/animations'


@Component(
{
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  animations:
  [
     trigger('nomeu', 
     [
        state('escondido', style(
          {
              opacity: 0
          } )),
       state('visivel', style(
         {
            opacity: 1
         } ))   
     ]) 
  ]
})

@Injectable()
export class RoomComponent implements OnInit
{         
    socket: SocketIOClient.Socket
    // video: HTMLVideoElement
    constraints = { audio: true, video: true }
    user: String
    room: String   
    usuario: String //guarda o usuário logado 
    messageText: String
    messageArray = []
    listaU = []  
    msgHabDes = true
    btEntHabDes = true
    verUpre = false //verificar se o campo do nome do usuário foi preenchido
    estado = 'visivel' //para alterar o estado do nome do usuário quando loga entre visível / invisível
    msgDig = ''

    id: string;
    gainNode: GainNode

    @ViewChild('divScrool') divScrool: ElementRef
    

    // formulario: FormGroup = new FormGroup(
    //    {
    //     'nome_u': new FormControl(null, [Validators.required])
    //    })

    constructor(private route: ActivatedRoute, private chatService: ChatService  // private audioService: CaptureAudioService,
      // private screenService: CaptureScreenService 
    ) 
    {
      // this.chatService.newUserJoined().subscribe(data => this.messageArray.push(data))
      // this.chatService.userLeftRoom().subscribe(data => this.messageArray.push(data))
      this.chatService.newMessageReceived().subscribe(data => { this.messageArray.push( data.message ) })
      this.chatService.newUserJoined().subscribe(data => this.listaU.push(data))
      
    }

    ngOnInit() 
    {
        // this.socket = io.connect('http://localhost:3000') //Servidor
        this.socket = io('https://sds-chat.herokuapp.com/')
        this.route.params.subscribe( (parametro: any) => 
        {
            console.log('Parâmetro funcionando nessa BAGAÇA: ', parametro.id )                
        }) 

          const localVideo = document.getElementById ('local-video') as HTMLVideoElement
          navigator.mediaDevices.getUserMedia(this.constraints)
          .then( stream => { localVideo.srcObject = stream }, error => { console.error('Erro na requisição de áudio e vídeo: ' + error) })
    }
  
    sendMessage()
    {            
        this.socket.emit('new message', { user: this.usuario, mensage: this.messageText })
        let msgValue = document.getElementById('txt-mensagem') as HTMLInputElement
        console.log('mensagem digitada: ', msgValue.value)
        this.messageText = ''
        this.estado = 'escondido'
    }

    novoUsuario()
    {
        // this.chatService.joinRoom({ user: this.user })        
        this.socket.emit('add user', { user: this.user, message: 'Usuário conectado'  })
        this.usuario = this.user

        // console.log(`Usuário ${ this.usuario } acabou de entrar`)
        // console.log('Usuários logados: ', this.listaU)               
    }

    //habilitar input de mensagens
    msgHabIn()
    {                   
       let msgIn = document.getElementById('txt-mensagem') as HTMLInputElement
       msgIn.style.backgroundColor = '#fff'               
              
       if(this.user.length > 3)
       {
          this.msgHabDes = false
          this.novoUsuario()
          alert(`${ this.user } já pode enviar mensagens!`);          
          this.user = ''
          msgIn.focus()
       }          
       else
       {
          alert('Nome de usuário deve ter mais de 3 caracteres')
          let unome = document.getElementById('txt-usuario')
          unome.focus()                    
       }
         
       msgIn.focus()

      //  document.querySelector('input').focus()
      //  console.log(document.activeElement.tagName)
       // let msgInFocus = (<HTMLInputElement>msgIn).focus()    
    }  

    leave()
    {
        // this.chatService.leaveRoom({ user: this.user, room: this.room})
    }
     

    msgRecebida()
    {     
        this.socket.on('new message', data => 
        { 
            this.messageArray.push({ user: data.username, message: data.mensage })
            console.log('Tamanho do array de msgs: ', data.length)
            console.log('Msgs recebidas do servidor: ', data)
            // this.socket.disconnect()

        })
    }
      
    scroll()
    {
        //scrollTop: quantidade de rolagem que o usuário fez
        //scrollHeight: tamanho total do contêiner

        let priVez = true //verificar se é a primeira vez que rola a barra de rolagem
        let scrollDiv = document.getElementById('div-scroll')

        if(priVez)
        {
            scrollDiv.scrollTop = scrollDiv.scrollHeight
            priVez = false
        }
        else if(scrollDiv.scrollTop + scrollDiv.scrollHeight === scrollDiv.scrollHeight)
        {
          scrollDiv.scrollTop = scrollDiv.scrollHeight
        }

        // let altPag = document.body.scrollHeight  -> pega a altura do container        
    }

}







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

     // @Input()
    // set usuario(pU: string)
    // {
    //     this._usuario = pU
    // }

    // get usuario() : string { return this._usuario }

  // changeVolume(value: number) {
  //   this.gainNode.gain.value = value;
  // }