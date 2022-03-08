import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/services';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit, OnChanges {
  @Input() photoUrl!: string;
  @Input() photoWidth: string;
  @Input() photoHeight: string;
  @Input() photoBorder: string;
  url!: Observable<string | null>;

  constructor(private storage: StorageService) {
    this.photoWidth = '2';
    this.photoHeight = '2';
    this.photoBorder = '50';
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.photoUrl) {
      this.url = this.storage.getPhoto(this.photoUrl);
    }
  }
}
