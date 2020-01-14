import { Component, OnInit, Injectable} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import { StorageEmojisService, EmojiStatus, Emoji } from '../storage-emojis.service';
@Component({
  selector: 'list-emoji',
  templateUrl: './list-emoji.component.html',
  styleUrls: ['./list-emoji.component.scss']
})
@Injectable()
export class ListEmojiComponent implements OnInit {
  protected WhiteListEmojiStatus:EmojiStatus[];
  public findString:string='';
  public listEmoji:Emoji[];

  constructor(private route: ActivatedRoute,private StorageEmojis:StorageEmojisService ) { 
    let configWhiteList=route.snapshot.data['WhiteListStatus'];
    configWhiteList=configWhiteList instanceof Array?configWhiteList:[]
    this.setWhiteListStatus(configWhiteList)
    this.listEmoji=this.StorageEmojis.getEmojiList(this.WhiteListEmojiStatus)
  }
  

  public setWhiteListStatus(list:EmojiStatus[]):this {
    if (list==[])
    {
      list=Object.values(EmojiStatus);
    }
    this.WhiteListEmojiStatus=list
    return this
  }

  ngOnInit() {
  }

}
