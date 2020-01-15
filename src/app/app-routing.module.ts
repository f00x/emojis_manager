import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmojiComponent } from './list-emoji/list-emoji.component';
import { StorageEmojisService, EmojiStatus, Emoji } from './storage-emojis.service';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([

    { path: 'all', component: ListEmojiComponent, data: { WhiteListStatus: [EmojiStatus.default, EmojiStatus.favorite],title:'Все' } },
    { path: 'favorite', component: ListEmojiComponent, data: { WhiteListStatus: [EmojiStatus.favorite], title:'Любимые' } },
    { path: 'deleted', component: ListEmojiComponent, data: { WhiteListStatus: [EmojiStatus.deleted], title:'Удалённые' } },
    { path: '**', redirectTo: 'all' },
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
