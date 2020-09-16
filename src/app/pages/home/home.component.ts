import { Component, OnInit, HostListener } from '@angular/core'
import { FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Router } from '@angular/router'

// import * as Handlebars from 'handlebars'
// import { SimpleWebRTC } from 'simplewebrtc'
import adapter from 'webrtc-adapter'
// import * as Peer  from 'peerjs'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit 
{
    // _navigator = <any> navigator;
    localStream;            
    outroid: null
    form: FormGroup
    nomeU

    constructor(fc: FormBuilder, private route: ActivatedRoute, private rota: Router)
    {        
        // this.form = fc.group(
        //   {
        //       'roomName': [null, null],
        //       'username': [null, null]
        //   }
        // )
    }
    

    ngOnInit(): void
    {                  
        
      console.log('Nome usuário: ', this.nomeU)
      //Conexão         

        //Chamada
        // navigator.mediaDevices.getUserMedia(this.constraints)
        // .then(stream => 
        //   {
        //       const call = this.peer.call('another-peers-id', stream)
        //       call.on('stream', (remoteStream) =>
        //       {

        //       })
        //   })
        //   .catch( (erro) => console.error('Falhou ao obter o stream local', erro) ) 


        // const video = this.hardwareVideo.nativeElement;
        // this._navigator = <any>navigator;
    
        // this._navigator.getUserMedia = ( this._navigator.getUserMedia || this._navigator.webkitGetUserMedia
        // || this._navigator.mozGetUserMedia || this._navigator.msGetUserMedia );
    
        // this._navigator.mediaDevices.getUserMedia({video: true})
        //   .then((stream) => {
        //     this.localStream = stream;
        //     video.src = window.URL.createObjectURL(stream);
        //     video.play();
        // });
  
    }

  
    // conectar()
    // {
    //   const conn = this.peer.connect(this.outroid)
    //   conn.on('open', () => conn.send('Hello peer!'))   

    //   //Recepção
    //    this.peer.on('connection', (conn) => 
    //    {
    //       conn.on('data', (data) => 
    //       {
    //         // Will print 'hi!'
    //         console.log(data);
    //       });
    //       conn.on('open', () => { conn.send('hello!') })
    //     })
    // }

    // @HostListener('load') onload() 
    // {

    // }
    
    criarSala()
    {
        this.rota.navigate(['room'])
    }

    stopStream() 
    {
      const tracks = this.localStream.getTracks();
      tracks.forEach((track) => { track.stop() })

    }

}
