import { Component, OnInit, Injectable} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import { StorageEmojisService, EmojiStatus, Emoji } from '../storage-emojis.service';
import {NgForm} from '@angular/forms';
@Component({
  selector: 'list-emoji',
  templateUrl: './list-emoji.component.html',
  styleUrls: ['./list-emoji.component.scss']
})
@Injectable()
export class ListEmojiComponent implements OnInit {
  protected WhiteListEmojiStatus:EmojiStatus[];
  public listEmoji:Emoji[];
  protected isLoad=false;
  readonly EmojiStatus= EmojiStatus;
  public title:string='Emoji';

  public searchQuery:string=''


  constructor(private route: ActivatedRoute,private StorageEmojis:StorageEmojisService ) { 
    let configWhiteList=route.snapshot.data['WhiteListStatus'];
    if(route.snapshot.data['title'])
    {this.title=route.snapshot.data['title']

    }
    configWhiteList=configWhiteList instanceof Array?configWhiteList:[]
    this.setWhiteListStatus(configWhiteList)
    let self =this;
    if(this.StorageEmojis.isFirstLoad){
      self.isLoad=true
          self.listEmoji=self.StorageEmojis.getEmojiList(self.WhiteListEmojiStatus,self.searchQuery)
    }else{
      this.StorageEmojis.EventLoad$.subscribe(
      function(isSuccess)  {
        if(isSuccess&&!self.isLoad){
          self.isLoad=true
          self.listEmoji=self.StorageEmojis.getEmojiList(self.WhiteListEmojiStatus,self.searchQuery)}
          else
          {console.log('eventLoadList')}
      }
      );
    }
  
    
  }
  public runFind()
  {
    this.listEmoji=this.StorageEmojis.getEmojiList(this.WhiteListEmojiStatus,this.searchQuery)
  }
  public setStatusEmoji(emoji:Emoji,status:EmojiStatus):this
  {
    this.listEmoji=this.StorageEmojis.setStatusEmoji(emoji, status).getEmojiList(this.WhiteListEmojiStatus,this.searchQuery)
  
    return this
  }

  public setWhiteListStatus(list:EmojiStatus[]):this {
    if (list==[])
    {
      list=Object.values(EmojiStatus);
    }
    this.WhiteListEmojiStatus=list
    return this
  }

  ngOnInit(): void {

  }

}
