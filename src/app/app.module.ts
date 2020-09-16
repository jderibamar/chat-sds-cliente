import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgxErrorsModule } from '@hackages/ngxerrors'
import { AppRoutingModule } from './app-routing.module'
import { RouterModule } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { RoomComponent } from './pages/home/room/room.component'
import { AppComponent } from './app.component'
import { HomeComponent } from './pages/home/home.component'

// import { AngularFireModule } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireStorageModule } from '@angular/fire/storage'
import { AngularFireAuthModule } from '@angular/fire/auth'
// import { environment } from '../environments/environment'

import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ChatService } from './services/chat.service'



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,    
    RoomComponent   
  ],
  imports:
  [
    BrowserModule,    
    FormsModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    AppRoutingModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,

    // AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, NoopAnimationsModule // imports firebase/storage only needed for storage features
  ],
  providers: [ ChatService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
