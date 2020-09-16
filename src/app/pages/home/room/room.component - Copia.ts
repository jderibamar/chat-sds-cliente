// const jsdom = require('jsdom')
// this.mywindow.document = jsdom('');
// this.mywindow.this.mywindow = global.document.defaultView


/// <reference types="@types/dom-mediacapture-record" />
import { Component, OnInit, Input, Injectable, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ChatService } from '../../../services/chat.service'
import * as io from 'socket.io-client'
import { Observable } from 'rxjs'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { trigger, state, style } from '@angular/animations'
import { async } from 'rxjs/internal/scheduler/async'
import  * as Peer from  'simple-peer'
import { analyzeAndValidateNgModules } from '@angular/compiler'
import { global } from '@angular/compiler/src/util'

interface MyWindow extends Window
{
    myWindowObj: object
}

const { RTCPeerConnection, RTCSessionDescription } = window

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
    mediaConstraints = { audio: true, video: true }
    user: String
    room: String   
    usuario: String //guarda o usuário logado 
    messageText: String
    messageArray = []
    listaU = [] 
    numUsers = 0 
    msgHabDes = true
    btEntHabDes = true
    verUpre = false //verificar se o campo do nome do usuário foi preenchido
    estado = 'visivel' //para alterar o estado do nome do usuário quando loga entre visível / invisível
    msgDig = ''    
    
    rtcPeerConnection
    roomId
    localStream
    remoteStream
    localVideo // = document.getElementById('local-video') as HTMLVideoElement
    mywindow = global
    
    
    salaCriada: boolean
    
    iceServers = 
    {
        'iceServers':
         [
            { url: 'stun:stun.l.google.com:19302' },    
            { 
                url: 'turn:numb.viagenie.ca',  
                credential: 'muazkh',
                username: 'webrtc@live.com'
            }    
      ]
    }
        
    wecams = []

    id: string;
    gainNode: GainNode

  
    // @ViewChild('divScrool') divScrool: ElementRef
    

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
    //   this.chatService.newUserJoined().subscribe(data => this.listaU.push(data))
    //   this.chatService.videoRec().subscribe(data => this.wecams.push(data) )      
    }

    ngOnInit() 
    {
        // this.socket = io('http://localhost:3000') //Servidor
        // this.socket = io('https://sds-chat.herokuapp.com/')
        this.route.params.subscribe( (parametro: any) => 
        {
            console.log('Parâmetro funcionando nessa BAGAÇA: ', parametro.id )                
        }) 

        //   this.localVideo = document.getElementById ('local-video') as HTMLVideoElement
        //   navigator.mediaDevices.getUserMedia(this.mediaConstraints)
        //   .then( stream => 
        //     {  
        //         this.localVideo.srcObject = stream                
        //         // stream.getTracks().forEach(track => { this.peerConnection.addTrack(track, stream) })                
        //     },
            
        //         error => { console.error('Erro na requisição de áudio e vídeo: ' + error) }
        //     )

        // setInterval( () => { this.video() }, 35) 
        this.joinRoom()
        // this.setLocalStream()
    
    }
  
    sendMessage()
    {            
        this.socket.emit('new message', { user: this.usuario, mensage: this.messageText })
        let msgValue = document.getElementById('txt-mensagem') as HTMLInputElement
        console.log('mensagem digitada: ', msgValue.value)
        this.messageText = ''
        this.estado = 'escondido'
    }

    async joinRoom()
    {
        this.roomId = location.href.substr(27, location.href.length)        
        this.socket.emit('join-room', this.roomId )
        this.salaCriada = true

        console.log('Sala ID: ', this.roomId)

        // SOCKET EVENT CALLBACKS
        this.socket.on('room_created', async () => 
        {
            console.log('Socket event callback: room_created')
            this.salaCriada = true
            // await this.setLocalStream()                        
        })

        this.socket.on('room_joined', async data => 
        {
            this.numUsers = data.utotal            
            console.log(`Cliente ${ this.numUsers } entrou na sala:  ${ data.sala_id }`)
            this.socket.emit('start_call', this.roomId) 

            // await this.setLocalStream()     
        })

        this.socket.on('start_call', async () => 
        {
            console.log('Socket event callback: start_call -> aqui chegou')
                    

            if (this.salaCriada)
            {               
                // this.rtcPeerConnection = new RTCPeerConnection(this.iceServers)
                // this.addLocalTracks(this.rtcPeerConnection)
                // this.rtcPeerConnection.ontrack = this.setRemoteStream
                // this.rtcPeerConnection.onicecandidate = this.sendIceCandidate
                // await this.createOffer(this.rtcPeerConnection)

                console.log('Aqui chegou: setRemoteDesc')
            }
        })                           
    }
    
    
    novoUsuario()
    {
        // this.chatService.joinRoom({ user: this.user })        
        this.socket.emit('add user', { user: this.user, message: 'Usuário conectado'  })
        this.usuario = this.user            
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
        this.chatService.leaveRoom({ user: this.user, room: this.room})
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
       
    async compWebCam() //compartilhar webcam
    {                         
        if(this.numUsers >= 1)
        {
            navigator.mediaDevices.getUserMedia( { video: true, audio: true })
            .then(stream =>
            {
                let localVideo = document.getElementById('local-video') as HTMLVideoElement
                localVideo.srcObject = stream
                this.localStream = stream
                console.log('STREAM: ', stream)                                                           
            })
        }                    
        else
            alert('Não existem usuírios na sala com quem compartilhar sua cam')           
    }
                  
    public async startCall() 
    {    
        let pc1Local, pc1Remote, pc2Local, pc2Remote, pc3Local, pc3Remote
        const offerOptions = { offerToReceiveAudio: 1, offerToReceiveVideo: 1 }
               
        console.log('Starting calls')
       
        const stream =   navigator.mediaDevices.getUserMedia(this.mediaConstraints)
       
        // const audioTracks = (await stream).getAudioTracks()
        // const videoTracks = (await stream).getVideoTracks();
        const audioTracks = this.mywindow.localStream.getAudioTracks()
        const videoTracks = this.mywindow.localStream.getVideoTracks()

        if (audioTracks.length > 0) {
            console.log(`Usando o dispositivo de áudio: ${audioTracks[0].label}`);
        }
        if (videoTracks.length > 0) {
            console.log(`Usando o dispositivo de vídeo: ${videoTracks[0].label}`);
        }
        // Create an RTCPeerConnection via the polyfill.

        // let servers = 
        // {
        //     'iceServers':
        //      [
        //         { url: 'stun:stun.l.google.com:19302' },    
        //         { 
        //             url: 'turn:numb.viagenie.ca',  
        //             credential: 'muazkh',
        //             username: 'webrtc@live.com'
        //         }    
        //   ]
        // }

        const iceServers = 
        {
        iceServers: 
            [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                { urls: 'stun:stun4.l.google.com:19302' }
            ]
        }

        //funções ICECandidate
        let gotRemoteStream1 = function gotRemoteStream1(e) 
        {
            let videoRemoto = document.getElementById('remote-video') as HTMLVideoElement
            if (videoRemoto.srcObject !== e.streams[0]) 
            {
                videoRemoto.srcObject = e.streams[0]
                console.log('pc1: received remote stream')
            }
        }

        let gotRemoteStream2 = function gotRemoteStream2(e) 
        {
            let video2 = document.getElementById('video2') as HTMLVideoElement
            if (video2.srcObject !== e.streams[0]) 
            {
                video2.srcObject = e.streams[0];
                console.log('pc2: received remote stream');
            }
        }

        //função acrescentada por mim, apenas copiei e colei e atualizei
        let gotRemoteStream3 = function gotRemoteStream3(e) 
        {
            let video3 = document.getElementById('video3') as HTMLVideoElement
            if (video3.srcObject !== e.streams[0]) 
            {
                video3.srcObject = e.streams[0];
                console.log('pc3: recebeu stream remoto');
            }
        }
       
        let onAddIceCandidateError = function  onAddIceCandidateError(error)
        {
            console.log(`Failed to add ICE candidate: ${error.toString()}`);
        }

        let handleCandidate = function handleCandidate(candidate, dest, prefix, type) 
        {
            dest.addIceCandidate(candidate)
                .then(console.log('Adicionado IceCandidate com sucesso!'), onAddIceCandidateError)
            console.log(`${prefix}New ${type} ICE candidate: ${candidate ? candidate.candidate : '(null)'}`)
        }


        let iceCallback1Local = function  iceCallback1Local(event) 
        {
            handleCandidate(event.candidate, pc1Remote, 'pc1: ', 'local');
        }

        let iceCallback1Remote = function iceCallback1Remote(event) 
        {
            handleCandidate(event.candidate, pc1Local, 'pc1: ', 'remote')
        }

        let iceCallback2Local = function iceCallback2Local(event) 
        {
            handleCandidate(event.candidate, pc2Remote, 'pc2: ', 'local')
        }
     
        let iceCallback2Remote = function iceCallback2Remote(event) 
        {
            handleCandidate(event.candidate, pc2Local, 'pc2: ', 'remote')
        }

        let iceCallback3Local = function iceCallback3Local(event)
        {
            handleCandidate(event.candidate, pc3Remote, 'pc3: ', 'local')
        }

        let iceCallback3Remote = function iceCallback3Remote(event)
        {
            handleCandidate(event.candidate, pc3Local, 'pc3: ', 'remote')
        }

        // const servers = null
        pc1Local  = new RTCPeerConnection(iceServers)
        pc1Remote = new RTCPeerConnection(iceServers)
        pc1Remote.ontrack = gotRemoteStream1
        pc1Local.onicecandidate = iceCallback1Local
        pc1Remote.onicecandidate = iceCallback1Remote
        console.log('pc1: created local and remote peer connection objects');

        pc2Local = new RTCPeerConnection(iceServers);
        pc2Remote = new RTCPeerConnection(iceServers);
        pc2Remote.ontrack = gotRemoteStream2;
        pc2Local.onicecandidate = iceCallback2Local;
        pc2Remote.onicecandidate = iceCallback2Remote;
        console.log('pc2: created local and remote peer connection objects')

        //acrescentei para tratativas do PC3 remoto
        pc3Local = new RTCPeerConnection(iceServers);
        pc3Remote = new RTCPeerConnection(iceServers);
        pc3Remote.ontrack = gotRemoteStream3;
        pc3Local.onicecandidate = iceCallback3Local;
        pc3Remote.onicecandidate = iceCallback3Remote;
        console.log('pc3: criado objetos peer de conexão local e remoto')
        //fim tratativa do PC3 remoto

        //funções externas a essa que precisei puxar e atribuir a variáveis pq fora não funcionava

        let gotDescription1Remote = function  gotDescription1Remote(desc) 
        {
            pc1Remote.setLocalDescription(desc);
            console.log(`Answer from pc1Remote\n${desc.sdp}`);
            pc1Local.setRemoteDescription(desc)
        }

        let onCreateSessionDescriptionError = function onCreateSessionDescriptionError(error) 
        {
            console.log(`Failed to create session description: ${error.toString()}`);
        }

        let gotDescription1Local =  function gotDescription1Local(desc) 
        {                                   
            pc1Local.setLocalDescription(desc)
            console.log(`Offer from pc1Local\n${desc.sdp}`)
            pc1Remote.setRemoteDescription(desc);
            // Since the 'remote' side has no media stream we need
            // to pass in the right constraints in order for it to
            // accept the incoming offer of audio and video.
            pc1Remote.createAnswer().then(gotDescription1Remote, onCreateSessionDescriptionError)
        }

        let gotDescription2Remote = function  gotDescription2Remote(desc)
        {
            pc2Remote.setLocalDescription(desc)
            console.log(`Answer from pc2Remote\n${desc.sdp}`)
            pc2Local.setRemoteDescription(desc);
        }

        let gotDescription2Local =  function gotDescription2Local(desc) 
        {
            let erro = function onCreateSessionDescriptionError(error) 
            {
                console.log(`Failed to create session description: ${error.toString()}`);
            }
    
            pc2Local.setLocalDescription(desc)
            console.log(`Offer from pc2Local\n${desc.sdp}`)
            pc2Remote.setRemoteDescription(desc);
            // Since the 'remote' side has no media stream we need
            // to pass in the right constraints in order for it to
            // accept the incoming offer of audio and video.
            pc2Remote.createAnswer().then(gotDescription2Remote, erro)
        }
        
        let gotDesc3Remote = function  gotDescription3Remote(desc) 
        {
            pc3Remote.setLocalDescription(desc)
            console.log(`Restposta do PC 3 remoto\n${desc.sdp}`)
            pc3Local.setRemoteDescription(desc)
        }

        let gotDescription3Local = function gotDescription3Local(desc)
        {
            let erro = function onCreateSessionDescriptionError(error) 
            {
                console.log(`Failed to create session description: ${error.toString()}`);
            }
    
            pc3Local.setLocalDescription(desc)
            console.log(`Oferta do PC 3 Local\n${desc.sdp}`)
            pc3Remote.setRemoteDescription(desc);
            // Since the 'remote' side has no media stream we need
            // to pass in the right constraints in order for it to
            // accept the incoming offer of audio and video.
            pc3Remote.createAnswer().then(gotDesc3Remote, erro);
        }

        this.mywindow.localStream.getTracks().forEach(track => pc1Local.addTrack(track, this.mywindow.localStream))
        console.log('Adding local stream to pc1Local')
        pc1Local
            .createOffer(offerOptions)
            .then(gotDescription1Local, onCreateSessionDescriptionError);

        this.mywindow.localStream.getTracks().forEach(track => pc2Local.addTrack(track, this.mywindow.localStream));
        console.log('Adding local stream to pc2Local');
        pc2Local.createOffer(offerOptions)
            .then(gotDescription2Local, onCreateSessionDescriptionError)
            

        // //acrescentei para tratativa do PC3 remoto
        this.mywindow.localStream.getTracks().forEach(track => pc3Local.addTrack(track, this.mywindow.localStream))
        console.log('Adicionado stream local para o PC3 local')
        pc3Local.createOffer(offerOptions)
            .then(gotDescription3Local, onCreateSessionDescriptionError)

        //fim da tratativa que acrescentei para o PC3   
                       
    }          
    

    //acrescentado por mim para o quarto PC   

    gotStream(stream) 
    {
        let videoLocal = document.getElementById('local-video') as HTMLVideoElement
        let mywindow = global
        console.log('Received local stream');
        videoLocal.srcObject = stream;
        mywindow.localStream = stream               
    }    
    

           
    
    //fim das minha adições neste trecho
   

    start() 
    {
        console.log('Requesting local stream')
        navigator.mediaDevices
            .getUserMedia({
              audio: true,
              video: true
            })
            .then(this.gotStream)
            .catch(e => console.log('getUserMedia() error: ', e))

            // this.callBtnHabDes = false
            // this.startBtnHabDes = true  
      }
    
}  