// await this.setLocalStream(this.mediaConstraints)

//         this.socket.on('webrtc_offer', async (event) => 
//         {
//             console.log('Socket event callback: webrtc_offer')
        
//             if (!this.salaCriada)
//             {
//                 this.rtcPeerConnection = new RTCPeerConnection(this.iceServers)
//                 this.addLocalTracks(this.rtcPeerConnection)
//                 this.rtcPeerConnection.ontrack = this.setRemoteStream(event)
//                 this.rtcPeerConnection.onicecandidate = this.sendIceCandidate
//                 this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
//                 await this.createAnswer(this.rtcPeerConnection)
//             }
//         })

//         this.socket.on('webrtc_answer', (event) => 
//         {
//             console.log('Socket event callback: webrtc_answer')        
//             this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
//         })
               
        
//         this.socket.on('webrtc_ice_candidate', (event) => 
//         {
//             console.log('Socket event callback: webrtc_ice_candidate')
            
//             if (event.sdp.type === 'offer') 
//             {
//                 this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event.sdp))        
//                   .then(() => navigator.mediaDevices.getUserMedia({audio: true, video: true}))        
//                   .then(stream => this.rtcPeerConnection.addStream(stream))                       
//                   .then(() => this.rtcPeerConnection.createAnswer())    
//                   .then(answer => this.rtcPeerConnection.setLocalDescription(answer))        
//                 //   .then(() => this.sendMessage({sdp: this.rtcPeerConnection.localDescription.type}))    
//           }

//             // ICE candidate configuration.                        
//                 var candidate = new RTCIceCandidate(
//                 {
//                 sdpMLineIndex: event.label,
//                 candidate: event.candidate,
//                 })
//                 this.rtcPeerConnection.addIceCandidate(candidate, this.onAddIceCandidateSuccess, this.onAddIceCandidateError)
               
//         })

//         async startCall()
//         {
//             // SOCKET EVENT CALLBACKS
//             let roomId = location.href.substr(27, location.href.length)
//             let sessionDescription
    
//             console.log('Função start_call chamada')                                             
                
//         }  
        
     
//         async setLocalStream(mediaConstraints) 
//         {
//             let stream
//             try
//             {
//                 this.localVideoComponent = document.getElementById('local-video') as HTMLVideoElement
//                 stream = await navigator.mediaDevices.getUserMedia(this.mediaConstraints)
//                 this.localStream = stream
//                 this.localVideoComponent.srcObject = stream
//             } 
//             catch (error) { console.error('Erro ao obter userMedia', error) }        
//         }
    
//         async addLocalTracks(rtcPeerConnection) 
//         {
//             this.localVideoComponent = document.getElementById('local-video') as HTMLVideoElement
//             let localStream = await navigator.mediaDevices.getUserMedia(this.mediaConstraints)
//             localStream.getTracks().forEach((track) => 
//             {
//                 rtcPeerConnection.addTrack(track, this.localStream)
//             })
//         }        

//         async createOffer(rtcPeerConnection) 
//         {
//             let sessionDescription   
//             let roomId = location.href.substr(27, location.href.length)     
//             try 
//             {
//               sessionDescription = await rtcPeerConnection.createOffer()
//               rtcPeerConnection.setLocalDescription(sessionDescription)
//             }
//             catch (error) { console.error(error) }
          
//             this.socket.emit('webrtc_offer',
//             {
//               type: 'webrtc_offer',
//               sdp: sessionDescription,
//               roomId
//             })
//         }
        
//         async createAnswer(rtcPeerConnection) 
//         {
//             let sessionDescription
//             let roomId = location.href.substr(27, location.href.length)        
//             try {
//               sessionDescription = await rtcPeerConnection.createAnswer()
//               rtcPeerConnection.setLocalDescription(sessionDescription)
//             } catch (error) {
//               console.error(error)
//             }
          
//             this.socket.emit('webrtc_answer', 
//             {
//               type: 'webrtc_answer',
//               sdp: sessionDescription,
//               roomId
//             })
//         }
        
//         setRemoteStream(event) 
//         {
//             this.remoteVideoComponent.srcObject = event.streams[0]
//             this.remoteStream = event.stream
    
//             console.log('Function setRemoteStream foi chamada')
//         }
        
//         sendIceCandidate(event) 
//         {        
//             if (event.candidate) 
//             {
//                 let roomId = location.href.substr(27, location.href.length) 
//                 let socket = io('http://localhost:3000')
//                 socket.emit('webrtc_ice_candidate', 
//                 {
//                     roomId,
//                     label: event.candidate.sdpMLineIndex,
//                     candidate: event.candidate.candidate,
//                 })
//             }
//         }
    
//         mostrarVideo(video, context)
//         {
//              const canvas = document.getElementById('preview') as HTMLCanvasElement
//              context = canvas.getContext('2d')
    
//             canvas.width = 800
//             canvas.height = 600
    
//             context.canvas.width = canvas.width
//             context.canvas.height = canvas.height  
            
    
//             context.drawImage(video,0,0, context.width, context.height)
            
    
//             this.socket.emit('stream', canvas.toDataURL('image/webp') )
        
//             this.socket.on('stream', imwebcam => 
//             {
//                 let img = document.getElementById('imgremoto') as HTMLImageElement
//                 img.src = imwebcam.img
        
//                 // $('#logger').text(imwebcam)
//             })
//         }
//          async callUser() 
//          {
//             const offer = await this.rtcPeerConnection.createOffer()
//             await this.rtcPeerConnection.setLocalDescription(new RTCSessionDescription(offer));
          
//             this.socket.emit("call-user", { offer })
    
//             this.socket.on('call-made', async data =>
//             {
//                 await this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(data.offer) )
//             })
    
//             this.rtcPeerConnection.ontrack = ( ({ streams: [stream]  }) =>
//             {
//                     const remoteVideo = document.getElementById('remote-video') as HTMLVideoElement
//                     if(remoteVideo) remoteVideo.srcObject
//             } ) 
    
//          }         


        // const p = new Peer ({ initiator: location.hash ==='#1', trickle: false })
        // p.on('signal', token => console.log ('Token simple-peer', token))

        // setInterval( () =>
        // {
        //     this.mostrarVideo(this.video, context)
        // },70 )
    
        // const imagem = document.createElement('video') as HTMLVideoElement
        // navigator.mediaDevices.getUserMedia(this.constraints)
        // .then( stream => 
        //   {   
        //     //   video.src = window.URL.createObjectURL(stream)
        //       imagem.srcObject = stream
        //       imagem.play()
                        
        //       this.socket.emit('stream', imagem)

        //       this.socket.on('stream', imagem =>
        //       {
        //           this.wecams.push(imagem)
    
        //           console.log('Webcams: ', this.wecams)
        //           console.log('Var imagem: ', imagem)    
                  
        //       })
        //       // video.play()                
        //       // stream.getTracks().forEach(track => { this.peerConnection.addTrack(track, stream) })                
        //   },
          
        //       error => { console.error('Erro na requisição de áudio e vídeo: ' + error) }
        //   ) 
        

//  async makeCall() 
    //  {
    //     const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    //     const peerConnection = new RTCPeerConnection(configuration);
    //     signalingChannel.addEventListener('message', async message => {
    //         if (message.answer) {
    //             const remoteDesc = new RTCSessionDescription(message.answer);
    //             await peerConnection.setRemoteDescription(remoteDesc);
    //         }
    //     });
    //     const offer = await peerConnection.createOffer();
    //     await peerConnection.setLocalDescription(offer);
    //     signalingChannel.send({'offer': offer});
    // }        



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

//   imagemTeste()
//   {
//       this.socket.on('imagem', imagem => 
//       { 
//           const imgElm = document.getElementById('remote-video') as HTMLVideoElement
//           imgElm.src = `data:imagem/jpeg;base64, ${imagem}`
//       })
      
//   }  

 // this.socket.emit('stream', canvas.toDataURL('image/webp'))

                // // this.socket.emit('stream', stream)
                // this.socket.on('stream', imagem =>
                // {
                //     let img = document.getElementById('play') as HTMLImageElement
                //     img.src = imagem.img    

                //     console.log('Resposta do servidor: ', imagem)
                //     // let vremoto = document.getElementById('remote-video') as HTMLVideoElement                                        
                    
                // } )

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

// async compWebCam() //compartilhar webcam
// {                         
//         if(this.numUsers >= 1)
//         {
//         // navigator.mediaDevices.getUserMedia( { video: true, audio: true })
//         // .then(stream =>
//         // {
//         //     let localVideo = document.getElementById('local-video') as HTMLVideoElement
//         //     localVideo.srcObject = stream
//         //     this.localStream = stream
//         //     console.log('STREAM: ', stream)                                                           
//         // })            
                        
//         }                    
//         else
//         alert('Não existem usuírios na sala com quem compartilhar sua cam')       
// }