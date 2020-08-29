import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CreateRoomComponent } from './pages/create-room/create-room.component'
import { EnterRoomComponent } from './pages/enter-room/enter-room.component'
import { RoomComponent } from './pages/home/room/room.component'
import { HomeComponent } from './pages/home/home.component'
import  { v4 }  from 'uuid'

const routes: Routes = 
[   
      
   { path: '', component: HomeComponent},
   { path: 'create-room', component: CreateRoomComponent },
   { path: 'enter-room', component: EnterRoomComponent  },
   { path: 'room', redirectTo: `/room/${ v4() }`,  pathMatch: 'full' }, //v4() serve para gerar um ID aleatório
   { path: 'room/:id', component: RoomComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
